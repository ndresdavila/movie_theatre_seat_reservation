using CinemaReservation.Application.DTOs;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces; // <-- Cambia esto
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaReservation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService; // <-- Usa la interfaz

        public BookingController(IBookingService bookingService) // <-- Usa la interfaz
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingEntity>>> GetAll()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingEntity>> GetById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound();
            return Ok(booking);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookingEntity booking)
        {
            await _bookingService.AddBookingAsync(booking);
            return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
        }

        

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BookingEntity booking)
        {
            if (id != booking.Id)
                return BadRequest();

            await _bookingService.UpdateBookingAsync(booking);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _bookingService.DeleteBookingAsync(id);
            return NoContent();
        }

        [HttpGet("horror")]
        public async Task<IActionResult> GetHorrorBookingsInDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var bookings = await _bookingService.GetHorrorBookingsInDateRangeAsync(startDate, endDate);
            return Ok(bookings);
        }

        [HttpGet("seat-status")]
        public async Task<ActionResult<IEnumerable<RoomSeatStatusDto>>> GetSeatStatusByRoomForToday()
        {
            var seatStatuses = await _bookingService.GetSeatStatusByRoomForTodayAsync();
            return Ok(seatStatuses);
        }
    }
}
