import React, { useEffect, useState } from 'react';
import { createBillboard, getMovies, getRooms } from '../services/reservationService';
import { CreateBillboardDto } from '../types/Billboard';

const FormularioAgregarCartelera = () => {
  const [movieId, setMovieId] = useState<number>(0);
  const [roomId, setRoomId] = useState<number>(0);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [movies, setMovies] = useState<any[]>([]);  // Lista de películas
  const [rooms, setRooms] = useState<any[]>([]);    // Lista de salas

  // Función para convertir la fecha al formato esperado (YYYY-MM-DD) y luego a UTC
  const convertDateToUTC = (inputDate: string): string => {
    // Verifica si la fecha está en el formato adecuado (YYYY-MM-DD)
    const dateObj = new Date(inputDate);  // El valor de inputDate ya es YYYY-MM-DD
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }
    return dateObj.toISOString(); // Convertir a UTC en formato ISO
  };  

  useEffect(() => {
    // Obtener las películas y salas desde el backend cuando el componente se monte
    const fetchMoviesAndRooms = async () => {
      try {
        const moviesResponse = await getMovies();
        const roomsResponse = await getRooms();
        setMovies(moviesResponse);
        setRooms(roomsResponse);
      } catch (error) {
        console.error("Error al obtener películas o salas", error);
      }
    };

    fetchMoviesAndRooms();
  }, []);

  const handleCreateBillboard = async () => {
    // Convertir la fecha ingresada por el usuario al formato adecuado
    const convertedDate = convertDateToUTC(date);

    const billboardData: CreateBillboardDto = {
      movieId,
      roomId,
      startTime,
      endTime,
      date: convertedDate, // Usamos la fecha convertida
    };

    try {
      await createBillboard(billboardData);
      alert("Cartelera creada exitosamente");
    } catch (error) {
      console.error("Error al crear cartelera", error);
    }
  };

  // Obtener la fecha actual y formatearla para usarla como el mínimo permitido en el input
  const getTodayDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Crear Cartelera</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="movieId" className="block font-medium">Selecciona una película</label>
          <select
            id="movieId"
            value={movieId}
            onChange={(e) => setMovieId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={0}>Selecciona una película</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="roomId" className="block font-medium">Selecciona una sala</label>
          <select
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={0}>Selecciona una sala</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block font-medium">Fecha de la función</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            min={getTodayDate()}  // Establecer la fecha mínima
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block font-medium">Hora de inicio</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block font-medium">Hora de fin</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button onClick={handleCreateBillboard} className="bg-blue-500 text-white py-2 px-4 rounded">
          Crear Cartelera
        </button>
      </div>
    </div>
  );
};

export default FormularioAgregarCartelera;
