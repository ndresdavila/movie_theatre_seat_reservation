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
builder.Services.AddScoped<SeatAvailabilityService>();
builder.Services.AddScoped<BillboardService>();
builder.Services.AddScoped<CancelBillboardService>();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Aquí va el puerto de tu frontend
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

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

// Usa CORS antes de cualquier otro middleware
app.UseCors("AllowFrontend");

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

    // Agregamos más películas
    var movies = new List<MovieEntity>
    {
        new("Inception", MovieGenreEnum.ACTION, 13, 148),
        new("The Godfather", MovieGenreEnum.DRAMA, 18, 175),
        new("Toy Story", MovieGenreEnum.COMEDY, 0, 81),
        new("Interstellar", MovieGenreEnum.SCIENCE_FICTION, 10, 169),
        new("The Conjuring", MovieGenreEnum.HORROR, 16, 112)
    };
    db.Movies.AddRange(movies);
    db.SaveChanges();

    // Agregamos salas
    var rooms = new List<RoomEntity>
    {
        new("Sala Principal", 1),
        new("Sala VIP", 2),
        new("Sala 3D", 3)
    };
    db.Rooms.AddRange(rooms);
    db.SaveChanges();

    // Asientos para cada sala
    foreach (var room in rooms)
    {
        var seatCount = room.Name == "Sala Principal" ? 20 : 10;
        var seats = new List<SeatEntity>();

        for (short i = 1; i <= seatCount; i++)
        {
            // Asignamos fila A para los primeros 10, B para los siguientes
            short row = (short)(i <= 10 ? 1 : 2);
            seats.Add(new SeatEntity(number: i, rowNumber: row, roomId: room.Id));
        }

        db.Seats.AddRange(seats);
    }
    db.SaveChanges();

    // Carteleras con fechas futura y pasada para una película y sala
    var futureDate = DateTime.UtcNow.AddDays(2);
    var pastDate = DateTime.UtcNow.AddDays(-2);

    var billboard1 = new BillboardEntity(
        date: futureDate.Date,
        startTime: new TimeSpan(18, 0, 0),
        endTime: new TimeSpan(20, 30, 0),
        movieId: movies[0].Id,
        roomId: rooms[0].Id
    )
    { Id = 100 };

    var billboard2 = new BillboardEntity(
        date: pastDate.Date,
        startTime: new TimeSpan(18, 0, 0),
        endTime: new TimeSpan(20, 30, 0),
        movieId: movies[0].Id,
        roomId: rooms[0].Id
    )
    { Id = 101 };

    db.Billboards.AddRange(billboard1, billboard2);
    db.SaveChanges();
}


app.Run();

public partial class Program { }
