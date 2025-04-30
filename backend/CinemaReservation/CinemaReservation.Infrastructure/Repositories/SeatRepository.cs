using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Infrastructure.Data;

namespace CinemaReservation.Infrastructure.Repositories
{
    public class SeatRepository : Repository<SeatEntity>, ISeatRepository
    {
        private readonly CinemaDbContext _context;

        public SeatRepository(CinemaDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SeatEntity>> GetAvailableSeatsInRoomAsync(int roomId)
        {
            var allSeats = await _context.Set<SeatEntity>()
                                          .Where(s => s.RoomId == roomId)
                                          .ToListAsync();
            var occupiedSeats = await _context.Set<BookingEntity>()
                                              .Where(b => b.Seat != null && b.Seat.RoomId == roomId)
                                              .Select(b => b.SeatId)
                                              .ToListAsync();

            return allSeats.Where(s => !occupiedSeats.Contains(s.Id));
        }
    }
}
