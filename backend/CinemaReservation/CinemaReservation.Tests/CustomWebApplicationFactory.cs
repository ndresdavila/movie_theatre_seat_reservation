using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CinemaReservation.Infrastructure.Data;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;

namespace CinemaReservation.Tests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Eliminar el contexto real
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<CinemaDbContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Agregar contexto en memoria
                services.AddDbContext<CinemaDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                // Construir el service provider
                var serviceProvider = services.BuildServiceProvider();

                // Crear el scope y sembrar la DB
                using (var scope = serviceProvider.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
                    db.Database.EnsureCreated();

                    // Agregar datos de prueba
                    var movie = new MovieEntity("Inception", MovieGenreEnum.ACTION, 13, 148);
                    db.Movies.Add(movie);

                    var room = new RoomEntity("Sala Principal", 1);
                    db.Rooms.Add(room);
                    db.SaveChanges();

                    db.Billboards.AddRange(
                        new BillboardEntity(
                            DateTime.UtcNow.AddDays(2).Date,
                            new TimeSpan(18, 0, 0),
                            new TimeSpan(20, 30, 0),
                            movie.Id,
                            room.Id // ID = 1
                        ),
                        new BillboardEntity(
                            DateTime.UtcNow.AddDays(-2).Date,
                            new TimeSpan(18, 0, 0),
                            new TimeSpan(20, 30, 0),
                            movie.Id,
                            room.Id // ID = 2
                        )
                    );
                    db.SaveChanges();
                }
            });
        }
    }
}
