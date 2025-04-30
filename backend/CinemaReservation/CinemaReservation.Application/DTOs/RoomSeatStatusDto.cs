namespace CinemaReservation.Application.DTOs
{
    public class RoomSeatStatusDto
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public int TotalSeats { get; set; }
        public int OccupiedSeats { get; set; }
        public int AvailableSeats => TotalSeats - OccupiedSeats;
    }
}
