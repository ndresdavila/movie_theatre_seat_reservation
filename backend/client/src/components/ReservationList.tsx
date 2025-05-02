import React, { useEffect } from 'react';
import { useReservations } from '../context/ReservationContext';
import { Link } from 'react-router-dom';

const ReservationList: React.FC = () => {
  const { bookings, loadBookings, removeBooking } = useReservations();

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      removeBooking(id);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>

      {/* Botón para agregar nueva reserva */}
      <Link
        to="/formulario-agregar-reserva"
        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded mb-4 inline-block transition"
      >
        Agregar Reserva
      </Link>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Película</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{booking.id}</td>
                <td className="px-4 py-2 text-sm">{booking.customerName}</td>
                <td className="px-4 py-2 text-sm">{booking.movieName}</td>
                <td className="px-4 py-2 text-sm">{booking.date}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
                  No hay reservas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;
