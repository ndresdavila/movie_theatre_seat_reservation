using CinemaReservation.Domain.Entities;
using CinemaReservation.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Interfaces;

namespace CinemaReservation.Application.Services
{
    public class RoomService
    {
        private readonly IRepository<RoomEntity> _roomRepository;

        public RoomService(IRepository<RoomEntity> roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<IEnumerable<RoomEntity>> GetAllRoomsAsync()
        {
            return await _roomRepository.GetAllAsync();
        }

        public async Task<RoomEntity> GetRoomByIdAsync(int id)
        {
            return await _roomRepository.GetByIdAsync(id);
        }

        public async Task AddRoomAsync(RoomEntity room)
        {
            await _roomRepository.AddAsync(room);
        }

        public async Task UpdateRoomAsync(RoomEntity room)
        {
            await _roomRepository.UpdateAsync(room);
        }

        public async Task DeleteRoomAsync(int id)
        {
            await _roomRepository.DeleteAsync(id);
        }
    }
}
