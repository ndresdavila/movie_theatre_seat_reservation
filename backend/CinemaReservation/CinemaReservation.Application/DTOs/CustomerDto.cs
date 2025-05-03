using CinemaReservation.Domain.Entities;

namespace CinemaReservation.Application.DTOs
{
    public class CustomerDto
    {
        public string DocumentNumber { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public short Age { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        public CustomerDto(string documentNumber, string name, string lastname, short age, string? phoneNumber = null, string? email = null)
        {
            DocumentNumber = documentNumber;
            Name = name;
            Lastname = lastname;
            Age = age;
            PhoneNumber = phoneNumber;
            Email = email;
        }

        public static CustomerDto FromEntity(CustomerEntity customer)
        {
            return new CustomerDto(
                customer.DocumentNumber,
                customer.Name,
                customer.Lastname,
                customer.Age,
                customer.PhoneNumber,
                customer.Email
            );
        }
    }
}
