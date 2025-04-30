using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CinemaReservation.Domain.Entities;
using CinemaReservation.Domain.Interfaces;

namespace CinemaReservation.Infrastructure.Repositories
{
    public class CustomerRepository : Repository<CustomerEntity>, ICustomerRepository
    {
        private readonly DbContext _context;

        public CustomerRepository(DbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<CustomerEntity> GetByDocumentNumberAsync(string documentNumber)
        {
            return await _context.Set<CustomerEntity>()
                                 .Where(c => c.DocumentNumber == documentNumber)
                                 .FirstOrDefaultAsync();
        }
    }
}
