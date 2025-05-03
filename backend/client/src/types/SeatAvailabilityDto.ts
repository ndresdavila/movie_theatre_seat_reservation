// src/types/SeatAvailabilityDto.ts

export interface SeatAvailabilityDto {
    billboardId: number;
    roomName: string;
    totalSeats: number;
    occupiedSeats: number;
    availableSeats: number;
    seatDetails: SeatDto[];
  }
  
  export interface SeatDto {
    id: number;
    number: number;
    row: number;
    isOccupied: boolean;
  }
  