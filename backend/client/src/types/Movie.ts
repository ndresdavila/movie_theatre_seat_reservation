// src/types/Movie.ts
export interface Movie {
    id: number;
    title: string;
    genre: string;
    duration: string; // Mantén la duración como string, pero formateada apropiadamente
    allowedAge: number;  // Agregar la edad permitida
}
