using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Blueprint.Core.Interfaces;

namespace Blueprint.Modules.Analysis
{
    public class GeminiAiService : IAiAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GeminiAiService> _logger;
        private readonly string _apiKey;

        public GeminiAiService(IConfiguration config, ILogger<GeminiAiService> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
            _apiKey = config["Gemini:ApiKey"] ?? "<YOUR_GEMINI_API_KEY>";
        }

        public async Task<string> GenerateInsightsAsync(string metricsJson)
        {
            try
            {
                var prompt = @"You are an expert Software Architect.
Analyze the following repository metadata JSON and generate a JSON response with these exact keys:
{
  ""overview"": { ""summary"": """", ""purpose"": """", ""technologies"": [], ""importantModules"": [] },
  ""architecture"": { ""type"": """", ""explanation"": """" },
  ""folderIntelligence"": { ""folderName"": ""explanation"" },
  ""classIntelligence"": { ""className"": ""explanation"" },
  ""onboarding"": { ""startHere"": """", ""entryPoint"": """", ""configuration"": """", ""suggestedReadingOrder"": [] },
  ""dependencyInsights"": { ""mostConnectedClasses"": [], ""criticalServices"": [], ""potentialBottlenecks"": [] },
  ""featuresTab"": { ""features"": [{ ""name"": """", ""description"": """", ""technicalDetails"": """", ""technologies"": [] }], ""resumeBullets"": [] }
}
Do NOT wrap the response in markdown blocks. Return raw JSON.
Ensure 'featuresTab.resumeBullets' contains 3-4 highly detailed, deeply technical summary points specifying exact frameworks, specific algorithmic logic, database layers, and architectural patterns used. IMPORTANT: Start each point with the repository name instead of an action verb (e.g., use 'TripWise implements...' instead of 'Developed...'). Do not use generic terms like 'custom algorithms'; instead, deduce the actual technical logic based on the classes and methods.
Ensure 'featuresTab.features' provides a rigorous technical breakdown of the core functionalities. For 'technicalDetails', deeply analyze the internal implementation by mentioning exact data structures, database operations, API routing, design patterns, and specific algorithms used.
Repository Metadata:
" + metricsJson;

                var payload = new
                {
                    contents = new[]
                    {
                        new { parts = new[] { new { text = prompt } } }
                    },
                    generationConfig = new
                    {
                        response_mime_type = "application/json"
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={_apiKey}", content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Gemini API failed: {Error}", errorBody);
                    return "{}";
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseBody);
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return text ?? "{}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate AI insights.");
                return "{}";
            }
        }
    }
}
