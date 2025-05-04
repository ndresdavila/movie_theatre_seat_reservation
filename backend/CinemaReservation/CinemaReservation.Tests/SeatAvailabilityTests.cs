using System;
using System.Collections.Generic;
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
    // DTO local para deserializar la respuesta del endpoint
    public class RoomSeatStatusDto
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; } = null!;
        public int TotalSeats { get; set; }
        public int OccupiedSeats { get; set; }
    }

    public class SeatAvailabilityTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly WebApplicationFactory<Program> _factory;

        public SeatAvailabilityTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetSeatAvailabilityToday_ReturnsCorrectCountsPerRoom()
        {
            // Arrange: limpiar y poblar datos
            await using var scope = _factory.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
            db.Bookings.RemoveRange(db.Bookings);
            db.Billboards.RemoveRange(db.Billboards);
            db.Seats.RemoveRange(db.Seats);
            db.Rooms.RemoveRange(db.Rooms);
            db.Movies.RemoveRange(db.Movies);
            db.Customers.RemoveRange(db.Customers);
            await db.SaveChangesAsync();

            // Crear una película (necesaria para la cartelera)
            var movie = new MovieEntity("Test Movie", MovieGenreEnum.ACTION, 0, 60);
            db.Movies.Add(movie);
            await db.SaveChangesAsync();

            // Sala 1 con 3 asientos, 2 reservados hoy
            var room1 = new RoomEntity("Sala Uno", 1);
            db.Rooms.Add(room1);
            await db.SaveChangesAsync();

            var seatsRoom1 = new[]
            {
                new SeatEntity(1, 1, room1.Id),
                new SeatEntity(2, 1, room1.Id),
                new SeatEntity(3, 1, room1.Id)
            };
            db.Seats.AddRange(seatsRoom1);
            await db.SaveChangesAsync();

            var billboardToday1 = new BillboardEntity(
                date: DateTime.UtcNow.Date,
                startTime: TimeSpan.FromHours(10),
                endTime: TimeSpan.FromHours(12),
                movieId: movie.Id,
                roomId: room1.Id
            );
            db.Billboards.Add(billboardToday1);
            await db.SaveChangesAsync();

            var customer = new CustomerEntity("0001", "Ana", "Lopez", 25, "555-0001", "ana@x.com");
            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            // Reservas para Sala 1: solo dos de los tres asientos
            db.Bookings.Add(new BookingEntity(DateTime.UtcNow, customer.Id, seatsRoom1[0].Id, billboardToday1.Id));
            db.Bookings.Add(new BookingEntity(DateTime.UtcNow, customer.Id, seatsRoom1[1].Id, billboardToday1.Id));
            await db.SaveChangesAsync();

            // Sala 2 con 2 asientos, ninguno reservado
            var room2 = new RoomEntity("Sala Dos", 2);
            db.Rooms.Add(room2);
            await db.SaveChangesAsync();

            var seatsRoom2 = new[]
            {
                new SeatEntity(1, 1, room2.Id),
                new SeatEntity(2, 1, room2.Id)
            };
            db.Seats.AddRange(seatsRoom2);
            await db.SaveChangesAsync();

            var billboardToday2 = new BillboardEntity(
                date: DateTime.UtcNow.Date,
                startTime: TimeSpan.FromHours(14),
                endTime: TimeSpan.FromHours(16),
                movieId: movie.Id,
                roomId: room2.Id
            );
            db.Billboards.Add(billboardToday2);
            await db.SaveChangesAsync();

            // No agregamos reservas para Sala 2

            // Act: llamar al endpoint
            var response = await _client.GetAsync("/api/seat/availability/today");

            // Assert: HTTP 200 y conteos correctos
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var statuses = JsonSerializer.Deserialize<List<RoomSeatStatusDto>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(statuses);
            // Debe contener dos entradas, una para cada sala
            Assert.Contains(statuses!, s => 
                s.RoomName == room1.Name && 
                s.TotalSeats == 3 && 
                s.OccupiedSeats == 2);
            
            Assert.Contains(statuses!, s => 
                s.RoomName == room2.Name && 
                s.TotalSeats == 2 && 
                s.OccupiedSeats == 0);
        }
    }
}
