using System.ComponentModel.DataAnnotations;

namespace CinemaReservation.Domain.Entities
{
    public class CustomerEntity : BaseEntity
    {
        [Required]
        [MaxLength(20)]
        public string DocumentNumber { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        [MaxLength(30)]
        public string Lastname { get; set; }

        [Required]
        public short Age { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        // Constructor
        public CustomerEntity(
            string documentNumber,
            string name,
            string lastname,
            short age,
            string? phoneNumber = null,
            string? email = null
        )
        {
            DocumentNumber = documentNumber;
            Name = name;
            Lastname = lastname;
            Age = age;
            PhoneNumber = phoneNumber;
            Email = email;
        }
    }
}
