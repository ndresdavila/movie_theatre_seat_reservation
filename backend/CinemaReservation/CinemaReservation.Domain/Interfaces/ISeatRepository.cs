using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Entities;

namespace CinemaReservation.Domain.Interfaces
{
    public interface ISeatRepository : IRepository<SeatEntity>
    {
        Task<IEnumerable<SeatEntity>> GetAvailableSeatsInRoomAsync(int roomId);
    }
}
