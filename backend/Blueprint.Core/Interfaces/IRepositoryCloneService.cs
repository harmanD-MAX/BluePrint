namespace Blueprint.Core.Interfaces
{
    public interface IRepositoryCloneService
    {
        Task<string> CloneRepositoryAsync(string githubUrl, string destinationPath, CancellationToken cancellationToken = default);
    }
}
