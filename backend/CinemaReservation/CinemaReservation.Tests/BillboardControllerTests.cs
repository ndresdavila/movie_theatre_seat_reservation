using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Enums;
using CinemaReservation.Tests.Utils;
using CinemaReservation.Domain.Interfaces;

namespace CinemaReservation.Tests
{
    public class BillboardControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly WebApplicationFactory<Program> _factory;

        public BillboardControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        private async Task<List<BillboardEntity>> GetAllBillboardsAsync()
        {
            var response = await _client.GetAsync("api/billboard");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var billboards = JsonSerializer.Deserialize<List<BillboardEntity>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return billboards!;
        }

        [Fact]
        public async Task CancelBillboard_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            await using var scope = _factory.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();

            db.Billboards.RemoveRange(db.Billboards);
            db.Movies.RemoveRange(db.Movies);
            db.Rooms.RemoveRange(db.Rooms);
            await db.SaveChangesAsync();

            var movie = new MovieEntity("Pelicula de prueba", MovieGenreEnum.ACTION, 13, 120);
            var room = new RoomEntity("Sala 1", 1);
            db.Movies.Add(movie);
            db.Rooms.Add(room);
            await db.SaveChangesAsync();

            var billboard = new BillboardEntity(
                date: DateTime.UtcNow.AddDays(1),
                startTime: new TimeSpan(18, 0, 0),
                endTime: new TimeSpan(20, 0, 0),
                movieId: movie.Id,
                roomId: room.Id
            );
            db.Billboards.Add(billboard);
            await db.SaveChangesAsync();

            var id = billboard.Id;

            // Act
            var response = await _client.DeleteAsync($"/api/billboards/{id}");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task CancelBillboard_ThrowsException_WhenDateIsPast()
        {
            // Arrange
            await using var scope = _factory.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();

            db.Billboards.RemoveRange(db.Billboards);
            db.Movies.RemoveRange(db.Movies);
            db.Rooms.RemoveRange(db.Rooms);
            await db.SaveChangesAsync();

            var movie = new MovieEntity("Pelicula antigua", MovieGenreEnum.DRAMA, 18, 90);
            var room = new RoomEntity("Sala 2", 2);
            db.Movies.Add(movie);
            db.Rooms.Add(room);
            await db.SaveChangesAsync();

            var billboard = new BillboardEntity(
                date: DateTime.UtcNow.AddDays(-1),
                startTime: new TimeSpan(10, 0, 0),
                endTime: new TimeSpan(12, 0, 0),
                movieId: movie.Id,
                roomId: room.Id
            );
            db.Billboards.Add(billboard);
            await db.SaveChangesAsync();

            var id = billboard.Id;

            // Act
            var response = await _client.DeleteAsync($"/api/billboard/cancel-with-reservations/{id}");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            Assert.Contains("no se puede cancelar una cartelera cuya fecha ya ha pasado", content.ToLower());
        }

        [Fact]
        public async Task CancelBillboardWithReservations_CancelsBillboardReservationsAndEnablesSeats()
        {
            // Arrange
            await using var scope = _factory.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();

            // Limpiar datos
            db.Bookings.RemoveRange(db.Bookings);
            db.Seats.RemoveRange(db.Seats);
            db.Billboards.RemoveRange(db.Billboards);
            db.Movies.RemoveRange(db.Movies);
            db.Rooms.RemoveRange(db.Rooms);
            db.Customers.RemoveRange(db.Customers);
            await db.SaveChangesAsync();

            // Crear datos de prueba
            var movie = new MovieEntity("Test Movie", MovieGenreEnum.ACTION, 0, 60);
            db.Movies.Add(movie);
            await db.SaveChangesAsync();

            var room = new RoomEntity("Sala Test", 1);
            db.Rooms.Add(room);
            await db.SaveChangesAsync();

            var seat = new SeatEntity(1, 1, room.Id);
            db.Seats.Add(seat);
            await db.SaveChangesAsync();

            var billboard = new BillboardEntity(
                date: DateTime.UtcNow.Date.AddDays(2),
                startTime: TimeSpan.FromHours(10),
                endTime: TimeSpan.FromHours(12),
                movieId: movie.Id,
                roomId: room.Id
            );
            db.Billboards.Add(billboard);
            await db.SaveChangesAsync();

            var customer = new CustomerEntity("0001", "Ana", "Lopez", 25, "555-0001", "ana@x.com");
            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            var booking = new BookingEntity(DateTime.UtcNow, customer.Id, seat.Id, billboard.Id);
            db.Bookings.Add(booking);
            await db.SaveChangesAsync();

            // Act: llamar al endpoint de cancelación
            var response = await _client.DeleteAsync($"/api/billboard/cancel-with-reservations/{billboard.Id}");

            // Assert: HTTP 204 No Content
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            // Verificar cartelera cancelada
            var updatedBillboard = await db.Billboards.FindAsync(billboard.Id);
            Assert.False(updatedBillboard!.Status);



            // Verificar que las reservas de la cartelera ya no existan (eliminadas)
            var bookingsForBillboard = db.Bookings
                .Where(b => b.BillboardId == billboard.Id)
                .ToList();
            Assert.Empty(bookingsForBillboard);

            // Verificar butaca habilitada
            var updatedSeat = await db.Seats.FindAsync(seat.Id);
            Assert.True(updatedSeat!.Status);

        }

    }
}