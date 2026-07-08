using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Blueprint.Core.Entities;
using Blueprint.Core.Interfaces;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Blueprint.Infrastructure.Services
{
    public class AstraDbService : IRepositoryDbService
    {
        private readonly HttpClient _httpClient;
        private readonly string _endpoint;
        private readonly string _keyspace;
        private readonly string _collection;
        private readonly ILogger<AstraDbService> _logger;

        public AstraDbService(IConfiguration config, ILogger<AstraDbService> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
            var token = config["Astra:Token"];
            _httpClient.DefaultRequestHeaders.Add("Token", token);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var baseEndpoint = config["Astra:Endpoint"]?.TrimEnd('/');
            _keyspace = config["Astra:Keyspace"] ?? "default_keyspace";
            _collection = config["Astra:Collection"] ?? "repositories";
            
            _endpoint = $"{baseEndpoint}/api/json/v1/{_keyspace}/{_collection}";
        }

        public async Task SaveRepositoryAsync(AnalyzedRepository repository)
        {
            var document = new
            {
                _id = repository.Id,
                githubUrl = repository.GithubUrl,
                name = repository.Name,
                analyzedAt = repository.AnalyzedAt,
                status = repository.Status,
                framework = repository.Framework,
                language = repository.Language,
                metrics = string.IsNullOrEmpty(repository.MetricsJson) ? null : ChunkString(repository.MetricsJson, 7500),
                fileTree = string.IsNullOrEmpty(repository.FileTreeJson) ? null : ChunkString(repository.FileTreeJson, 7500),
                aiInsights = string.IsNullOrEmpty(repository.AiInsightsJson) ? null : ChunkString(repository.AiInsightsJson, 7500)
            };

            var payload = new
            {
                findOneAndReplace = new
                {
                    filter = new { _id = repository.Id },
                    replacement = document,
                    options = new { upsert = true }
                }
            };


            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode || responseBody.Contains("\"errors\":"))
            {
                _logger.LogError("Failed to save repository to Astra DB: {Response}", responseBody);
                throw new System.Exception($"Failed to save to Astra DB: {responseBody}");
            }
        }

        public async Task<AnalyzedRepository?> GetRepositoryAsync(string id)
        {
            var payload = new
            {
                findOne = new
                {
                    filter = new { _id = id }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            
            if (!response.IsSuccessStatusCode) return null;

            var responseBody = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseBody);
            
            if (doc.RootElement.TryGetProperty("data", out var dataElement) && dataElement.TryGetProperty("document", out var documentElement))
            {
                if (documentElement.ValueKind == JsonValueKind.Null) return null;

                return new AnalyzedRepository
                {
                    Id = documentElement.GetProperty("_id").GetString() ?? id,
                    GithubUrl = documentElement.TryGetProperty("githubUrl", out var gUrl) ? gUrl.GetString() ?? "" : "",
                    Name = documentElement.TryGetProperty("name", out var name) ? name.GetString() ?? "" : "",
                    AnalyzedAt = documentElement.TryGetProperty("analyzedAt", out var at) ? at.GetDateTime() : System.DateTime.UtcNow,
                    Status = documentElement.TryGetProperty("status", out var stat) ? stat.GetString() ?? "" : "",
                    Framework = documentElement.TryGetProperty("framework", out var fw) ? fw.GetString() ?? "Unknown" : "Unknown",
                    Language = documentElement.TryGetProperty("language", out var lang) ? lang.GetString() ?? "Unknown" : "Unknown",
                    MetricsJson = documentElement.TryGetProperty("metrics", out var m) ? (m.ValueKind == JsonValueKind.String ? m.GetString() ?? "" : (m.ValueKind == JsonValueKind.Array ? string.Join("", m.EnumerateArray().Select(x => x.GetString())) : m.ToString())) : "",
                    FileTreeJson = documentElement.TryGetProperty("fileTree", out var f) ? (f.ValueKind == JsonValueKind.String ? f.GetString() ?? "" : (f.ValueKind == JsonValueKind.Array ? string.Join("", f.EnumerateArray().Select(x => x.GetString())) : f.ToString())) : "",
                    AiInsightsJson = documentElement.TryGetProperty("aiInsights", out var ai) ? (ai.ValueKind == JsonValueKind.String ? ai.GetString() ?? "" : (ai.ValueKind == JsonValueKind.Array ? string.Join("", ai.EnumerateArray().Select(x => x.GetString())) : ai.ToString())) : ""
                };
            }

            return null;
        }

        public async Task<List<AnalyzedRepository>> GetAllRepositoriesAsync()
        {
            var payload = new
            {
                find = new
                {
                    filter = new { }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            
            var list = new List<AnalyzedRepository>();
            if (!response.IsSuccessStatusCode) return list;

            var responseBody = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseBody);
            
            if (doc.RootElement.TryGetProperty("data", out var dataElement) && dataElement.TryGetProperty("documents", out var documentsElement))
            {
                foreach (var docElement in documentsElement.EnumerateArray())
                {
                    list.Add(new AnalyzedRepository
                    {
                        Id = docElement.TryGetProperty("_id", out var i) ? i.GetString() ?? "" : "",
                        GithubUrl = docElement.TryGetProperty("githubUrl", out var g) ? g.GetString() ?? "" : "",
                        Name = docElement.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "",
                        AnalyzedAt = docElement.TryGetProperty("analyzedAt", out var a) ? a.GetDateTime() : System.DateTime.UtcNow,
                        Status = docElement.TryGetProperty("status", out var s) ? s.GetString() ?? "" : "",
                        Framework = docElement.TryGetProperty("framework", out var fw) ? fw.GetString() ?? "Unknown" : "Unknown",
                        Language = docElement.TryGetProperty("language", out var lang) ? lang.GetString() ?? "Unknown" : "Unknown",
                        MetricsJson = docElement.TryGetProperty("metrics", out var m) ? (m.ValueKind == JsonValueKind.String ? m.GetString() ?? "" : (m.ValueKind == JsonValueKind.Array ? string.Join("", m.EnumerateArray().Select(x => x.GetString())) : m.ToString())) : "",
                        FileTreeJson = docElement.TryGetProperty("fileTree", out var f) ? (f.ValueKind == JsonValueKind.String ? f.GetString() ?? "" : (f.ValueKind == JsonValueKind.Array ? string.Join("", f.EnumerateArray().Select(x => x.GetString())) : f.ToString())) : "",
                        AiInsightsJson = docElement.TryGetProperty("aiInsights", out var ai) ? (ai.ValueKind == JsonValueKind.String ? ai.GetString() ?? "" : (ai.ValueKind == JsonValueKind.Array ? string.Join("", ai.EnumerateArray().Select(x => x.GetString())) : ai.ToString())) : ""
                    });
                }
            }

            return list;
        }

        public async Task DeleteRepositoryAsync(string id)
        {
            var payload = new
            {
                deleteOne = new
                {
                    filter = new { _id = id }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to delete repository from Astra DB: {Response}", responseBody);
                throw new System.Exception($"Failed to delete from Astra DB: {responseBody}");
            }
        }

        private List<string> ChunkString(string str, int chunkSize)
        {
            if (string.IsNullOrEmpty(str)) return new List<string>();
            var chunks = new List<string>();
            for (int i = 0; i < str.Length; i += chunkSize)
            {
                chunks.Add(str.Substring(i, System.Math.Min(chunkSize, str.Length - i)));
            }
            return chunks;
        }
    }
}
