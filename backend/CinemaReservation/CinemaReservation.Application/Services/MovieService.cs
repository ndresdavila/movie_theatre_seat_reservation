using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Interfaces;

namespace CinemaReservation.Application.Services
{
    public class MovieService
    {
        private readonly IRepository<MovieEntity> _movieRepository;

        public MovieService(IRepository<MovieEntity> movieRepository)
        {
            _movieRepository = movieRepository;
        }

        public async Task<IEnumerable<MovieEntity>> GetAllMoviesAsync()
        {
            return await _movieRepository.GetAllAsync();
        }

        public async Task<MovieEntity> GetMovieByIdAsync(int id)
        {
            return await _movieRepository.GetByIdAsync(id);
        }

        public async Task AddMovieAsync(MovieEntity movie)
        {
            await _movieRepository.AddAsync(movie);
        }

        public async Task UpdateMovieAsync(MovieEntity movie)
        {
            await _movieRepository.UpdateAsync(movie);
        }

        public async Task DeleteMovieAsync(int id)
        {
            await _movieRepository.DeleteAsync(id);
        }
    }
}
