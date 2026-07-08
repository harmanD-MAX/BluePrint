using Microsoft.AspNetCore.Mvc;
using Blueprint.Core.Interfaces;

namespace Blueprint.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly IRepositoryDbService _dbService;

        public SearchController(IRepositoryDbService dbService)
        {
            _dbService = dbService;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(new List<object>());
            }

            var query = q.ToLowerInvariant();
            var allRepos = await _dbService.GetAllRepositoriesAsync();
            var results = new List<object>();

            foreach (var repo in allRepos)
            {
                // Match Repository Name
                if (repo.Name.ToLowerInvariant().Contains(query))
                {
                    results.Add(new { Type = "Repository", RepoId = repo.Id, RepoName = repo.Name, Match = repo.Name });
                }

                // Match in AI Insights
                if (!string.IsNullOrEmpty(repo.AiInsightsJson) && repo.AiInsightsJson.ToLowerInvariant().Contains(query))
                {
                     results.Add(new { Type = "Insight", RepoId = repo.Id, RepoName = repo.Name, Match = "Matched in AI Insights" });
                }
                
                // Match in Metrics / File Tree
                if (!string.IsNullOrEmpty(repo.FileTreeJson) && repo.FileTreeJson.ToLowerInvariant().Contains(query))
                {
                     results.Add(new { Type = "File", RepoId = repo.Id, RepoName = repo.Name, Match = "Matched in File Tree" });
                }
            }

            // Deduplicate logic
            var deduped = results
                .GroupBy(r => new { RepoId = r.GetType().GetProperty("RepoId")?.GetValue(r), Type = r.GetType().GetProperty("Type")?.GetValue(r) })
                .Select(g => g.First())
                .Take(20)
                .ToList();

            return Ok(deduped);
        }
    }
}
