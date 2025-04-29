using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaReservation.Application.Services
{
    public class SeatService
    {
        private readonly IRepository<SeatEntity> _seatRepository;

        public SeatService(IRepository<SeatEntity> seatRepository)
        {
            _seatRepository = seatRepository;
        }

        public async Task<IEnumerable<SeatEntity>> GetAllSeatsAsync()
        {
            return await _seatRepository.GetAllAsync();
        }

        public async Task<SeatEntity> GetSeatByIdAsync(int id)
        {
            return await _seatRepository.GetByIdAsync(id);
        }

        public async Task AddSeatAsync(SeatEntity seat)
        {
            await _seatRepository.AddAsync(seat);
        }

        public async Task UpdateSeatAsync(SeatEntity seat)
        {
            await _seatRepository.UpdateAsync(seat);
        }

        public async Task DeleteSeatAsync(int id)
        {
            await _seatRepository.DeleteAsync(id);
        }
    }
}
