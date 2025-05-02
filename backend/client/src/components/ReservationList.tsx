// src/components/ReservationList.tsx
import React, { useEffect } from 'react';
import { useReservations } from '../context/ReservationContext';

const ReservationList = () => {
  const { bookings, loadBookings, removeBooking } = useReservations();

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Lista de Reservas</h2>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="border p-4 rounded shadow-md">
            <h3 className="font-medium">{b.movieName}</h3>
            <p>Cliente: {b.customerName}</p>
            <p>Fecha: {new Date(b.date).toLocaleDateString()}</p>
            <button
              onClick={() => removeBooking(b.id)}
              className="bg-red-500 text-white py-1 px-3 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
