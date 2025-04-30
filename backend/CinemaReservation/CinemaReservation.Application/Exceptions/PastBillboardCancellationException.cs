using System;

namespace CinemaReservation.Application.Exceptions
{
    public class PastBillboardCancellationException : Exception
    {
        public PastBillboardCancellationException()
            : base("No se puede cancelar funciones de la cartelera con fecha anterior a la actual")
        {
        }
    }
}
