using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Blueprint.Core.Interfaces;

namespace Blueprint.Modules.Repository
{
    public class RepositoryCloneService : IRepositoryCloneService
    {
        private readonly ILogger<RepositoryCloneService> _logger;

        public RepositoryCloneService(ILogger<RepositoryCloneService> logger)
        {
            _logger = logger;
        }

        public async Task<string> CloneRepositoryAsync(string githubUrl, string destinationPath, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Starting clone for {Url} into {Destination}", githubUrl, destinationPath);

            if (Directory.Exists(destinationPath))
            {
                _logger.LogWarning("Destination {Destination} already exists. Deleting it.", destinationPath);
                Directory.Delete(destinationPath, true);
            }

            var processStartInfo = new ProcessStartInfo
            {
                FileName = "git",
                Arguments = $"clone --depth 1 {githubUrl} {destinationPath}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using var process = new Process { StartInfo = processStartInfo };
            
            process.Start();

            // Wait for exit
            await process.WaitForExitAsync(cancellationToken);

            if (process.ExitCode != 0)
            {
                var error = await process.StandardError.ReadToEndAsync(cancellationToken);
                _logger.LogError("Failed to clone repository: {Error}", error);
                throw new Exception($"Failed to clone repository. Error: {error}");
            }

            _logger.LogInformation("Repository cloned successfully into {Destination}", destinationPath);
            return destinationPath;
        }
    }
}
