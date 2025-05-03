import React, { useState } from 'react';
import { getHorrorBookingsInRange } from '../services/reservationService';
import { Booking } from '../types/Booking';
import { format } from 'date-fns';

const HorrorBookings = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const result = await getHorrorBookingsInRange(startDate, endDate);
      const enrichedBookings = result.map((booking: any) => {
        // Enriquecemos la reserva con el nombre del cliente y la película
        const customer = booking.customer; // El cliente está directamente en la respuesta
        const movie = booking.billboard.movie; // La película está directamente en la respuesta

        return {
          id: booking.id,
          date: booking.date,
          customerName: customer.name + ' ' + customer.lastname,
          movieName: movie.name,
        };
      });
      setBookings(enrichedBookings);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reservas de Películas de Terror</h2>

      <div className="flex gap-4 mb-4">
        <div>
            <label htmlFor="start-date" className="block text-sm font-medium mb-1">Desde</label>
            <input
              id="start-date"
              title="Fecha de inicio"
              placeholder="AAAA-MM-DD"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            />
        </div>
        <div>
            <label htmlFor="end-date" className="block text-sm font-medium mb-1">Hasta</label>
            <input
              id="end-date"
              title="Fecha de fin"
              placeholder="AAAA-MM-DD"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Cliente</th>
                <th className="px-4 py-2 text-left text-sm">Película</th>
                <th className="px-4 py-2 text-left text-sm">Fecha de Reserva</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{booking.customerName}</td>
                  <td className="px-4 py-2 text-sm">{booking.movieName}</td>
                  <td className="px-4 py-2 text-sm">
                    {format(new Date(booking.date), 'MM-dd-yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No se encontraron reservas.</p>
      )}
    </div>
  );
};

export default HorrorBookings;
