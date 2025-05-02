// src/context/ReservationContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { getAllBookings, createBooking, deleteBooking } from '../services/reservationService';
import type { Booking, CreateBookingDto } from '../types/Booking';

// Define la forma del contexto
interface ReservationContextProps {
  bookings: Booking[];
  loadBookings: () => Promise<void>;
  addBooking: (data: CreateBookingDto) => Promise<void>;
  removeBooking: (id: number) => Promise<void>;
}

// Valor por defecto
const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Carga todas las reservas desde el backend
  const loadBookings = useCallback(async () => {
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    }
  }, []);

  // Agrega una nueva reserva y refresca la lista
  const addBooking = useCallback(async (data: CreateBookingDto) => {
    try {
      await createBooking(data);
      await loadBookings();
    } catch (error) {
      console.error('Error creando reserva:', error);
    }
  }, [loadBookings]);

  // Elimina una reserva y refresca la lista
  const removeBooking = useCallback(async (id: number) => {
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error eliminando reserva:', error);
    }
  }, []);

  return (
    <ReservationContext.Provider value={{ bookings, loadBookings, addBooking, removeBooking }}>
      {children}
    </ReservationContext.Provider>
  );
};

// Hook de consumo
export const useReservations = (): ReservationContextProps => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};
