using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;

namespace CinemaReservation.Domain.Interfaces
{
    public interface IBookingRepository : IRepository<BookingEntity>
    {
        Task<IEnumerable<BookingEntity>> GetBookingsByMovieGenreAsync(MovieGenreEnum genre, DateTime startDate, DateTime endDate);
        Task<IEnumerable<SeatEntity>> GetAvailableSeatsByRoomAsync(int roomId, DateTime date);
    }
}
