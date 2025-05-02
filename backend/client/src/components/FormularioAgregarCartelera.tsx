import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createBillboard } from '../services/reservationService';
import { CreateBillboardDto } from '../types/Billboard';
import { getMovies, getRooms } from '../services/reservationService';
import { Movie } from '../types/Movie';
import { Room } from '../types/Room';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importa react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate(); // Inicializa useNavigate

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
    // Verifica si la fecha de inicio es mayor a la de fin
    const startDateTime = new Date(`${data.date}T${data.startTime}:00`);
    const endDateTime = new Date(`${data.date}T${data.endTime}:00`);
    
    if (startDateTime >= endDateTime) {
      toast.error('La hora de inicio debe ser antes que la hora de fin.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // convierte YYYY-MM-DD a ISO UTC
    const isoDate = new Date(`${data.date}T00:00:00Z`).toISOString();

    const payload: CreateBillboardDto = {
      movieId: data.movieId,
      roomId: data.roomId,
      date: isoDate,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    try {
      // Verifica si faltan campos obligatorios
      if (!data.movieId || !data.roomId || !data.date || !data.startTime || !data.endTime) {
        toast.error('Por favor, completa todos los campos requeridos.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      await createBillboard(payload);
      toast.success('Cartelera creada exitosamente', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Espera que el toast desaparezca antes de redirigir
      setTimeout(() => {
        navigate('/admin-cartelera');
      }, 1000); // Redirige después de que el mensaje de éxito se haya cerrado
      reset();
    } catch (error) {
      console.error('Error al crear cartelera', error);
      toast.error('No se pudo crear la cartelera. Intenta nuevamente.', {
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
