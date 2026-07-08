namespace Blueprint.Core.Interfaces
{
    public class RepositoryMetrics
    {
        public int TotalFiles { get; set; }
        public int TotalFolders { get; set; }
        public int TotalClasses { get; set; }
        public int TotalInterfaces { get; set; }
        public int TotalMethods { get; set; }
        public int TotalRestEndpoints { get; set; }
        public int TotalServices { get; set; }
        public int TotalControllers { get; set; }
        public int LinesOfCode { get; set; }
        public string Framework { get; set; } = "Unknown";
        public string Language { get; set; } = "Unknown";
        public Dictionary<string, string> Dependencies { get; set; } = new();
        public List<GraphNode> Nodes { get; set; } = new();
        public List<GraphEdge> Edges { get; set; } = new();
        
        // Feature 4: Project Health
        public List<string> CodeSmells { get; set; } = new();
        
        // Feature 11: API Explorer
        public List<ApiEndpoint> Endpoints { get; set; } = new();
    }

    public class ApiEndpoint
    {
        public string Method { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string File { get; set; } = string.Empty;
    }

    public class GraphNode
    {
        public string Id { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // e.g., Controller, Service, File
    }

    public class GraphEdge
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Source { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // e.g., Call, Import
    }

    public class FileNode
    {
        public string Path { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsDirectory { get; set; }
        public List<FileNode> Children { get; set; } = new();
    }

    public interface IParserService
    {
        Task<RepositoryMetrics> ExtractMetricsAsync(string repositoryPath, CancellationToken cancellationToken);
        Task<FileNode> BuildFileTreeAsync(string repositoryPath, CancellationToken cancellationToken);
    }
}
