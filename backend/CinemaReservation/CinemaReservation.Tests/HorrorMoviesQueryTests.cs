using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;
using CinemaReservation.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace CinemaReservation.Tests
{
    public class BookingDto
    {
        public int Id { get; set; }
        public BillboardDto Billboard { get; set; } = null!;
    }

    public class BillboardDto
    {
        public MovieDto Movie { get; set; } = null!;
    }

    public class MovieDto
    {
        public string Name { get; set; } = null!;
        public MovieGenreEnum Genre { get; set; }
    }

    public class HorrorMoviesQueryTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly WebApplicationFactory<Program> _factory;

        public HorrorMoviesQueryTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetHorrorBookingsInDateRange_ReturnsOnlyBookingsForHorrorMoviesWithinRange()
        {
            // Arrange
            await using var scope = _factory.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
            
            // Limpieza previa (opcional pero recomendable si el contexto es persistente)
            db.Bookings.RemoveRange(db.Bookings);
            db.Seats.RemoveRange(db.Seats);
            db.Billboards.RemoveRange(db.Billboards);
            db.Movies.RemoveRange(db.Movies);
            db.Rooms.RemoveRange(db.Rooms);
            db.Customers.RemoveRange(db.Customers);
            
            await db.SaveChangesAsync();

            // Crear películas
            var horrorMovie = new MovieEntity("Terror en la Noche", MovieGenreEnum.HORROR, 18, 100);
            var comedyMovie = new MovieEntity("Comedia Ligera", MovieGenreEnum.COMEDY, 10, 90);
            db.Movies.AddRange(horrorMovie, comedyMovie);
            await db.SaveChangesAsync();

            // Crea sala
            var room = new RoomEntity("Sala Test", 5);
            db.Rooms.Add(room);
            await db.SaveChangesAsync();

            // Crea asiento en la sala
            var seat = new SeatEntity(number: 1, rowNumber: 1, roomId: room.Id);
            db.Seats.Add(seat);
            await db.SaveChangesAsync();

            // Crea cartelera con película de terror
            var horrorBillboard = new BillboardEntity(
                date: DateTime.UtcNow.AddDays(5),
                startTime: new TimeSpan(20, 0, 0),
                endTime: new TimeSpan(22, 0, 0),
                movieId: horrorMovie.Id,
                roomId: room.Id
            );

            var comedyBillboard = new BillboardEntity(
                date: DateTime.UtcNow.AddDays(6),
                startTime: new TimeSpan(16, 0, 0),
                endTime: new TimeSpan(18, 0, 0),
                movieId: comedyMovie.Id,
                roomId: room.Id
            );

            db.Billboards.AddRange(horrorBillboard, comedyBillboard);
            await db.SaveChangesAsync();

            var customer = new CustomerEntity("0922898549", "Juan", "Pérez", 30, "0993082332", "juan@example.com");
            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            var horrorBooking = new BookingEntity(
                date: DateTime.UtcNow,
                customerId: customer.Id,
                seatId: seat.Id,
                billboardId: horrorBillboard.Id
            );

            var comedyBooking = new BookingEntity(
                date: DateTime.UtcNow,
                customerId: customer.Id,
                seatId: seat.Id,
                billboardId: comedyBillboard.Id
            );

            db.Bookings.AddRange(horrorBooking, comedyBooking);
            await db.SaveChangesAsync();

            var startDate = DateTime.UtcNow.AddDays(-5).ToString("MM-dd-yyyy");
            var endDate = DateTime.UtcNow.AddDays(10).ToString("MM-dd-yyyy");

            // Act
            var response = await _client.GetAsync($"/api/booking/horror?startDate={startDate}&endDate={endDate}");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var bookings = JsonSerializer.Deserialize<List<BookingDto>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(bookings);
            Assert.All(bookings, b => Assert.Equal(MovieGenreEnum.HORROR, b.Billboard.Movie.Genre));
            Assert.Contains(bookings, b => b.Billboard.Movie.Name == "Terror en la Noche");
            Assert.DoesNotContain(bookings, b => b.Billboard.Movie.Name == "Comedia Ligera");
        }
    
    }
}
