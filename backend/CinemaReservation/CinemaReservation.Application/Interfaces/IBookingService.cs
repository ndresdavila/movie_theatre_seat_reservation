using CinemaReservation.Application.DTOs;
using CinemaReservation.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaReservation.Domain.Interfaces
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingEntity>> GetAllBookingsAsync();
        Task<BookingEntity> GetBookingByIdAsync(int id);
        Task AddBookingAsync(BookingEntity booking);
        Task UpdateBookingAsync(BookingEntity booking);
        Task DeleteBookingAsync(int id);
        Task<IEnumerable<BookingEntity>> GetHorrorBookingsInDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<RoomSeatStatusDto>> GetSeatStatusByRoomForTodayAsync();
    }
}
