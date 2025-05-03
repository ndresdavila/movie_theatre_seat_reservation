export interface CreateBookingDto {
  customerId: number;
  billboardId: number;
  seatId: number;
}

export interface Booking {
  id: number;
  customerId: number;
  billboardId: number;
  movieName: string;
  customerName: string;
  reservationDate: string;
  movieDate: string;
}