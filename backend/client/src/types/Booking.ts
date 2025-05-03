// src/types/Booking.ts

export interface CreateBookingDto {
    customerId: number;
    billboardId: number;
    seatId: number;
  }
  
  export interface Booking {
    id: number;
    customerId: number;    // Añadido para obtener el id del cliente
    billboardId: number;   // Añadido para obtener el id de la cartelera
    movieName: string;
    customerName: string;
    date: string; // Puede ser Date si ya viene como objeto Date
  }