using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;
using CinemaReservation.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaReservation.Application.Services
{
    public class BillboardService
    {
        private readonly IRepository<BillboardEntity> _billboardRepository;
        private readonly IRepository<SeatEntity> _seatRepository;
        private readonly IRepository<BookingEntity> _bookingRepository;

        public BillboardService(
            IRepository<BillboardEntity> billboardRepository,
            IRepository<SeatEntity> seatRepository,
            IRepository<BookingEntity> bookingRepository)
        {
            _billboardRepository = billboardRepository;
            _seatRepository = seatRepository;
            _bookingRepository = bookingRepository;
        }

        public async Task<IEnumerable<BillboardEntity>> GetAllBillboardsAsync()
        {
            return await _billboardRepository.GetAllAsync();
        }

        public async Task<BillboardEntity> GetBillboardByIdAsync(int id)
        {
            return await _billboardRepository.GetByIdAsync(id);
        }

        public async Task AddBillboardAsync(BillboardEntity billboard)
        {
            await _billboardRepository.AddAsync(billboard);
        }

        public async Task UpdateBillboardAsync(BillboardEntity billboard)
        {
            await _billboardRepository.UpdateAsync(billboard);
        }

        public async Task DeleteBillboardAsync(int id)
        {
            await _billboardRepository.DeleteAsync(id);
        }

        // Método para cancelar la cartelera y habilitar las butacas
        public async Task CancelBillboardAsync(int id)
        {
            var billboard = await _billboardRepository.GetByIdAsync(id);
            if (billboard == null)
                throw new Exception("Cartelera no encontrada");

            // Verificamos que la cartelera no tenga fecha pasada
            if (billboard.Date < DateTime.Now)
                throw new Exception("No se puede cancelar funciones de la cartelera con fecha anterior a la actual");

            // Obtención de todas las reservas de esta cartelera
            var bookings = await _bookingRepository.GetAllAsync();
            var affectedBookings = bookings.Where(b => b.BillboardId == id).ToList();

            // Cancelamos las reservas y habilitamos las butacas
            foreach (var booking in affectedBookings)
            {
                // Eliminar las reservas
                await _bookingRepository.DeleteAsync(booking.Id);
                // Habilitar las butacas
                var seat = await _seatRepository.GetByIdAsync(booking.SeatId);
                if (seat != null)
                {
                    seat.Status = true; // Habilitar la butaca
                    await _seatRepository.UpdateAsync(seat);
                }
            }

            // Finalmente, eliminamos la cartelera
            await _billboardRepository.DeleteAsync(billboard.Id);

            // Imprimir lista de clientes afectados (opcional, aquí usas la lista de bookings)
            foreach (var booking in affectedBookings)
            {
                if (booking.Customer != null)
                {
                    Console.WriteLine($"Cliente afectado: {booking.Customer.Name} {booking.Customer.Lastname}");
                }
            }
        }

        // Obtener carteleras por género
        public async Task<IEnumerable<BillboardEntity>> GetBillboardsByGenreAsync(MovieGenreEnum genre)
        {
            var billboards = await _billboardRepository.GetAllAsync();
            return billboards.Where(b => b.Movie != null && b.Movie.Genre == genre);
        }

        // Obtener asientos ocupados para una cartelera
        public async Task<IEnumerable<SeatEntity>> GetOccupiedSeatsByBillboardAsync()
        {
            var billboards = await _billboardRepository.GetAllAsync();
            var occupiedSeats = new List<SeatEntity>();

            foreach (var billboard in billboards)
            {
                var bookings = await _bookingRepository.GetAllAsync();
                var bookedSeats = bookings.Where(b => b.BillboardId == billboard.Id).Select(b => b.SeatId);

                foreach (var seatId in bookedSeats)
                {
                    var seat = await _seatRepository.GetByIdAsync(seatId);
                    if (seat != null)
                    {
                        occupiedSeats.Add(seat);
                    }
                }
            }

            return occupiedSeats;
        }

        
    
    }
}
