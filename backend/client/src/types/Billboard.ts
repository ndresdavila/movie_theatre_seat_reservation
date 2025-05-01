// src/types/Billboard.ts

// DTO para crear/actualizar
export interface CreateBillboardDto {
  movieId: number;    // ID de la película
  roomId: number;     // ID de la sala
  date: string;       // Fecha en ISO: YYYY-MM-DD
  startTime: string;  // Hora en HH:MM
  endTime: string;    // Hora en HH:MM
}

// Lo que realmente recibes del backend
export interface Billboard {
  id: number;         // ID de la cartelera
  movieId: number;    // ahora sí existe
  roomId: number;     // ID de la sala
  date: string;       // ISO string
  startTime: string;
  endTime: string;
}

  
  export type UpdateBillboardDto = {
    id: number;
    movieId: number;
    roomId: number;
    date: string;
    startTime: string;
    endTime: string;
  };
  