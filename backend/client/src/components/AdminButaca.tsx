// src/components/AdminButaca.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  getRooms,
  getSeatAvailabilityToday,
  getAllSeats,
} from '../services/reservationService';
import { Room } from '../types/Room';
import { SeatAvailabilityDto } from '../types/SeatAvailabilityDto';
import { Seat } from '../types/Seat';

const AdminButaca: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availabilityList, setAvailabilityList] = useState<SeatAvailabilityDto[]>([]);
  const [allSeats, setAllSeats] = useState<Seat[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    // 1) Cargar salas (getRooms YA DEVUELVE Room[])
    getRooms()
      .then(roomsArray => setRooms(roomsArray))
      .catch(err => console.error("Error fetching rooms", err));

    // 2) Cargar disponibilidad de hoy (este devuelve AxiosResponse<SeatAvailabilityDto[]>)
    getSeatAvailabilityToday()
      .then(res => setAvailabilityList(res.data))
      .catch(err => console.error("Error fetching availability", err));

    // 3) Cargar TODAS las butacas (getAllSeats devuelve AxiosResponse<Seat[]>)
    getAllSeats()
      .then(res => setAllSeats(res.data))
      .catch(err => console.error("Error fetching seats", err));
  }, []);

  // Computar los detalles de asientos para la sala seleccionada
  const seatDetailsForRoom = useMemo(() => {
    if (selectedRoomId === null) return [];
    // Buscamos la sala
    const room = rooms.find(r => r.id === selectedRoomId);
    // ¿Hay DTO para hoy?
    const dto = availabilityList.find(av => av.roomName === room?.name);
    if (dto) {
      // Uso los datos reales de hoy
      return dto.seatDetails;
    } else {
      // No hay cartelera hoy: marco todo como libre
      return allSeats
        .filter(s => s.roomId === selectedRoomId)
        .map(s => ({
          id:        s.id,
          number:    ('seatNumber' in s ? (s as any).seatNumber : s.number),
          row:       s.rowNumber,
          isOccupied:false,
        }));
    }
  }, [selectedRoomId, rooms, availabilityList, allSeats]);

  // Nombre de la sala seleccionada
  const selectedRoomName = useMemo(() => {
    return rooms.find(r => r.id === selectedRoomId!)?.name ?? '';
  }, [selectedRoomId, rooms]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Administración de Butacas por Sala para Hoy
      </h2>

      {/* Lista de Salas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="border p-4 rounded shadow-md">
            <h3 className="text-lg font-medium">{room.name}</h3>
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
              onClick={() => setSelectedRoomId(room.id)}
            >
              Ver disponibilidad
            </button>
          </div>
        ))}
      </div>

      {/* Disponibilidad de la sala */}
      {selectedRoomId !== null && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Disponibilidad — {selectedRoomName}
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {seatDetailsForRoom.map(seat => (
              <div
                key={seat.id}
                className={`p-4 text-center rounded shadow ${
                  seat.isOccupied ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                Fila {seat.row} — Butaca {seat.number}
                <div className="mt-1 text-sm">
                  {seat.isOccupied ? 'Ocupada' : 'Libre'}
                </div>
              </div>
            ))}
            {seatDetailsForRoom.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No hay butacas definidas en esta sala.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminButaca;
