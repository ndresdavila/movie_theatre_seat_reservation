using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Domain.Enums;
using CinemaReservation.Infrastructure.Data;

namespace CinemaReservation.Infrastructure.Repositories
{
    public class BillboardRepository : Repository<BillboardEntity>, IBillboardRepository
    {
        private readonly CinemaDbContext _context;

        public BillboardRepository(CinemaDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BillboardEntity>> GetBillboardByMovieGenreAsync(MovieGenreEnum genre, DateTime startDate, DateTime endDate)
        {
            return await _context.Set<BillboardEntity>()
                                 .Include(b => b.Movie)
                                 .Where(b => b.Movie != null && 
                                        b.Movie.Genre == genre &&
                                        b.Date >= startDate &&
                                        b.Date <= endDate)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<SeatEntity>> GetOccupiedSeatsForBillboardAsync(int billboardId)
        {
            return await _context.Set<BookingEntity>()
                                 .Where(b => b.BillboardId == billboardId && b.Seat != null)
                                 .Select(b => b.Seat!)
                                 .ToListAsync();
        }
    }
}
