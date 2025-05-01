import React, { useState } from 'react';
import { CreateBookingDto } from '../types/Booking';
import { createBooking } from '../services/reservationService';

const ReservationForm = () => {
  const [customerId, setCustomerId] = useState<number>(0);
  const [billboardId, setBillboardId] = useState<number>(0);
  const [seatId, setSeatId] = useState<number>(0); // Por simplicidad, un solo asiento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData: CreateBookingDto = {
      customerId,
      billboardId,
      seatIds: [seatId],
    };

    try {
      await createBooking(bookingData);
      alert("Reserva realizada con éxito");
    } catch (error) {
      console.error("Error al realizar la reserva", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Hacer una Reserva</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">ID del Cliente</label>
          <input
            type="number"
            value={customerId}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Ej. 1"
            title="ID del Cliente"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ID de la Cartelera (Billboard)</label>
          <input
            type="number"
            value={billboardId}
            onChange={(e) => setBillboardId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Ej. 101"
            title="ID de la Cartelera"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ID del Asiento</label>
          <input
            type="number"
            value={seatId}
            onChange={(e) => setSeatId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Ej. 22"
            title="ID del Asiento"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Confirmar Reserva
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
