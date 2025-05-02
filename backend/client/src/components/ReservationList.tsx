// src/components/ReservationList.tsx
import React, { useEffect, useState } from 'react';
import { useReservations } from '../context/ReservationContext';
import { Link } from 'react-router-dom';
import { getAllCustomers, getMovies, getAllBillboards } from '../services/reservationService';
import type { Customer } from '../types/Customer';
import type { Movie } from '../types/Movie';
import type { Billboard } from '../types/Billboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReservationList: React.FC = () => {
  const { bookings, loadBookings, removeBooking } = useReservations();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);

  useEffect(() => {
    // 1) Cargo reservas
    loadBookings();

    // 2) Cargo todos los clientes
    getAllCustomers()
      .then(res => setCustomers(res.data))
      .catch(err => console.error('Error cargando clientes', err));

    // 3) Cargo todas las películas
    getMovies()
      .then(data => setMovies(data))
      .catch(err => console.error('Error cargando películas', err));

    // 4) Cargo todas las carteleras (para poder mapear billboardId → movieId)
    getAllBillboards()
      .then(res => setBillboards(res.data))
      .catch(err => console.error('Error cargando carteleras', err));
  }, [loadBookings]);

  const handleDelete = async (id: number) => {

    try {
      await removeBooking(id);
      toast.success('Reserva eliminada con éxito', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch {
      toast.error('Error al eliminar la reserva', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const getCustomerName = (customerId: number): string => {
    const c = customers.find(c => c.id === customerId);
    return c ? `${c.name} ${c.lastname}` : '–';
  };

  const getMovieName = (billboardId: number): string => {
    const bill = billboards.find(b => b.id === billboardId);
    if (!bill) return '–';
    const m = movies.find(m => m.id === bill.movieId);
    return m ? m.name : '–';
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>

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
            {bookings.map((booking: any) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{booking.id}</td>
                <td className="px-4 py-2 text-sm">{getCustomerName(booking.customerId)}</td>
                <td className="px-4 py-2 text-sm">{getMovieName(booking.billboardId)}</td>
                <td className="px-4 py-2 text-sm">{booking.date.split('.')[0].replace('T', ' ').slice(0, 16)}</td>
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

      {/* Contenedor para mostrar los toasts */}
      <ToastContainer />
    </div>
  );
};

export default ReservationList;
