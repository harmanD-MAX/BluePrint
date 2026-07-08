using System;

namespace Blueprint.Core.Entities
{
    public class AnalyzedRepository
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string GithubUrl { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Completed, Failed
        public string Framework { get; set; } = "Unknown";
        public string Language { get; set; } = "Unknown";
        
        // Storing complex structures as JSON string for SQLite MVP simplicity
        public string MetricsJson { get; set; } = string.Empty; 
        public string FileTreeJson { get; set; } = string.Empty;
        public string AiInsightsJson { get; set; } = string.Empty;
    }
}
