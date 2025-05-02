
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getBillboardById, updateBillboard, getRooms } from '../services/reservationService';
import { getAllMovies } from '../services/movieService';
import { Billboard } from '../types/Billboard';

type FormData = {
  movieId: number;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
};

const EditBillboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState, watch } = useForm<FormData>({
    defaultValues: async () => {
      const res = await getBillboardById(Number(id));
      const data = res.data;

      return {
        movieId: data.movieId,
        roomId: data.roomId,
        date: data.date.split('T')[0],
        startTime: data.startTime,
        endTime: data.endTime,
      };
    }
  });

  const [movies, setMovies] = useState<{ id: number; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await getAllMovies();
        setMovies(moviesRes.data);

        const roomsRes = await getRooms();
        setRooms(roomsRes);
      } catch (error) {
        console.error('Error al cargar los datos', error);
      }
    };
    fetchData();
  }, []);

  const convertDateToUTC = (inputDate: string): string => {
    const dateObj = new Date(`${inputDate}T00:00:00Z`);
    return dateObj.toISOString();
  };

  const onSubmit = async (data: FormData) => {
    if (!data.movieId || !data.roomId || !data.date || !data.startTime || !data.endTime) {
      return alert('Por favor, completa todos los campos.');
    }

    const updated = {
      id: Number(id),
      movieId: data.movieId,
      roomId: data.roomId,
      date: convertDateToUTC(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
    };

    try {
      await updateBillboard(updated);
      alert('Cartelera actualizada exitosamente');
      navigate('/admin-cartelera');
    } catch (error) {
      console.error('Error al actualizar la cartelera', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Editar Cartelera</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Película */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Película</label>
          <select {...register('movieId', { required: true })} className="w-full p-2 border rounded">
            <option value="">Selecciona una película</option>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Sala */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Sala</label>
          <select {...register('roomId', { required: true })} className="w-full p-2 border rounded">
            <option value="">Selecciona una sala</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Fecha</label>
          <input type="date" {...register('date', { required: true })} className="w-full p-2 border rounded" />
        </div>

        {/* Hora inicio */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Hora de Inicio</label>
          <input type="time" {...register('startTime', { required: true })} className="w-full p-2 border rounded" />
        </div>

        {/* Hora fin */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Hora de Fin</label>
          <input type="time" {...register('endTime', { required: true })} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Actualizar Cartelera
        </button>
      </form>
    </div>
  );
};

export default EditBillboard;
