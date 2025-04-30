using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Enums;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Infrastructure.Data;

namespace CinemaReservation.Infrastructure.Repositories
{
    public class BookingRepository : Repository<BookingEntity>, IBookingRepository
    {
        private readonly CinemaDbContext _context;

        public BookingRepository(CinemaDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookingEntity>> GetBookingsByMovieGenreAsync(MovieGenreEnum genre, DateTime startDate, DateTime endDate)
        {
            return await _context.Set<BookingEntity>()
                                 .Include(b => b.Billboard)
                                 .ThenInclude(b => b.Movie)
                                 .Where(b => b.Billboard != null &&
                                        b.Billboard.Movie != null &&
                                        b.Billboard.Movie.Genre == genre &&
                                        b.Billboard.Date >= startDate &&
                                        b.Billboard.Date <= endDate)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<SeatEntity>> GetAvailableSeatsByRoomAsync(int roomId, DateTime date)
        {
            var allSeats = await _context.Set<SeatEntity>()
                                          .Where(s => s.RoomId == roomId)
                                          .ToListAsync();
            var bookedSeats = await _context.Set<BookingEntity>()
                                            .Where(b => b.Billboard != null &&
                                                   b.Seat != null &&
                                                   b.Billboard.Date.Date == date.Date &&
                                                   b.Seat.RoomId == roomId)
                                            .Select(b => b.SeatId)
                                            .ToListAsync();

            return allSeats.Where(s => !bookedSeats.Contains(s.Id));
        }
    }
}
