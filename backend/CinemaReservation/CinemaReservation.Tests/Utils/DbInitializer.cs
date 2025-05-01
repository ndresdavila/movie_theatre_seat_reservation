using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;
using CinemaReservation.Infrastructure.Data;

namespace CinemaReservation.Tests.Utils
{

    public static class DbInitializer
    {
        public static void SeedTestData(CinemaDbContext db)
        {
            // Limpia el cambio de seguimiento
            db.ChangeTracker.Clear();

            // Elimina todo antes de insertar (orden importante por claves foráneas)
            db.Seats.RemoveRange(db.Seats);
            db.Bookings.RemoveRange(db.Bookings);
            db.Billboards.RemoveRange(db.Billboards);
            db.Movies.RemoveRange(db.Movies);
            db.Customers.RemoveRange(db.Customers);
            db.Rooms.RemoveRange(db.Rooms);
            
            db.SaveChanges();

            var movie = new MovieEntity("Test Movie", MovieGenreEnum.ACTION, 13, 120);
            db.Movies.Add(movie);
            db.SaveChanges();

            var room = new RoomEntity("Test Room", 1);
            db.Rooms.Add(room);
            db.SaveChanges();

            var futureBillboard = new BillboardEntity(
                date: DateTime.UtcNow.AddDays(2).Date,
                startTime: new TimeSpan(18, 0, 0),
                endTime: new TimeSpan(20, 30, 0),
                movieId: movie.Id,
                roomId: room.Id
            );

            var pastBillboard = new BillboardEntity(
                date: DateTime.UtcNow.AddDays(-2).Date,
                startTime: new TimeSpan(18, 0, 0),
                endTime: new TimeSpan(20, 30, 0),
                movieId: movie.Id,
                roomId: room.Id
            );

            db.Billboards.AddRange(futureBillboard, pastBillboard);
            db.SaveChanges();
        }

    }

}
