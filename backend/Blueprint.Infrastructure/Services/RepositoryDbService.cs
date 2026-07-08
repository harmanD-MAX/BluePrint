using Microsoft.EntityFrameworkCore;
using Blueprint.Core.Entities;
using Blueprint.Core.Interfaces;
using Blueprint.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blueprint.Infrastructure.Services
{
    public class RepositoryDbService : IRepositoryDbService
    {
        private readonly ApplicationDbContext _context;

        public RepositoryDbService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SaveRepositoryAsync(AnalyzedRepository repository)
        {
            var existing = await _context.AnalyzedRepositories.FindAsync(repository.Id);
            if (existing != null)
            {
                _context.Entry(existing).CurrentValues.SetValues(repository);
            }
            else
            {
                _context.AnalyzedRepositories.Add(repository);
            }
            await _context.SaveChangesAsync();
        }

        public async Task<AnalyzedRepository?> GetRepositoryAsync(string id)
        {
            return await _context.AnalyzedRepositories.FindAsync(id);
        }

        public async Task<List<AnalyzedRepository>> GetAllRepositoriesAsync()
        {
            return await _context.AnalyzedRepositories.ToListAsync();
        }

        public async Task DeleteRepositoryAsync(string id)
        {
            var existing = await _context.AnalyzedRepositories.FindAsync(id);
            if (existing != null)
            {
                _context.AnalyzedRepositories.Remove(existing);
                await _context.SaveChangesAsync();
            }
        }
    }
}
