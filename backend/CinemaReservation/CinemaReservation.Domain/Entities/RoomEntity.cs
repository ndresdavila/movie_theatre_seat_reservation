using System.ComponentModel.DataAnnotations;

namespace CinemaReservation.Domain.Entities
{
    public class RoomEntity : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
    
        [Required]
        public short Number { get; set; }
    
        // Constructor
        public RoomEntity(string name, short number)
        {
            Name = name;
            Number = number;
        }
    }
}
