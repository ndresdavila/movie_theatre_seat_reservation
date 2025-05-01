// src/types/Booking.ts

export interface CreateBookingDto {
    customerId: number;
    billboardId: number;
    seatIds: number[];
  }
  
  export interface Booking {
    id: number;
    movieName: string;
    customerName: string;
    date: string; // puede ser Date si ya viene como objeto Date
  }
  