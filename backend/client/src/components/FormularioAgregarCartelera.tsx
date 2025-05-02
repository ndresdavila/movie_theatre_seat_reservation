import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createBillboard } from '../services/reservationService';
import { CreateBillboardDto } from '../types/Billboard';
import { getMovies, getRooms } from '../services/reservationService';
import { Movie } from '../types/Movie';
import { Room } from '../types/Room';

type FormValues = {
  movieId: number;
  roomId: number;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
};

const FormularioAgregarCartelera = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms]   = useState<Room[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setMovies(await getMovies());
        setRooms(await getRooms());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // convierte YYYY-MM-DD a ISO UTC
    const isoDate = new Date(`${data.date}T00:00:00Z`).toISOString();

    const payload: CreateBillboardDto = {
      movieId:   data.movieId,
      roomId:    data.roomId,
      date:      isoDate,
      startTime: data.startTime,
      endTime:   data.endTime,
    };

    try {
      await createBillboard(payload);
      alert('Cartelera creada exitosamente');
      reset();
    } catch (error) {
      console.error('Error al crear cartelera', error);
      alert('No se pudo crear la cartelera');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Crear Cartelera</h2>

      <div>
        <label className="block font-medium">Película</label>
        <select
          {...register('movieId', { valueAsNumber: true, required: true })}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona una película</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {errors.movieId && <span className="text-red-500 text-sm">Requerido</span>}
      </div>

      <div>
        <label className="block font-medium">Sala</label>
        <select
          {...register('roomId', { valueAsNumber: true, required: true })}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona una sala</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        {errors.roomId && <span className="text-red-500 text-sm">Requerido</span>}
      </div>

      <div>
        <label className="block font-medium">Fecha</label>
        <input
          type="date"
          {...register('date', { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.date && <span className="text-red-500 text-sm">Requerido</span>}
      </div>

      <div>
        <label className="block font-medium">Hora de inicio</label>
        <input
          type="time"
          {...register('startTime', { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.startTime && <span className="text-red-500 text-sm">Requerido</span>}
      </div>

      <div>
        <label className="block font-medium">Hora de fin</label>
        <input
          type="time"
          {...register('endTime', { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.endTime && <span className="text-red-500 text-sm">Requerido</span>}
      </div>

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Crear Cartelera
      </button>
    </form>
  );
};

export default FormularioAgregarCartelera;
