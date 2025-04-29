using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaReservation.Domain.Entities
{
    public class BookingEntity : BaseEntity
    {
        [Required]
        public DateTime Date { get; set; }

        [ForeignKey("Customer")]
        public int CustomerId { get; set; }
        public CustomerEntity? Customer { get; set; }  // Hacerla nullable para evitar advertencia

        [ForeignKey("Seat")]
        public int SeatId { get; set; }
        public SeatEntity? Seat { get; set; }  // Hacerla nullable para evitar advertencia

        [ForeignKey("Billboard")]
        public int BillboardId { get; set; }
        public BillboardEntity? Billboard { get; set; }  // Hacerla nullable para evitar advertencia

        // Constructor
        public BookingEntity(DateTime date, int customerId, int seatId, int billboardId)
        {
            Date = date;
            CustomerId = customerId;
            SeatId = seatId;
            BillboardId = billboardId;
        }
    }
}
