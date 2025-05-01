import axios from "axios";
import { CreateBillboardDto } from "../types/Billboard";
import { CreateBookingDto } from "../types/Booking";
import { CreateCustomerDto } from "../types/Customer";

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

export const cancelBillboardAndReservations = (id: number) => {
  return axios.delete(`${API_URL}/billboard/cancel-with-reservations/${id}`); // DELETE /api/billboard/cancel-with-reservations/{id}
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

