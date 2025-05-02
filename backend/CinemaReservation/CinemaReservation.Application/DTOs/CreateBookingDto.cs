namespace CinemaReservation.Application.DTOs
{
    public class CreateBookingDto
    {
        public int CustomerId { get; set; }
        public int BillboardId { get; set; }
        public List<int> SeatIds { get; set; } = new();
    }
}
