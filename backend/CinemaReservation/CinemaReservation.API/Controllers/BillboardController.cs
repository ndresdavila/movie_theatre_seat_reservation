using Microsoft.AspNetCore.Mvc;
using CinemaReservation.Application.Services;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Enums;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using CinemaReservation.Application.Exceptions;
using CinemaReservation.Domain.Exceptions;

namespace CinemaReservation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillboardController : ControllerBase
    {
        private readonly BillboardService _billboardService;
        private readonly CancelBillboardService _cancelBillboardService;

        public BillboardController(
            BillboardService billboardService,
            CancelBillboardService cancelBillboardService)
        {
            _billboardService = billboardService;
            _cancelBillboardService = cancelBillboardService;
        }

        // GET: api/billboard
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BillboardEntity>>> GetBillboards()
        {
            var billboards = await _billboardService.GetAllBillboardsAsync();
            return Ok(billboards);
        }

        // GET: api/billboard/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BillboardEntity>> GetBillboard(int id)
        {
            var billboard = await _billboardService.GetBillboardByIdAsync(id);
            if (billboard == null)
            {
                return NotFound();
            }
            return Ok(billboard);
        }

        // POST: api/billboard
        [HttpPost]
        public async Task<ActionResult<BillboardEntity>> PostBillboard(BillboardEntity billboard)
        {
            await _billboardService.AddBillboardAsync(billboard);
            return CreatedAtAction(nameof(GetBillboard), new { id = billboard.Id }, billboard);
        }

        // PUT: api/billboard/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBillboard(int id, BillboardEntity billboard)
        {
            if (id != billboard.Id)
            {
                return BadRequest();
            }

            await _billboardService.UpdateBillboardAsync(billboard);
            return NoContent();
        }

        // DELETE: api/billboard/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBillboard(int id)
        {
            await _billboardService.DeleteBillboardAsync(id);
            return NoContent();
        }

        // POST: api/billboard/cancel/5
        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelBillboard(int id)
        {
            await _billboardService.CancelBillboardAsync(id);
            return NoContent();
        }

        // GET: api/billboard/genre/terror
        [HttpGet("genre/{genre}")]
        public async Task<ActionResult<IEnumerable<BillboardEntity>>> GetBillboardsByGenre(MovieGenreEnum genre)
        {
            var billboards = await _billboardService.GetBillboardsByGenreAsync(genre);
            return Ok(billboards);
        }

        // GET: api/billboard/seats/occupied
        [HttpGet("seats/occupied")]
        public async Task<ActionResult<IEnumerable<SeatEntity>>> GetOccupiedSeatsByBillboardAsync()
        {
            var seats = await _billboardService.GetOccupiedSeatsByBillboardAsync();
            return Ok(seats);
        }

        // DELETE: api/billboard/cancel-with-reservations/5
        [HttpDelete("cancel-with-reservations/{id}")]
        public async Task<IActionResult> CancelBillboardAndReservations(int id)
        {
            try
            {
                await _cancelBillboardService.CancelBillboardAndReservationsAsync(id);
                return NoContent(); // 204, mejor que Ok para operaciones de DELETE exitosas
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message); // 404
            }
            catch (PastBillboardCancellationException ex)
            {
                return BadRequest(ex.Message); // 400
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }
    }
}
