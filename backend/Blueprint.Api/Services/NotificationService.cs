using Microsoft.AspNetCore.SignalR;
using Blueprint.Api.Hubs;
using Blueprint.Core.Interfaces;

namespace Blueprint.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<AnalysisHub> _hubContext;

        public NotificationService(IHubContext<AnalysisHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendAnalysisProgressAsync(string repositoryId, string status, int percentage, string message)
        {
            await _hubContext.Clients.Group(repositoryId).SendAsync("AnalysisProgress", repositoryId, status, percentage, message);
        }
    }
}
