using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using CinemaReservation.Domain.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CinemaReservation.Tests.IntegrationTests
{
    public class BillboardControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly WebApplicationFactory<Program> _factory;

        public BillboardControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetHorrorMoviesInDateRange_ReturnsCorrectMovies()
        {
            // Arrange
            var startDate = DateTime.UtcNow.AddDays(-1); // Fecha de inicio del rango
            var endDate = DateTime.UtcNow.AddDays(7); // Fecha final del rango
            var url = $"/api/billboard/horror-movies?startDate={startDate:yyyy-MM-dd}&endDate={endDate:yyyy-MM-dd}";

            // Act
            var response = await _client.GetAsync(url);

            // Assert
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var billboards = JsonSerializer.Deserialize<List<BillboardEntity>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            Assert.NotNull(billboards);
            Assert.All(billboards, billboard => Assert.Equal("Horror", billboard.Movie.Genre.ToString()));
            Assert.All(billboards, billboard => Assert.InRange(billboard.Date, startDate, endDate));
        }
    }
}
