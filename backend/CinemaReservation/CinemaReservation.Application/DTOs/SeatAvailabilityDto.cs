// Application/DTOs/SeatAvailabilityDto.cs

public class SeatAvailabilityDto
{
    public int BillboardId { get; set; }
    public string RoomName { get; set; }
    public int TotalSeats { get; set; }
    public int OccupiedSeats { get; set; }
    public int AvailableSeats { get; set; }
    public List<SeatDto> SeatDetails { get; set; } = new();
}

public class SeatDto
{
    public int Id { get; set; }
    public short Number { get; set; }
    public short Row { get; set; }
    public bool IsOccupied { get; set; }
}
