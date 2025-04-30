using CinemaReservation.Application.Services;
using CinemaReservation.Infrastructure.Data;
using CinemaReservation.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Agrega los controladores
builder.Services.AddControllers();

// Configura la cadena de conexión a PostgreSQL
builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorio genérico
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IRepository<BookingEntity>, BookingRepository>();

// Repositorios para demás entidades
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IMovieRepository, MovieRepository>();
builder.Services.AddScoped<IBillboardRepository, BillboardRepository>();
builder.Services.AddScoped<ISeatRepository, SeatRepository>();

// Servicios de dominio
builder.Services.AddScoped<MovieService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<SeatService>();
builder.Services.AddScoped<BillboardService>();
builder.Services.AddScoped<CancelBillboardService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middlewares
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers(); // <- Usa tus propios controladores en lugar de WeatherForecast

app.Run();
