using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Data; // 👈 CAMBIADO: este es el namespace correcto
using Microsoft.EntityFrameworkCore;

public class SeatAvailabilityService
{
    private readonly CinemaDbContext _context;

    public SeatAvailabilityService(CinemaDbContext context) // 👈 CAMBIADO: usamos CinemaDbContext
    {
        _context = context;
    }

    public async Task<List<SeatAvailabilityDto>> GetSeatAvailabilityForTodayAsync()
        {
            var today = DateTime.UtcNow.Date;
            
            // 1) Trae todas las salas
            var rooms = await _context.Rooms.ToListAsync();
            
            // 2) Trae TODAS las reservas de hoy (incluye Seat y Billboard)
            var bookingsToday = await _context.Bookings
                .Include(b => b.Seat)
                .Include(b => b.Billboard)
                .Where(b => b.Status && b.Billboard != null && b.Billboard.Date.Date == today)
                .ToListAsync();

            var result = new List<SeatAvailabilityDto>();

            foreach (var room in rooms)
            {
                // 3) Todas las butacas activas de esta sala
                var seatsInRoom = await _context.Seats
                    .Where(s => s.RoomId == room.Id)
                    .ToListAsync();

                // 4) IDs de las butacas reservadas para la sala hoy
                var bookedIds = bookingsToday
                    .Where(b => b.Seat != null && b.Seat.RoomId == room.Id)
                    .Select(b => b.SeatId)
                    .Distinct()
                    .ToHashSet();

                // 5) Construye la lista de detalles marcando isOccupied
                var details = seatsInRoom.Select(s => new SeatDto
                {
                    Id         = s.Id,
                    Number     = s.Number,
                    Row        = s.RowNumber,
                    IsOccupied = bookedIds.Contains(s.Id)
                }).ToList();

                result.Add(new SeatAvailabilityDto
                {
                    RoomName      = room.Name,
                    TotalSeats    = seatsInRoom.Count,
                    OccupiedSeats = bookedIds.Count,
                    AvailableSeats= seatsInRoom.Count - bookedIds.Count,
                    SeatDetails   = details
                });
            }

            return result;
        }
}
