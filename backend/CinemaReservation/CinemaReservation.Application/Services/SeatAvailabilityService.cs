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

        var billboardsToday = await _context.Billboards
            .Include(b => b.Room)
            .Where(b => b.Date == today && b.Status)
            .ToListAsync();

        var result = new List<SeatAvailabilityDto>();

        foreach (var billboard in billboardsToday)
        {
            var roomId = billboard.RoomId;

            // Todas las butacas de la sala
            var seatsInRoom = await _context.Seats
                .Where(s => s.RoomId == roomId && s.Status)
                .ToListAsync();

            var seatIds = seatsInRoom.Select(s => s.Id).ToList();

            // Butacas ocupadas para esta cartelera
            var bookedSeatIds = await _context.Bookings
                .Where(b => b.BillboardId == billboard.Id && seatIds.Contains(b.SeatId) && b.Status)
                .Select(b => b.SeatId)
                .ToListAsync();

            var occupied = seatsInRoom.Where(s => bookedSeatIds.Contains(s.Id)).ToList();
            var available = seatsInRoom.Where(s => !bookedSeatIds.Contains(s.Id)).ToList();

            result.Add(new SeatAvailabilityDto
            {
                BillboardId = billboard.Id,
                RoomName = billboard.Room?.Name ?? "Sin nombre",
                TotalSeats = seatsInRoom.Count,
                OccupiedSeats = occupied.Count,
                AvailableSeats = available.Count,
                SeatDetails = seatsInRoom.Select(s => new SeatDto
                {
                    Id = s.Id,
                    Number = s.Number,
                    Row = s.RowNumber,
                    IsOccupied = bookedSeatIds.Contains(s.Id)
                }).ToList()
            });
        }

        return result;
    }
}
