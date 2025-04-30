using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;

namespace CinemaReservation.Domain.Interfaces
{
    public interface IBillboardRepository : IRepository<BillboardEntity>
    {
        Task<IEnumerable<BillboardEntity>> GetBillboardByMovieGenreAsync(MovieGenreEnum genre, DateTime startDate, DateTime endDate);
        Task<IEnumerable<SeatEntity>> GetOccupiedSeatsForBillboardAsync(int billboardId);
    }
}
