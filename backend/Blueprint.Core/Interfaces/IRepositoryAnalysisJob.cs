namespace Blueprint.Core.Interfaces
{
    public interface IRepositoryAnalysisJob
    {
        Task ProcessRepositoryAsync(string repositoryId, string githubUrl, CancellationToken cancellationToken);
    }
}
