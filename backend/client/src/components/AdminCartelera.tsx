import React, { useEffect, useState } from 'react';
import { getAllBillboards, getMovies, getRooms, deleteBooking, cancelBillboard } from '../services/reservationService';
import { Billboard } from '../types/Billboard';
import { Movie } from '../types/Movie';
import { Room } from '../types/Room';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Booking } from '../types/Booking';
import axios from 'axios';
import { Customer } from '../types/Customer';

const API_URL = "http://localhost:5096/api";

const AdminCartelera = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const res = await getAllBillboards();
        setBillboards(res.data);
      } catch (error) {
        console.error("Error al obtener las carteleras", error);
      }
    };
    const fetchMovies = async () => {
      try {
        const list = await getMovies();
        setMovies(list);
      } catch (error) {
        console.error("Error al obtener películas", error);
      }
    };
    const fetchRooms = async () => {
      try {
        const list = await getRooms();
        setRooms(list);
      } catch (error) {
        console.error("Error al obtener salas", error);
      }
    };

    fetchBillboards();
    fetchMovies();
    fetchRooms();
  }, []);

  const handleDeleteBillboard = async (id: number, dateStr: string) => {
    const functionDate = new Date(dateStr).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
  
    if (functionDate < today) {
      toast.error('No se puede cancelar funciones de la cartelera con fecha anterior a la actual', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    try {
      // Obtener todas las reservas asociadas a la cartelera
      const bookingsResponse = await axios.get(`${API_URL}/booking`, {
        params: { billboardId: id }, // Suponiendo que existe un parámetro para filtrar por billboardId
      });
      
      const bookings = bookingsResponse.data;
      const customerPromises = bookings.map(async (booking: Booking) => {
        const customerResponse = await axios.get(`${API_URL}/customer/${booking.customerId}`);
        return customerResponse.data;
      });
  
      const customers = await Promise.all(customerPromises);
  
      // Mostrar los datos de los clientes
      const customerNames = customers.length > 0
      ? customers.map((customer: Customer) => `${customer.name} ${customer.lastname}`).join(', ')
      : 'Ninguno';
      console.log(`Los siguientes clientes tienen reservas en esta cartelera: ${customerNames}`);
      
      // Mostrar los nombres de los clientes
      toast.info(`Los siguientes clientes tienen reservas en esta cartelera: ${customerNames}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // Eliminar las reservas
      for (let booking of bookings) {
        await deleteBooking(booking.id);
      }
  
      // Finalmente eliminar la cartelera
      await cancelBillboard(id);
      setBillboards(billboards.filter(b => b.id !== id));
      toast.success('Cartelera eliminada y reservas canceladas exitosamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error al eliminar cartelera", error);
      toast.error('Error al eliminar cartelera. Intenta nuevamente.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  const handleEditBillboard = (id: number) => {
    navigate(`/editar-cartelera/${id}`);
  };

  const getMovieName = (movieId: number) =>
    movies.find(m => m.id === movieId)?.name ?? `#${movieId}`;
  const getRoomName = (roomId: number) =>
    rooms.find(r => r.id === roomId)?.name ?? `#${roomId}`;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Administrar Carteleras</h2>
      <Link
        to="/formulario-agregar-cartelera"
        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded mb-4 inline-block transition"
      >
        Agregar Cartelera
      </Link>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Película</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sala</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {billboards.map(b => {
              const [date] = b.date.split('T');
              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{getMovieName(b.movieId)}</td>
                  <td className="px-4 py-2 text-sm">{getRoomName(b.roomId)}</td>
                  <td className="px-4 py-2 text-sm">{date}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditBillboard(b.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBillboard(b.id, b.date)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
            {billboards.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                  No hay carteleras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCartelera;
