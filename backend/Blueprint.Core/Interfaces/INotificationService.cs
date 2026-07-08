namespace Blueprint.Core.Interfaces
{
    public interface INotificationService
    {
        Task SendAnalysisProgressAsync(string repositoryId, string status, int percentage, string message);
    }
}
