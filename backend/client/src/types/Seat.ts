// src/types/Seat.ts
export interface Seat {
    id: number;
    seatNumber: number; // Corresponde a `Number` en el backend
    rowNumber: number;   // Corresponde a `RowNumber` en el backend
    roomId: number;      // Corresponde a `RoomId` en el backend
    isAvailable?: boolean; // Puede ser calculado si es necesario
}
