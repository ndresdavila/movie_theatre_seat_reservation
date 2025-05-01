import React, { useState } from 'react';
import { createBillboard } from '../services/reservationService';
import { CreateBillboardDto } from '../types/Billboard';

const AdminCartelera = () => {
  const [movieId, setMovieId] = useState<number>(0);
  const [roomId, setRoomId] = useState<number>(0);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleCreateBillboard = async () => {
    const billboardData: CreateBillboardDto = {
      movieId,
      roomId,
      startTime,
      endTime,
      date,
    };

    try {
      await createBillboard(billboardData);
      alert("Cartelera creada exitosamente");
    } catch (error) {
      console.error("Error al crear cartelera", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Crear Cartelera</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="movieId" className="block font-medium">ID de la película</label>
          <input
            id="movieId"
            type="number"
            value={movieId}
            onChange={(e) => setMovieId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Ingresa el ID de la película"
          />
        </div>
        <div>
          <label htmlFor="roomId" className="block font-medium">ID de la sala</label>
          <input
            id="roomId"
            type="number"
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Ingresa el ID de la sala"
          />
        </div>
        <div>
          <label htmlFor="date" className="block font-medium">Fecha de la función</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
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

export default AdminCartelera;
