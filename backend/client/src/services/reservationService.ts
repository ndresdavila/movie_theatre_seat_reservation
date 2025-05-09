import axios from "axios";
import { CreateBillboardDto, UpdateBillboardDto } from "../types/Billboard";
import { CreateBookingDto } from "../types/Booking";
import { CreateCustomerDto } from "../types/Customer";
import { SeatAvailabilityDto } from "../types/SeatAvailabilityDto";
import { format } from 'date-fns';

const API_URL = "http://localhost:5096/api"; // o el que uses en desarrollo

// Billboard endpoints
export const createBillboard = (billboardData: CreateBillboardDto) => {
  return axios.post(`${API_URL}/billboard`, billboardData);  // POST /api/billboard
};

export const getAllBillboards = () => {
  return axios.get(`${API_URL}/billboard`); // GET /api/billboard
};

export const getBillboardById = (id: number) => {
  return axios.get(`${API_URL}/billboard/${id}`); // GET /api/billboard/{id}
};

export const cancelBillboard = (id: number) => {
  return axios.post(`${API_URL}/billboard/cancel/${id}`); // POST /api/billboard/cancel/{id}
};

// Booking endpoints
export const createBooking = (bookingData: CreateBookingDto) => {
  return axios.post(`${API_URL}/booking`, bookingData);  // POST /api/booking
};

export const getAllBookings = () => {
  return axios.get(`${API_URL}/booking`); // GET /api/booking
};

export const getBookingById = (id: number) => {
  return axios.get(`${API_URL}/booking/${id}`); // GET /api/booking/{id}
};

// Customer endpoints
export const createCustomer = (customerData: CreateCustomerDto) => {
  return axios.post(`${API_URL}/customer`, customerData);  // POST /api/customer
};

export const getAllCustomers = () => {
  return axios.get(`${API_URL}/customer`); // GET /api/customer
};

export const getCustomerById = (id: number) => {
  return axios.get(`${API_URL}/customer/${id}`); // GET /api/customer/{id}
};

// Obtener todas las películas
export const getMovies = async () => {
  const response = await axios.get(`${API_URL}/Movie`);
  return response.data;
};

// Obtener todas las salas
export const getRooms = async () => {
  const response = await axios.get(`${API_URL}/Room`);
  return response.data;
};

// Editar una cartelera existente
export const updateBillboard = (billboardData: UpdateBillboardDto) => {
  return axios.put(`${API_URL}/Billboard/${billboardData.id}`, billboardData);
};

// Eliminar una cartelera por ID
export const deleteBillboard = (id: number) => {
  return axios.delete(`${API_URL}/Billboard/${id}`); // DELETE /api/billboard/{id}
};

export const deleteBooking = (id: number) => {
  return axios.delete(`${API_URL}/booking/${id}`); // DELETE /api/booking/{id}
};

// Butacas
export const getAllSeats = () => axios.get(`${API_URL}/seat`);

/** Disponibilidad de asientos para hoy (todas las salas) */
export const getSeatAvailabilityToday = () =>
  axios.get<SeatAvailabilityDto[]>(`${API_URL}/seat/availability/today`);

// Mostrar reservas de películas de terror en un rango de fechas
export const getHorrorBookingsInRange = async (startDate: string, endDate: string) => {
  // Convertir fechas a MM-DD-YYYY
  const formattedStartDate = format(new Date(startDate), 'MM-dd-yyyy');
  const formattedEndDate = format(new Date(endDate), 'MM-dd-yyyy');

  const response = await axios.get(`${API_URL}/booking/horror`, {
    params: {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    },
  });
  return response.data;
};

// Obtener película por ID
export const getMovieById = async (billboardId: number) => {
  const response = await axios.get(`${API_URL}/billboard/${billboardId}`);
  const movieId = response.data.movieId; // Asumiendo que el MovieId está en la cartelera
  const movieResponse = await axios.get(`${API_URL}/movie/${movieId}`);
  return movieResponse.data;
};