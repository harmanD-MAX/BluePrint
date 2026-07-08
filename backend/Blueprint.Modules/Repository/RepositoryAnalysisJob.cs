using Microsoft.Extensions.Logging;
using Blueprint.Core.Interfaces;
using Blueprint.Core.Entities;
using System.Text.Json;

namespace Blueprint.Modules.Repository
{
    public class RepositoryAnalysisJob : IRepositoryAnalysisJob
    {
        private readonly IRepositoryCloneService _cloneService;
        private readonly IParserService _parserService;
        private readonly INotificationService _notificationService;
        private readonly IRepositoryDbService _dbService;
        private readonly IAiAnalysisService _aiService;
        private readonly ILogger<RepositoryAnalysisJob> _logger;

        public RepositoryAnalysisJob(
            IRepositoryCloneService cloneService, 
            IParserService parserService, 
            INotificationService notificationService, 
            IRepositoryDbService dbService,
            IAiAnalysisService aiService,
            ILogger<RepositoryAnalysisJob> logger)
        {
            _cloneService = cloneService;
            _parserService = parserService;
            _notificationService = notificationService;
            _dbService = dbService;
            _aiService = aiService;
            _logger = logger;
        }

        public async Task ProcessRepositoryAsync(string repositoryId, string githubUrl, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Starting job for {RepoId}", repositoryId);
                await _notificationService.SendAnalysisProgressAsync(repositoryId, "Cloning", 10, "Cloning repository...");
                
                // 1. Clone
                var destinationPath = $"/tmp/blueprint/{repositoryId}";
                await _cloneService.CloneRepositoryAsync(githubUrl, destinationPath, cancellationToken);
                
                // 2. Parse & Analyze
                await _notificationService.SendAnalysisProgressAsync(repositoryId, "Parsing", 40, "Extracting metrics and structure...");
                _logger.LogInformation("Parsing and Analysis for {RepoId}...", repositoryId);
                
                var metrics = await _parserService.ExtractMetricsAsync(destinationPath, cancellationToken);
                var fileTree = await _parserService.BuildFileTreeAsync(destinationPath, cancellationToken);

                // 3. AI Insights
                await _notificationService.SendAnalysisProgressAsync(repositoryId, "AI Analysis", 70, "Generating AI repository insights...");
                var metricsJson = JsonSerializer.Serialize(metrics);
                var aiInsights = await _aiService.GenerateInsightsAsync(metricsJson);

                // 4. Save to Database
                var repoEntity = new AnalyzedRepository
                {
                    Id = repositoryId,
                    GithubUrl = githubUrl,
                    Name = githubUrl.Split('/').LastOrDefault()?.Replace(".git", "") ?? repositoryId,
                    Status = "Completed",
                    Framework = metrics.Framework,
                    Language = metrics.Language,
                    MetricsJson = metricsJson,
                    FileTreeJson = JsonSerializer.Serialize(fileTree),
                    AiInsightsJson = aiInsights
                };
                await _dbService.SaveRepositoryAsync(repoEntity);

                // 5. Mark complete
                await _notificationService.SendAnalysisProgressAsync(repositoryId, "Completed", 100, $"Analysis complete. Found {metrics.TotalFiles} files.");
                _logger.LogInformation("Job for {RepoId} completed successfully.", repositoryId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing repository {RepoId}", repositoryId);
                await _notificationService.SendAnalysisProgressAsync(repositoryId, "Failed", 0, "Analysis failed due to an error.");
                throw;
            }
        }
    }
}
