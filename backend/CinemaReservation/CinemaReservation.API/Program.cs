using CinemaReservation.Application.Services;
using CinemaReservation.Infrastructure.Data;
using CinemaReservation.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;

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
app.MapControllers();

// Seeder: insertar datos si la base está vacía
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
    db.Database.Migrate(); // Aplica las migraciones

    db.Bookings.RemoveRange(db.Bookings);
    db.Billboards.RemoveRange(db.Billboards);
    db.Seats.RemoveRange(db.Seats);
    db.Rooms.RemoveRange(db.Rooms);
    db.Customers.RemoveRange(db.Customers);
    db.Movies.RemoveRange(db.Movies);

    db.SaveChanges();

    // Luego siembra los datos base
    var movie = new MovieEntity(
        name: "Inception",
        genre: MovieGenreEnum.ACTION,
        allowedAge: 13,
        lengthMinutes: 148
    );
    db.Movies.Add(movie);

    var room = new RoomEntity(name: "Sala Principal", number: 1);
    db.Rooms.Add(room);
    db.SaveChanges();

    var futureDate = DateTime.UtcNow.AddDays(2);
    var pastDate = DateTime.UtcNow.AddDays(-2);

    var futureBillboard = new BillboardEntity(
        date: futureDate.Date,
        startTime: new TimeSpan(18, 0, 0),
        endTime: new TimeSpan(20, 30, 0),
        movieId: movie.Id,
        roomId: room.Id
    )
    {
    Id = 1  // Asignamos el ID manualmente
    };
    futureBillboard.Id = 1;

    var pastBillboard = new BillboardEntity(
        date: pastDate.Date,
        startTime: new TimeSpan(18, 0, 0),
        endTime: new TimeSpan(20, 30, 0),
        movieId: movie.Id,
        roomId: room.Id
    )
    {
    Id = 2  // Asignamos otro ID manualmente
    };
    pastBillboard.Id = 2;

    db.Billboards.AddRange(futureBillboard, pastBillboard);
    db.SaveChanges();
}


app.Run();

public partial class Program { }
