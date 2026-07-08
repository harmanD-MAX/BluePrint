using System.Threading.Tasks;

namespace Blueprint.Core.Interfaces
{
    public interface IAiAnalysisService
    {
        Task<string> GenerateInsightsAsync(string metricsJson);
    }
}
