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
            // Obtener el asiento
            var seat = await _seatRepository.GetByIdAsync(booking.SeatId);
        
            if (seat == null)
                throw new Exception("El asiento no existe.");
        
            if (!seat.Status)
                throw new Exception("El asiento ya está ocupado.");
        
            // Marcar asiento como ocupado
            seat.Status = false;
            await _seatRepository.UpdateAsync(seat);
        
            // Guardar la reserva
            await _bookingRepository.AddAsync(booking);
        }

        public async Task UpdateBookingAsync(BookingEntity booking)
        {
            await _bookingRepository.UpdateAsync(booking);
        }

        public async Task DeleteBookingAsync(int id)
        {
            // 1. Obtener la reserva
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                throw new Exception("La reserva no existe.");
        
            // 2. Obtener el asiento relacionado
            var seat = await _seatRepository.GetByIdAsync(booking.SeatId);
            if (seat != null)
            {
                // 3. Marcar el asiento como disponible
                seat.Status = true;
                await _seatRepository.UpdateAsync(seat);
            }
        
            // 4. Eliminar la reserva
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
