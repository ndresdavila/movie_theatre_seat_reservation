using CinemaReservation.Application.DTOs;
using CinemaReservation.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaReservation.Domain.Interfaces
{
    public interface IBillboardService
    {
        Task CancelBillboardAndReservationsAsync(int billboardId);
    }
}