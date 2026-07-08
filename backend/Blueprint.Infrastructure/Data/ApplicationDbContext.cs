using Microsoft.EntityFrameworkCore;
using Blueprint.Core.Entities;

namespace Blueprint.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<AnalyzedRepository> AnalyzedRepositories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AnalyzedRepository>()
                .HasKey(e => e.Id);
        }
    }
}
