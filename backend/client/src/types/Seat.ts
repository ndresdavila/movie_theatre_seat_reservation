// src/types/Seat.ts
export interface Seat {
    id: number;
    number: number; // Corresponde a `Number` en el backend
    rowNumber: number;   // Corresponde a `RowNumber` en el backend
    roomId: number;      // Corresponde a `RoomId` en el backend
    status?: boolean; // Puede ser calculado si es necesario
}
