// using System.Net;
// using System.Net.Http;
// using System.Text.Json;
// using System.Threading.Tasks;
// using System.Collections.Generic;
// using System.Linq;
// using Microsoft.AspNetCore.Mvc.Testing;
// using Xunit;
// using CinemaReservation.Domain.Entities;
// using CinemaReservation.Infrastructure.Data;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.EntityFrameworkCore;
// using CinemaReservation.Domain.Enums;
// using CinemaReservation.Tests.Utils;
// using CinemaReservation.Domain.Interfaces;

// namespace CinemaReservation.Tests
// {
//     public class BillboardControllerTests : IClassFixture<WebApplicationFactory<Program>>
//     {
//         private readonly HttpClient _client;
//         private readonly WebApplicationFactory<Program> _factory;

//         public BillboardControllerTests(WebApplicationFactory<Program> factory)
//         {
//             _factory = factory;
//             _client = factory.CreateClient();
//         }

//         private async Task<List<BillboardEntity>> GetAllBillboardsAsync()
//         {
//             var response = await _client.GetAsync("api/billboard");
//             response.EnsureSuccessStatusCode();

//             var json = await response.Content.ReadAsStringAsync();
//             var billboards = JsonSerializer.Deserialize<List<BillboardEntity>>(json, new JsonSerializerOptions
//             {
//                 PropertyNameCaseInsensitive = true
//             });

//             return billboards!;
//         }

//         [Fact]
//         public async Task CancelBillboard_ReturnsNoContent_WhenSuccessful()
//         {
//             // Arrange
//             await using var scope = _factory.Services.CreateAsyncScope();
//             var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();

//             db.Billboards.RemoveRange(db.Billboards);
//             db.Movies.RemoveRange(db.Movies);
//             db.Rooms.RemoveRange(db.Rooms);
//             await db.SaveChangesAsync();

//             var movie = new MovieEntity(
//                 name: "Pelicula de prueba",
//                 genre: MovieGenreEnum.ACTION,
//                 allowedAge: 13,
//                 lengthMinutes: 120
//             );

//             var room = new RoomEntity(
//                 name: "Sala 1",
//                 number: 1
//             );

//             db.Movies.Add(movie);
//             db.Rooms.Add(room);
//             await db.SaveChangesAsync();

//             var billboard = new BillboardEntity(
//                 date: DateTime.UtcNow.AddDays(1),
//                 startTime: new TimeSpan(18, 0, 0),
//                 endTime: new TimeSpan(20, 0, 0),
//                 movieId: movie.Id,
//                 roomId: room.Id
//             );

//             db.Billboards.Add(billboard);
//             await db.SaveChangesAsync();

//             var id = billboard.Id;

//             // Act
//             var response = await _client.DeleteAsync($"/api/billboards/{id}");

//             // Assert
//             Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
//         }

//         [Fact]
//         public async Task CancelBillboard_ThrowsException_WhenDateIsPast()
//         {
//             // Arrange
//             await using var scope = _factory.Services.CreateAsyncScope();
//             var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();

//             db.Billboards.RemoveRange(db.Billboards);
//             db.Movies.RemoveRange(db.Movies);
//             db.Rooms.RemoveRange(db.Rooms);
//             await db.SaveChangesAsync();

//             var movie = new MovieEntity(
//                 name: "Pelicula antigua",
//                 genre: MovieGenreEnum.DRAMA,
//                 allowedAge: 18,
//                 lengthMinutes: 90
//             );

//             var room = new RoomEntity(
//                 name: "Sala 2",
//                 number: 2
//             );

//             db.Movies.Add(movie);
//             db.Rooms.Add(room);
//             await db.SaveChangesAsync();

//             var billboard = new BillboardEntity(
//                 date: DateTime.UtcNow.AddDays(-1),
//                 startTime: new TimeSpan(10, 0, 0),
//                 endTime: new TimeSpan(12, 0, 0),
//                 movieId: movie.Id,
//                 roomId: room.Id
//             );

//             db.Billboards.Add(billboard);
//             await db.SaveChangesAsync();

//             var id = billboard.Id;

//             // Act
//             var response = await _client.DeleteAsync($"/api/billboard/cancel-with-reservations/{id}");

//             // Assert
//             Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
//             var content = await response.Content.ReadAsStringAsync();
//             Assert.Contains("no se puede cancelar una cartelera cuya fecha ya ha pasado", content.ToLower());
//         }
//     }
// }
