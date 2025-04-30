using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;

namespace CinemaReservation.Domain.Interfaces
{
    public interface IMovieRepository : IRepository<MovieEntity>
    {
        Task<IEnumerable<MovieEntity>> GetMoviesByGenreAsync(MovieGenreEnum genre);
    }
}
