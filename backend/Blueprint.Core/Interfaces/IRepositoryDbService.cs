using Blueprint.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blueprint.Core.Interfaces
{
    public interface IRepositoryDbService
    {
        Task SaveRepositoryAsync(AnalyzedRepository repository);
        Task<AnalyzedRepository?> GetRepositoryAsync(string id);
        Task<List<AnalyzedRepository>> GetAllRepositoriesAsync();
        Task DeleteRepositoryAsync(string id);
    }
}
