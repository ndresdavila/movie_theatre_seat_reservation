using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaReservation.Domain.Entities;

namespace CinemaReservation.Domain.Interfaces
{
    public interface ICustomerRepository : IRepository<CustomerEntity>
    {
        Task<CustomerEntity> GetByDocumentNumberAsync(string documentNumber);
    }
}
