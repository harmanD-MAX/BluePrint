using Microsoft.AspNetCore.Mvc;
using Blueprint.Core.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace Blueprint.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IRepositoryDbService _dbService;

        public DashboardController(IRepositoryDbService dbService)
        {
            _dbService = dbService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var allRepos = await _dbService.GetAllRepositoriesAsync();
            var repos = allRepos
                .Where(r => !string.IsNullOrEmpty(r.GithubUrl))
                .GroupBy(r => r.GithubUrl.ToLowerInvariant())
                .Select(g => g.OrderByDescending(x => x.AnalyzedAt).First())
                .ToList();

            var totalRepos = repos.Count;
            var totalFilesParsed = 0;
            var totalLinesOfCode = 0;
            var totalCodeSmells = 0;
            var totalEndpoints = 0;

            foreach (var repo in repos)
            {
                if (!string.IsNullOrEmpty(repo.MetricsJson))
                {
                    try
                    {
                        using var doc = System.Text.Json.JsonDocument.Parse(repo.MetricsJson);
                        if (doc.RootElement.TryGetProperty("TotalFiles", out var tf))
                        {
                            totalFilesParsed += tf.GetInt32();
                        }
                        if (doc.RootElement.TryGetProperty("TotalMethods", out var tm))
                        {
                            // Approximate lines of code
                            totalLinesOfCode += (tm.GetInt32() * 20);
                        }
                        if (doc.RootElement.TryGetProperty("CodeSmells", out var smells))
                        {
                            if (smells.ValueKind == System.Text.Json.JsonValueKind.Array)
                            {
                                totalCodeSmells += smells.GetArrayLength();
                            }
                        }
                        if (doc.RootElement.TryGetProperty("Endpoints", out var eps))
                        {
                            if (eps.ValueKind == System.Text.Json.JsonValueKind.Array)
                            {
                                totalEndpoints += eps.GetArrayLength();
                            }
                        }
                    }
                    catch { }
                }
            }

            var storageUsed = Math.Round(totalFilesParsed * 0.015, 2); // Approximate storage

            return Ok(new
            {
                TotalAnalyzed = totalRepos,
                TotalFilesParsed = totalFilesParsed,
                TotalLinesOfCode = totalLinesOfCode,
                TotalCodeSmells = totalCodeSmells,
                TotalEndpoints = totalEndpoints,
                StorageUsed = $"{storageUsed} MB"
            });
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentRepositories()
        {
            var repos = await _dbService.GetAllRepositoriesAsync();
            var recent = repos
                .Where(r => !string.IsNullOrEmpty(r.GithubUrl))
                .GroupBy(r => r.GithubUrl.ToLowerInvariant())
                .Select(g => g.OrderByDescending(x => x.AnalyzedAt).First())
                .OrderByDescending(r => r.AnalyzedAt)
                .Select(r => new
            {
                r.Id,
                r.Name,
                r.AnalyzedAt,
                r.Status,
                r.Framework,
                r.Language,
                r.GithubUrl
            });
            return Ok(recent);
        }
    }
}
