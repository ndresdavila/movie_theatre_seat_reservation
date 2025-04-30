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
    public class MovieRepository : Repository<MovieEntity>, IMovieRepository
    {
        private readonly CinemaDbContext _context;

        public MovieRepository(CinemaDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MovieEntity>> GetMoviesByGenreAsync(MovieGenreEnum genre)
        {
            return await _context.Set<MovieEntity>()
                                 .Where(m => m.Genre == genre)
                                 .ToListAsync();
        }
    }
}
