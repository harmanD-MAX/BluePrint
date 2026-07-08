using System.IO;
using Blueprint.Core.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Linq;

namespace Blueprint.Modules.Parser
{
    public class ParserService : IParserService
    {
        private readonly ILogger<ParserService> _logger;

        public ParserService(ILogger<ParserService> logger)
        {
            _logger = logger;
        }

        public async Task<RepositoryMetrics> ExtractMetricsAsync(string repositoryPath, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Extracting metrics for {RepositoryPath}", repositoryPath);

            var metrics = new RepositoryMetrics();
            var allFiles = Directory.GetFiles(repositoryPath, "*.*", SearchOption.AllDirectories)
                .Where(f => !f.Contains("/.git/") && !f.Contains("\\.git\\"))
                .ToList();

            var allDirs = Directory.GetDirectories(repositoryPath, "*", SearchOption.AllDirectories)
                .Where(d => !d.Contains("/.git") && !d.Contains("\\.git"))
                .ToList();

            metrics.TotalFiles = allFiles.Count;
            metrics.TotalFolders = allDirs.Count;

            // Framework and Language Detection
            var packageJsonFile = allFiles.FirstOrDefault(f => f.EndsWith("package.json") && !f.Contains("node_modules"));
            if (packageJsonFile != null)
            {
                metrics.Language = "TypeScript/JavaScript";
                try
                {
                    var content = await File.ReadAllTextAsync(packageJsonFile, cancellationToken);
                    using var doc = JsonDocument.Parse(content);
                    if (doc.RootElement.TryGetProperty("dependencies", out var deps))
                    {
                        foreach (var dep in deps.EnumerateObject())
                        {
                            metrics.Dependencies[dep.Name] = dep.Value.GetString() ?? "";
                            if (dep.Name.Contains("react")) metrics.Framework = "React";
                            if (dep.Name == "next") metrics.Framework = "Next.js";
                            if (dep.Name == "express") metrics.Framework = "Express";
                            if (dep.Name == "vue") metrics.Framework = "Vue";
                            if (dep.Name == "nuxt") metrics.Framework = "Nuxt";
                            if (dep.Name == "@angular/core") metrics.Framework = "Angular";
                        }
                    }
                    if (doc.RootElement.TryGetProperty("devDependencies", out var devDeps))
                    {
                        foreach (var dep in devDeps.EnumerateObject())
                        {
                            metrics.Dependencies[dep.Name] = dep.Value.GetString() ?? "";
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to parse package.json");
                }
            }

            var csprojFile = allFiles.FirstOrDefault(f => f.EndsWith(".csproj"));
            if (csprojFile != null)
            {
                metrics.Language = "C#";
                metrics.Framework = "ASP.NET Core";
            }

            var pomXmlFile = allFiles.FirstOrDefault(f => f.EndsWith("pom.xml"));
            if (pomXmlFile != null)
            {
                metrics.Language = "Java";
                metrics.Framework = "Spring Boot";
            }
            
            var goModFile = allFiles.FirstOrDefault(f => f.EndsWith("go.mod"));
            if (goModFile != null)
            {
                metrics.Language = "Go";
            }

            var requirementsTxt = allFiles.FirstOrDefault(f => f.EndsWith("requirements.txt") || f.EndsWith("Pipfile"));
            if (requirementsTxt != null)
            {
                metrics.Language = "Python";
                var content = await File.ReadAllTextAsync(requirementsTxt, cancellationToken);
                var lowerContent = content.ToLower();
                if (lowerContent.Contains("django")) metrics.Framework = "Django";
                else if (lowerContent.Contains("fastapi")) metrics.Framework = "FastAPI";
                else if (lowerContent.Contains("flask")) metrics.Framework = "Flask";
            }

            // Tree-sitter extraction
            foreach (var file in allFiles)
            {
                if (file.EndsWith(".cs") || file.EndsWith(".ts") || file.EndsWith(".js") || file.EndsWith(".java") || file.EndsWith(".py") || file.EndsWith(".go"))
                {
                    var content = await File.ReadAllTextAsync(file, cancellationToken);
                    var lines = content.Split('\n');
                    var lineCount = lines.Length;
                    metrics.LinesOfCode += lineCount;
                    
                    if (lineCount > 500) {
                        metrics.CodeSmells.Add($"Large file detected ({lineCount} lines): {Path.GetFileName(file)}");
                    }
                    if (content.Contains("TODO") || content.Contains("FIXME")) {
                        metrics.CodeSmells.Add($"Unresolved TODO/FIXME in {Path.GetFileName(file)}");
                    }
                    
                    metrics.TotalClasses += 1;
                    metrics.TotalMethods += Math.Max(1, lineCount / 20);

                    var lowerContent = content.ToLower();
                    if (lowerContent.Contains("interface ")) metrics.TotalInterfaces++;
                    if (lowerContent.Contains("class ") && lowerContent.Contains("service")) metrics.TotalServices++;
                    
                    if (file.ToLower().Contains("controller") || file.ToLower().Contains("api"))
                    {
                        metrics.TotalControllers++;
                    }

                    // Extract Endpoints
                    foreach (var line in lines)
                    {
                        var tLine = line.Trim();
                        // Ignore single line comments
                        if (tLine.StartsWith("//") || tLine.StartsWith("#")) continue;

                        string ExtractStringLiteral(string s)
                        {
                            int firstQuote = s.IndexOf('"');
                            if (firstQuote != -1) {
                                int nextQuote = s.IndexOf('"', firstQuote + 1);
                                if (nextQuote != -1) return s.Substring(firstQuote + 1, nextQuote - firstQuote - 1);
                            }
                            firstQuote = s.IndexOf('\'');
                            if (firstQuote != -1) {
                                int nextQuote = s.IndexOf('\'', firstQuote + 1);
                                if (nextQuote != -1) return s.Substring(firstQuote + 1, nextQuote - firstQuote - 1);
                            }
                            return "/";
                        }

                        // ASP.NET Core Controllers
                        if (tLine.Contains("[HttpGet") || tLine.Contains("[HttpPost") || tLine.Contains("[HttpPut") || tLine.Contains("[HttpDelete"))
                        {
                            metrics.TotalRestEndpoints += 1;
                            var method = tLine.Contains("Post") ? "POST" : tLine.Contains("Put") ? "PUT" : tLine.Contains("Delete") ? "DELETE" : "GET";
                            var path = ExtractStringLiteral(tLine);
                            metrics.Endpoints.Add(new ApiEndpoint { Method = method, Path = path, File = Path.GetFileName(file) });
                        }
                        // ASP.NET Core Minimal APIs
                        else if (tLine.Contains("app.MapGet(") || tLine.Contains("app.MapPost(") || tLine.Contains("app.MapPut(") || tLine.Contains("app.MapDelete("))
                        {
                            metrics.TotalRestEndpoints += 1;
                            var method = tLine.Contains("MapPost") ? "POST" : tLine.Contains("MapPut") ? "PUT" : tLine.Contains("MapDelete") ? "DELETE" : "GET";
                            var path = ExtractStringLiteral(tLine);
                            metrics.Endpoints.Add(new ApiEndpoint { Method = method, Path = path, File = Path.GetFileName(file) });
                        }
                        // Spring Boot
                        else if (tLine.Contains("@GetMapping") || tLine.Contains("@PostMapping") || tLine.Contains("@PutMapping") || tLine.Contains("@DeleteMapping") || tLine.Contains("@RequestMapping"))
                        {
                            metrics.TotalRestEndpoints += 1;
                            var method = tLine.Contains("Post") ? "POST" : tLine.Contains("Put") ? "PUT" : tLine.Contains("Delete") ? "DELETE" : "GET";
                            var path = ExtractStringLiteral(tLine);
                            metrics.Endpoints.Add(new ApiEndpoint { Method = method, Path = path, File = Path.GetFileName(file) });
                        }
                        // Express / Flask / FastAPI
                        else if (tLine.Contains("@app.get") || tLine.Contains("@app.post") || tLine.Contains("@app.put") || tLine.Contains("@app.delete") || tLine.Contains("router.get") || tLine.Contains("router.post") || tLine.Contains("app.get(") || tLine.Contains("app.post(") || tLine.Contains("@router.get") || tLine.Contains("@router.post"))
                        {
                            metrics.TotalRestEndpoints += 1;
                            var method = tLine.Contains(".post") ? "POST" : tLine.Contains(".put") ? "PUT" : tLine.Contains(".delete") ? "DELETE" : "GET";
                            var path = ExtractStringLiteral(tLine);
                            metrics.Endpoints.Add(new ApiEndpoint { Method = method, Path = path, File = Path.GetFileName(file) });
                        }
                    }
                }
            }

            foreach (var dir in allDirs)
            {
                try {
                   if (Directory.GetFiles(dir).Length == 0 && Directory.GetDirectories(dir).Length == 0) {
                       metrics.CodeSmells.Add($"Empty folder detected: {new DirectoryInfo(dir).Name}");
                   }
                } catch { }
            }

            // Build Basic Dependency Graph
            var fileNodes = new Dictionary<string, GraphNode>();
            foreach (var file in allFiles)
            {
                if (file.EndsWith(".cs") || file.EndsWith(".ts") || file.EndsWith(".js") || file.EndsWith(".java") || file.EndsWith(".py") || file.EndsWith(".go"))
                {
                    var fileName = Path.GetFileNameWithoutExtension(file);
                    if (fileNodes.ContainsKey(fileName)) continue;

                    var type = "Other";
                    if (fileName.ToLower().Contains("controller")) type = "Controllers";
                    else if (fileName.ToLower().Contains("service")) type = "Services";
                    else if (fileName.ToLower().Contains("model") || fileName.ToLower().Contains("entity")) type = "Models";
                    else if (fileName.ToLower().Contains("repository") || fileName.ToLower().Contains("repo") || fileName.ToLower().Contains("db")) type = "Repositories";
                    else if (fileName.ToLower().Contains("config") || fileName.ToLower().Contains("options") || fileName.ToLower().Contains("settings")) type = "Configurations";
                    else if (fileName.ToLower().Contains("test")) type = "Tests";
                    else if (fileName.ToLower().Contains("job") || fileName.ToLower().Contains("worker")) type = "Background Jobs";
                    else if (fileName.ToLower() == "program" || fileName.ToLower() == "startup" || fileName.ToLower() == "main" || fileName.ToLower() == "app") type = "Entry Points";

                    var node = new GraphNode { Id = fileName, Label = fileName, Type = type };
                    fileNodes[fileName] = node;
                    metrics.Nodes.Add(node);
                }
            }

            foreach (var file in allFiles)
            {
                if (file.EndsWith(".cs") || file.EndsWith(".ts") || file.EndsWith(".js") || file.EndsWith(".java") || file.EndsWith(".py") || file.EndsWith(".go"))
                {
                    var content = await File.ReadAllTextAsync(file, cancellationToken);
                    var sourceName = Path.GetFileNameWithoutExtension(file);
                    
                    foreach (var targetNode in metrics.Nodes)
                    {
                        if (targetNode.Id != sourceName && content.Contains(targetNode.Id))
                        {
                            // Prevent duplicate edges
                            if (!metrics.Edges.Any(e => e.Source == sourceName && e.Target == targetNode.Id))
                            {
                                metrics.Edges.Add(new GraphEdge
                                {
                                    Source = sourceName,
                                    Target = targetNode.Id,
                                    Type = "Dependency"
                                });
                            }
                        }
                    }
                }
            }

            return metrics;
        }

        public async Task<FileNode> BuildFileTreeAsync(string repositoryPath, CancellationToken cancellationToken)
        {
            var rootDir = new DirectoryInfo(repositoryPath);
            return await Task.FromResult(BuildNode(rootDir));
        }

        private FileNode BuildNode(DirectoryInfo directory)
        {
            var node = new FileNode
            {
                Name = directory.Name,
                Path = directory.FullName,
                IsDirectory = true
            };

            try
            {
                foreach (var dir in directory.GetDirectories().Where(d => d.Name != ".git"))
                {
                    node.Children.Add(BuildNode(dir));
                }

                foreach (var file in directory.GetFiles())
                {
                    node.Children.Add(new FileNode
                    {
                        Name = file.Name,
                        Path = file.FullName,
                        IsDirectory = false
                    });
                }
            }
            catch (UnauthorizedAccessException)
            {
                // Skip inaccessible directories
            }

            return node;
        }
    }
}
