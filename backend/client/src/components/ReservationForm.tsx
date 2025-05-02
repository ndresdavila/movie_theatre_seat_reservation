// src/components/ReservationForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  getAllCustomers,
  createCustomer,
  getAllBillboards,
  getAllSeats,
  createBooking,
} from '../services/reservationService';
import type { CreateBookingDto } from '../types/Booking';
import type { CreateCustomerDto, Customer } from '../types/Customer';
import type { Billboard } from '../types/Billboard';
import type { Seat } from '../types/Seat';

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
  seatId: string; // valor único como string, convertido a number
}

const ReservationForm: React.FC = () => {
  const { register, handleSubmit, watch, reset, setValue } = useForm<FormValues>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const selectedBillboardId = watch('billboardId');

  useEffect(() => {
    getAllCustomers().then(res => setCustomers(res.data));
    getAllBillboards().then(res => setBillboards(res.data));
    getAllSeats().then(res => setSeats(res.data));
  }, []);

  useEffect(() => {
    setValue('seatId', '');
  }, [selectedBillboardId, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
      seatId: Number(data.seatId), // conversión a número
    };

    await createBooking(bookingDto);
    alert('Reserva realizada con éxito');
    reset();
  };

  const availableSeats = React.useMemo(() => {
    if (!selectedBillboardId) return [];
    const roomId = billboards.find(b => b.id === +selectedBillboardId)?.roomId;
    return seats.filter(s => s.roomId === roomId && s.status !== false);
  }, [selectedBillboardId, billboards, seats]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Hacer una Reserva</h2>

      <label className="block">
        <input type="checkbox" {...register('newCustomer')} className="mr-2" />
        Cliente nuevo
      </label>

      {watch('newCustomer') ? (
        <>
          <input {...register('documentNumber')} placeholder="N° Documento" className="w-full p-2 border rounded" required />
          <input {...register('firstName')} placeholder="Nombre" className="w-full p-2 border rounded" required />
          <input {...register('lastName')} placeholder="Apellido" className="w-full p-2 border rounded" required />
          <input {...register('age', { valueAsNumber: true })} placeholder="Edad" type="number" className="w-full p-2 border rounded" required />
          <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded" />
          <input {...register('phoneNumber')} placeholder="Teléfono" className="w-full p-2 border rounded" />
        </>
      ) : (
        <select {...register('customerId', { valueAsNumber: true })} className="w-full p-2 border rounded" required>
          <option value="">Selecciona cliente</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.lastname}
            </option>
          ))}
        </select>
      )}

      <select {...register('billboardId', { valueAsNumber: true })} className="w-full p-2 border rounded" required>
        <option value="">Selecciona función</option>
        {billboards.map(b => (
          <option key={b.id} value={b.id}>
            {new Date(b.date).toLocaleDateString()} @ {b.startTime}
          </option>
        ))}
      </select>

      <select {...register('seatId')} className="w-full p-2 border rounded" required>
        <option value="">Selecciona asiento</option>
        {availableSeats.map(s => (
          <option key={s.id} value={s.id.toString()}>
            Fila {s.rowNumber}, Butaca {s.seatNumber}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Confirmar Reserva
      </button>
    </form>
  );
};

export default ReservationForm;
