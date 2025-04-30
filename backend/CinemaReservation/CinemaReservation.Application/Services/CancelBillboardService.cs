using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Application.Exceptions;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Infrastructure.Data;

namespace CinemaReservation.Application.Services
{
    public class CancelBillboardService
    {
        private readonly IRepository<BillboardEntity> _billboardRepository;
        private readonly IRepository<SeatEntity> _seatRepository;
        private readonly IRepository<BookingEntity> _bookingRepository;
        private readonly CinemaDbContext _context;

        public CancelBillboardService(
            IRepository<BillboardEntity> billboardRepository,
            IRepository<SeatEntity> seatRepository,
            IRepository<BookingEntity> bookingRepository,
            CinemaDbContext context)
        {
            _billboardRepository = billboardRepository;
            _seatRepository = seatRepository;
            _bookingRepository = bookingRepository;
            _context = context;
        }

        public async Task CancelBillboardAndReservationsAsync(int billboardId)
        {
            using (IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var billboard = await _billboardRepository.GetByIdAsync(billboardId);

                    if (billboard == null)
                        throw new Exception("Cartelera no encontrada");

                    if (billboard.Date < DateTime.Now)
                        throw new PastBillboardCancellationException();

                    var allBookings = await _bookingRepository.GetAllAsync();
                    var bookings = allBookings.Where(b => b.BillboardId == billboardId).ToList();

                    foreach (var booking in bookings)
                    {
                        var seat = await _seatRepository.GetByIdAsync(booking.SeatId);
                        if (seat != null)
                        {
                            seat.Status = true; // Habilitar butaca
                            await _seatRepository.UpdateAsync(seat);
                        }

                        await _bookingRepository.DeleteAsync(booking.Id);

                        if (booking.Customer != null)
                        {
                            Console.WriteLine($"Cliente afectado: {booking.Customer.Name} {booking.Customer.Lastname}");
                        }
                    }

                    await _billboardRepository.DeleteAsync(billboard.Id);
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }
    }
}
