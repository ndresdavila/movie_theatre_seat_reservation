using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Interfaces;

namespace CinemaReservation.Application.Services
{
    public class BookingService
    {
        private readonly IRepository<BookingEntity> _bookingRepository;

        public BookingService(IRepository<BookingEntity> bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<IEnumerable<BookingEntity>> GetAllBookingsAsync()
        {
            return await _bookingRepository.GetAllAsync();
        }

        public async Task<BookingEntity> GetBookingByIdAsync(int id)
        {
            return await _bookingRepository.GetByIdAsync(id);
        }

        public async Task AddBookingAsync(BookingEntity booking)
        {
            await _bookingRepository.AddAsync(booking);
        }

        public async Task UpdateBookingAsync(BookingEntity booking)
        {
            await _bookingRepository.UpdateAsync(booking);
        }

        public async Task DeleteBookingAsync(int id)
        {
            await _bookingRepository.DeleteAsync(id);
        }
    }
}
