import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../services/reservationService';
import { Booking } from '../types/Booking';

const ReservationList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Lista de Reservas</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border p-4 rounded shadow-md">
            <h3 className="font-medium">{booking.movieName}</h3>
            <p>Cliente: {booking.customerName}</p>
            <p>Fecha de la reserva: {new Date(booking.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
