import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBillboardById, updateBillboard } from '../services/reservationService';
import { getAllMovies } from '../services/movieService';
import { getRooms } from '../services/reservationService';

import { Billboard } from '../types/Billboard';

const EditBillboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [billboard, setBillboard] = useState<Billboard | null>(null);
  const [movieId, setMovieId] = useState<number>(0);
  const [roomId, setRoomId] = useState<number>(0);
  const [date, setDate] = useState('');        // formato YYYY-MM-DD
  const [startTime, setStartTime] = useState('');  // HH:MM
  const [endTime, setEndTime] = useState('');      // HH:MM

  const [movies, setMovies] = useState<{ id: number; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  // Convierte "YYYY-MM-DD" a ISO UTC: "YYYY-MM-DDT00:00:00.000Z"
  const convertDateToUTC = (inputDate: string): string => {
    const dateObj = new Date(`${inputDate}T00:00:00Z`);
    return dateObj.toISOString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBillboardById(Number(id));
        const data = res.data;
        setBillboard(data);
        setMovieId(data.movieId);
        setRoomId(data.roomId);
        // Solo la parte de fecha
        setDate(data.date.split('T')[0]);
        setStartTime(data.startTime);
        setEndTime(data.endTime);

        const moviesRes = await getAllMovies();
        setMovies(moviesRes.data);

        const roomsRes = await getRooms();
        setRooms(roomsRes);
      } catch (error) {
        console.error('Error al cargar los datos', error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId || !roomId || !date || !startTime || !endTime) {
      return alert('Por favor, completa todos los campos.');
    }

    // Convertir la fecha a UTC ISO
    const utcDate = convertDateToUTC(date);

    const updated = {
      id: Number(id),
      movieId,
      roomId,
      date: utcDate,
      startTime,
      endTime,
    };

    try {
      await updateBillboard(updated);
      alert('Cartelera actualizada exitosamente');
      navigate('/admin-cartelera');
    } catch (error) {
      console.error('Error al actualizar la cartelera', error);
    }
  };

  if (!billboard) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Editar Cartelera</h2>
      <form onSubmit={handleSubmit}>
        {/* Película */}
        <div className="mb-4">
          <label htmlFor="movieId" className="block text-sm font-semibold">Película</label>
          <select
            id="movieId"
            value={movieId}
            onChange={e => setMovieId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value={0}>Selecciona una película</option>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Sala */}
        <div className="mb-4">
          <label htmlFor="roomId" className="block text-sm font-semibold">Sala</label>
          <select
            id="roomId"
            value={roomId}
            onChange={e => setRoomId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value={0}>Selecciona una sala</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-semibold">Fecha</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Hora inicio */}
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-semibold">Hora de Inicio</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Hora fin */}
        <div className="mb-4">
          <label htmlFor="endTime" className="block text-sm font-semibold">Hora de Fin</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Actualizar Cartelera
        </button>
      </form>
    </div>
  );
};

export default EditBillboard;
