// AdminCartelera.tsx
import React, { useEffect, useState } from 'react';
import { getAllBillboards, deleteBillboard, getMovies, getRooms } from '../services/reservationService';
import { Billboard } from '../types/Billboard';
import { Movie } from '../types/Movie';
import { Room } from '../types/Room';
import { Link, useNavigate } from 'react-router-dom';

const AdminCartelera = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Cargo carteleras
    const fetchBillboards = async () => {
      try {
        const res = await getAllBillboards();
        setBillboards(res.data);
      } catch (error) {
        console.error("Error al obtener las carteleras", error);
      }
    };
    // 2) Cargo películas
    const fetchMovies = async () => {
      try {
        const list = await getMovies();
        setMovies(list);
      } catch (error) {
        console.error("Error al obtener películas", error);
      }
    };
    // 3) Cargo salas
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

  const handleDeleteBillboard = async (id: number) => {
    try {
      await deleteBillboard(id);
      setBillboards(billboards.filter(b => b.id !== id));
      alert("Cartelera eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar cartelera", error);
    }
  };

  const handleEditBillboard = (id: number) => {
    navigate(`/editar-cartelera/${id}`);
  };

  // Helper para mostrar nombre
  const getMovieName = (movieId: number) =>
    movies.find(m => m.id === movieId)?.name ?? `#${movieId}`;
  const getRoomName = (roomId: number) =>
    rooms.find(r => r.id === roomId)?.name ?? `#${roomId}`;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Administrar Carteleras</h2>
      <Link
        to="/formulario-agregar-cartelera"
        className="bg-green-500 text-white py-2 px-4 rounded mb-4 inline-block"
      >
        Agregar Cartelera
      </Link>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Película</th>
            <th className="border p-2">Sala</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {billboards.map(b => (
            <tr key={b.id}>
              <td className="border p-2">{getMovieName(b.movieId)}</td>
              <td className="border p-2">{getRoomName(b.roomId)}</td>
              <td className="border p-2">{new Date(b.date).toLocaleDateString()}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditBillboard(b.id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteBillboard(b.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCartelera;
