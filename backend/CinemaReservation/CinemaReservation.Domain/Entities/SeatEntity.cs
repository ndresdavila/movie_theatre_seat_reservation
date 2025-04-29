using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaReservation.Domain.Entities
{
    public class SeatEntity : BaseEntity
    {
        [Required]
        public short Number { get; set; }

        [Required]
        public short RowNumber { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public RoomEntity? Room { get; set; }  // Hacerla nullable para evitar advertencia

        // Constructor
        public SeatEntity(short number, short rowNumber, int roomId)
        {
            Number = number;
            RowNumber = rowNumber;
            RoomId = roomId;
        }
    }
}
