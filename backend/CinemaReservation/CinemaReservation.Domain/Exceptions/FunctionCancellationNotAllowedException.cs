using System;

namespace CinemaReservation.Domain.Exceptions
{
    public class FunctionCancellationNotAllowedException : Exception
    {
        public FunctionCancellationNotAllowedException(string message) : base(message) { }
    }
}
