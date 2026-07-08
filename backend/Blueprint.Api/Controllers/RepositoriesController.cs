using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Blueprint.Core.Interfaces;

namespace Blueprint.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Uncomment when Auth is fully active
    public class RepositoriesController : ControllerBase
    {
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IRepositoryDbService _dbService;

        public RepositoriesController(IBackgroundJobClient backgroundJobClient, IRepositoryDbService dbService)
        {
            _backgroundJobClient = backgroundJobClient;
            _dbService = dbService;
        }

        public class ImportRequest
        {
            public string GithubUrl { get; set; } = string.Empty;
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportRepository([FromBody] ImportRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.GithubUrl))
            {
                return BadRequest("GitHub URL is required.");
            }

            var allRepos = await _dbService.GetAllRepositoriesAsync();
            var existing = allRepos.FirstOrDefault(r => string.Equals(r.GithubUrl, request.GithubUrl, StringComparison.OrdinalIgnoreCase));
            
            var repositoryId = existing != null ? existing.Id : Guid.NewGuid().ToString();

            // Enqueue the background job
            _backgroundJobClient.Enqueue<IRepositoryAnalysisJob>(job => 
                job.ProcessRepositoryAsync(repositoryId, request.GithubUrl, CancellationToken.None));

            return Ok(new { RepositoryId = repositoryId, Message = "Analysis started." });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRepository(string id)
        {
            var repo = await _dbService.GetRepositoryAsync(id);
            if (repo == null) return NotFound();
            return Ok(repo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRepository(string id)
        {
            var repo = await _dbService.GetRepositoryAsync(id);
            if (repo != null && !string.IsNullOrEmpty(repo.GithubUrl))
            {
                var allRepos = await _dbService.GetAllRepositoriesAsync();
                var toDelete = allRepos.Where(r => r.GithubUrl.ToLowerInvariant() == repo.GithubUrl.ToLowerInvariant()).ToList();
                foreach (var r in toDelete)
                {
                    await _dbService.DeleteRepositoryAsync(r.Id);
                }
            }
            else
            {
                await _dbService.DeleteRepositoryAsync(id);
            }
            return NoContent();
        }

        [HttpPost("{id}/reanalyze")]
        public async Task<IActionResult> ReanalyzeRepository(string id)
        {
            var repo = await _dbService.GetRepositoryAsync(id);
            if (repo == null) return NotFound();

            repo.Status = "Analyzing";
            await _dbService.SaveRepositoryAsync(repo);

            _backgroundJobClient.Enqueue<IRepositoryAnalysisJob>(job => 
                job.ProcessRepositoryAsync(repo.Id, repo.GithubUrl, CancellationToken.None));

            return Ok(new { Message = "Reanalysis started." });
        }

        [HttpGet("{id}/export")]
        public async Task<IActionResult> ExportDocumentation(string id)
        {
            var repo = await _dbService.GetRepositoryAsync(id);
            if (repo == null) return NotFound();

            var markdown = $"# {repo.Name} Documentation\n\n";
            markdown += $"- **Framework:** {repo.Framework}\n";
            markdown += $"- **Language:** {repo.Language}\n";
            markdown += $"- **Analyzed At:** {repo.AnalyzedAt:g}\n\n";

            if (!string.IsNullOrEmpty(repo.AiInsightsJson))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(repo.AiInsightsJson);
                    var root = doc.RootElement;
                    
                    if (root.TryGetProperty("overview", out var overview))
                    {
                        markdown += "## Overview\n\n";
                        if (overview.TryGetProperty("summary", out var summary)) markdown += $"{summary.GetString()}\n\n";
                        
                        markdown += "### Purpose\n\n";
                        if (overview.TryGetProperty("purpose", out var purpose)) markdown += $"{purpose.GetString()}\n\n";
                        
                        if (overview.TryGetProperty("technologies", out var techs) && techs.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            markdown += "### Technologies\n\n";
                            foreach (var tech in techs.EnumerateArray())
                            {
                                markdown += $"- {tech.GetString()}\n";
                            }
                            markdown += "\n";
                        }
                    }

                    if (root.TryGetProperty("onboarding", out var onboarding))
                    {
                        markdown += "## Onboarding Guide\n\n";
                        markdown += "### Entry Point\n\n";
                        if (onboarding.TryGetProperty("entryPoint", out var ep)) markdown += $"{ep.GetString()}\n\n";
                        
                        markdown += "### Configuration\n\n";
                        if (onboarding.TryGetProperty("configuration", out var conf)) markdown += $"{conf.GetString()}\n\n";
                        
                        if (onboarding.TryGetProperty("suggestedReadingOrder", out var readOrder) && readOrder.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            markdown += "### Reading Order\n\n";
                            var step = 1;
                            foreach (var item in readOrder.EnumerateArray())
                            {
                                markdown += $"{step++}. {item.GetString()}\n";
                            }
                            markdown += "\n";
                        }
                    }
                }
                catch
                {
                    markdown += "> Note: Could not parse AI insights into the documentation.\n\n";
                }
            }
            
            var bytes = System.Text.Encoding.UTF8.GetBytes(markdown);
            return File(bytes, "text/markdown", $"{repo.Name}-Documentation.md");
        }

        [HttpGet("{id}/file")]
        public IActionResult GetFileContent(string id, [FromQuery] string path)
        {
            if (string.IsNullOrWhiteSpace(path)) return BadRequest("Path is required");

            // Strip root folder name from path
            var pathParts = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (pathParts.Length > 1)
            {
                path = string.Join("/", pathParts.Skip(1));
            }

            var fullPath = Path.Combine($"/tmp/blueprint/{id}", path);
            
            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound($"File not found at {fullPath}");
            }

            try 
            {
                var content = System.IO.File.ReadAllText(fullPath);
                return Content(content, "text/plain");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
