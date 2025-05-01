using System;

namespace CinemaReservation.Application.Exceptions
{
    public class BillboardNotFoundException : Exception
    {
        public BillboardNotFoundException()
            : base("Cartelera no encontrada")
        {
        }
    }
}
