using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaReservation.Domain.Entities
{
    public class BillboardEntity : BaseEntity
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [ForeignKey("Movie")]
        public int MovieId { get; set; }
        public MovieEntity? Movie { get; set; }  // Hacerla nullable para evitar advertencia

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public RoomEntity? Room { get; set; }  // Hacerla nullable para evitar advertencia

        // Constructor
        public BillboardEntity(DateTime date, TimeSpan startTime, TimeSpan endTime, int movieId, int roomId)
        {
            Date = date;
            StartTime = startTime;
            EndTime = endTime;
            MovieId = movieId;
            RoomId = roomId;
        }
    }
}
