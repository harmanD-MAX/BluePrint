using Microsoft.AspNetCore.SignalR;

namespace Blueprint.Api.Hubs
{
    public class AnalysisHub : Hub
    {
        // Clients can join a group based on the Repository ID to receive specific updates
        public async Task SubscribeToRepository(string repositoryId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, repositoryId);
        }

        public async Task UnsubscribeFromRepository(string repositoryId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, repositoryId);
        }
    }
}
