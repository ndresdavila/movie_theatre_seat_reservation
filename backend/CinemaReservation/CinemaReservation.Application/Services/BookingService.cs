using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Application.DTOs;

namespace CinemaReservation.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly ISeatRepository _seatRepository;
        private readonly IBookingRepository _bookingRepository;

        public BookingService(
            ISeatRepository seatRepository,
            IBookingRepository bookingRepository)
        {
            _seatRepository = seatRepository;
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

        public async Task<IEnumerable<BookingEntity>> GetHorrorBookingsInDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _bookingRepository.GetHorrorBookingsInDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<RoomSeatStatusDto>> GetSeatStatusByRoomForTodayAsync()
        {
            var today = DateTime.UtcNow.Date;

            // Obtener todos los asientos
            var allSeats = await _seatRepository.GetAllAsync();
            // Obtener todas las reservas
            var bookings = await _bookingRepository.GetAllAsync();

            // Agrupar los asientos por sala (RoomId)
            var groupedSeatsByRoom = allSeats
                .GroupBy(s => new { s.RoomId, s.Room.Name })
                .Select(group =>
                {
                    var totalSeats = group.Count();

                    var occupiedSeats = bookings
                        .Where(b => b.Seat != null &&
                                    b.Seat.RoomId == group.Key.RoomId &&
                                    b.Billboard.Date.Date == today)
                        .Select(b => b.SeatId)
                        .Distinct()
                        .Count();

                    return new RoomSeatStatusDto
                    {
                        RoomId = group.Key.RoomId,
                        RoomName = group.Key.Name,
                        TotalSeats = totalSeats,
                        OccupiedSeats = occupiedSeats
                    };
                });

            return groupedSeatsByRoom;
        }

    }
}
