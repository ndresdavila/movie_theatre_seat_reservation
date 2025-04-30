using Microsoft.AspNetCore.Mvc;
using CinemaReservation.Application.Services;
using CinemaReservation.Domain.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace CinemaReservation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly SeatService _seatService;

        public SeatController(SeatService seatService)
        {
            _seatService = seatService;
        }

        // GET: api/seat
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeatEntity>>> GetSeats()
        {
            var seats = await _seatService.GetAllSeatsAsync();
            return Ok(seats);
        }

        // GET: api/seat/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SeatEntity>> GetSeat(int id)
        {
            var seat = await _seatService.GetSeatByIdAsync(id);
            if (seat == null)
            {
                return NotFound();
            }
            return Ok(seat);
        }

        // POST: api/seat
        [HttpPost]
        public async Task<ActionResult<SeatEntity>> PostSeat(SeatEntity seat)
        {
            await _seatService.AddSeatAsync(seat);
            return CreatedAtAction(nameof(GetSeat), new { id = seat.Id }, seat);
        }

        // PUT: api/seat/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeat(int id, SeatEntity seat)
        {
            if (id != seat.Id)
            {
                return BadRequest();
            }

            await _seatService.UpdateSeatAsync(seat);
            return NoContent();
        }

        // DELETE: api/seat/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            await _seatService.DeleteSeatAsync(id);
            return NoContent();
        }
    }
}
