// src/types/Billboard.ts

// Este tipo es para enviar datos para crear una cartelera al backend
export interface CreateBillboardDto {
    movieId: number;       // ID de la película
    roomId: number;        // ID de la sala
    date: string;          // Fecha en formato ISO (YYYY-MM-DD)
    startTime: string;     // Hora de inicio en formato ISO (HH:MM)
    endTime: string;       // Hora de fin en formato ISO (HH:MM)
  }
  
  // Este tipo es para representar una cartelera que recibes de la API
  export interface Billboard {
    id: number;            // ID de la cartelera
    movieName: string;     // Nombre de la película
    date: string;          // Fecha en formato ISO (YYYY-MM-DD)
    roomId: number;        // ID de la sala
    startTime: string;     // Hora de inicio en formato ISO (HH:MM)
    endTime: string;       // Hora de fin en formato ISO (HH:MM)
  }
  