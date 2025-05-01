namespace CinemaReservation.Domain.Exceptions
{
    public class PastBillboardCancellationException : Exception
    {
        public PastBillboardCancellationException()
            : base("No se puede cancelar una cartelera cuya fecha ya ha pasado.")
        {
        }
    }
}