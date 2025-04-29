using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace CinemaReservation.Infrastructure.Data
{
    public class CinemaDbContextFactory : IDesignTimeDbContextFactory<CinemaDbContext>
    {
        public CinemaDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<CinemaDbContext>();
            
            // Configura la conexión a la base de datos (ajusta según tus necesidades)
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=cinema_db;Username=postgres;Password=asdf");

            return new CinemaDbContext(optionsBuilder.Options);
        }
    }
}
