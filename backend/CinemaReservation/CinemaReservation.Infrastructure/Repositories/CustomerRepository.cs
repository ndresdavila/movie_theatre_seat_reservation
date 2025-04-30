using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces;
using CinemaReservation.Infrastructure.Data;

namespace CinemaReservation.Infrastructure.Repositories
{
    public class CustomerRepository : Repository<CustomerEntity>, ICustomerRepository
    {
        private readonly CinemaDbContext _context;

        public CustomerRepository(CinemaDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<CustomerEntity> GetByDocumentNumberAsync(string documentNumber)
        {
            var customer = await _context.Set<CustomerEntity>()
                                         .Where(c => c.DocumentNumber == documentNumber)
                                         .FirstOrDefaultAsync();
        
            if (customer == null)
            {
                throw new InvalidOperationException("Customer not found");
            }
        
            return customer;
        }

    }
}
