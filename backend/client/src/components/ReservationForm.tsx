// src/components/ReservationForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  getAllCustomers,
  createCustomer,
  getAllBillboards,
  getAllSeats,
  createBooking,
  getMovies,
  getRooms,
} from '../services/reservationService';
import type { CreateBookingDto } from '../types/Booking';
import type { CreateCustomerDto, Customer } from '../types/Customer';
import type { Billboard } from '../types/Billboard';
import type { Seat } from '../types/Seat';
import type { Movie } from '../types/Movie';
import type { Room } from '../types/Room';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormValues {
  newCustomer?: boolean;
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  phoneNumber?: string;
  customerId?: number;
  billboardId: number;
  seatId: string;
}

const ReservationForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormValues>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const selectedBillboardId = watch('billboardId');
  const isNew = watch('newCustomer');

  useEffect(() => {
    getAllCustomers().then(res => setCustomers(res.data));
    getAllBillboards().then(res => setBillboards(res.data));
    getAllSeats().then(res => setSeats(res.data));
    getMovies().then(data => setMovies(data));
    getRooms().then(data => setRooms(data));
  }, []);

  // reset seat selection when billboard changes
  useEffect(() => {
    setValue('seatId', '');
  }, [selectedBillboardId, setValue]);

  const availableSeats = React.useMemo(() => {
    if (!selectedBillboardId) return [];
    const roomId = billboards.find(b => b.id === +selectedBillboardId)?.roomId;
    return seats.filter(s => s.roomId === roomId && s.status !== false);
  }, [selectedBillboardId, billboards, seats]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (!data.billboardId || !data.seatId || (!data.newCustomer && !data.customerId)) {
        toast.error('Por favor, completa todos los campos obligatorios.');
        return;
      }

      let customerId = data.customerId!;
      if (data.newCustomer) {
        const dto: CreateCustomerDto = {
          documentNumber: data.documentNumber!,
          name: data.firstName!,
          lastName: data.lastName!,
          age: data.age!,
          email: data.email,
          phoneNumber: data.phoneNumber,
        };
        const created = await createCustomer(dto);
        customerId = created.data.id;
      }

      const bookingDto: CreateBookingDto = {
        customerId,
        billboardId: data.billboardId,
        seatId: Number(data.seatId),
      };

      await createBooking(bookingDto);
      toast.success('Reserva realizada con éxito!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

      // después de 1 segundo, navegar y resetear
      setTimeout(() => {
        //reset();
        navigate('/reservations');
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error('Error al realizar la reserva. Intenta nuevamente.');
    }
  };

  // Helper to format billboard label
  const formatBillboardLabel = (b: Billboard) => {
    const movie = movies.find(m => m.id === b.movieId);
    const room  = rooms.find(r => r.id === b.roomId);
    const date  = new Date(b.date).toLocaleDateString();
    return `${movie?.name ?? 'Película?'} — ${room?.name ?? 'Sala?'} — ${date} @ ${b.startTime}`;
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Hacer una Reserva</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block">
          <input type="checkbox" {...register('newCustomer')} className="mr-2" />
          Cliente nuevo
        </label>

        {isNew ? (
          <>
            <input
              {...register('documentNumber', { required: true })}
              placeholder="N° Documento"
              className="w-full p-2 border rounded"
            />
            {errors.documentNumber && <span className="text-red-500">Requerido</span>}
            <input
              {...register('firstName', { required: true })}
              placeholder="Nombre"
              className="w-full p-2 border rounded"
            />
            {errors.firstName && <span className="text-red-500">Requerido</span>}
            <input
              {...register('lastName', { required: true })}
              placeholder="Apellido"
              className="w-full p-2 border rounded"
            />
            {errors.lastName && <span className="text-red-500">Requerido</span>}
            <input
              {...register('age', { required: true, valueAsNumber: true })}
              placeholder="Edad"
              type="number"
              className="w-full p-2 border rounded"
            />
            {errors.age && <span className="text-red-500">Requerido</span>}
            <input
              {...register('email')}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              {...register('phoneNumber')}
              placeholder="Teléfono"
              className="w-full p-2 border rounded"
            />
          </>
        ) : (
          <div>
            <select
              {...register('customerId', { required: true, valueAsNumber: true })}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona cliente</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.lastname}
                </option>
              ))}
            </select>
            {errors.customerId && <span className="text-red-500">Requerido</span>}
          </div>
        )}

        <div>
          <select
            {...register('billboardId', { required: true, valueAsNumber: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona función</option>
            {billboards.map(b => (
              <option key={b.id} value={b.id}>
                {formatBillboardLabel(b)}
              </option>
            ))}
          </select>
          {errors.billboardId && <span className="text-red-500">Requerido</span>}
        </div>

        <div>
          <select
            {...register('seatId', { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona asiento</option>
            {availableSeats.map(s => (
              <option key={s.id} value={s.id.toString()}>
                Fila {s.rowNumber}, Butaca {s.number}
              </option>
            ))}
          </select>
          {errors.seatId && <span className="text-red-500">Requerido</span>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow"
        >
          Confirmar Reserva
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ReservationForm;
