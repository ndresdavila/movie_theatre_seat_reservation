// src/components/AdminButaca.tsx
import React, { useState, useEffect } from 'react';
import { getAllBillboards, getMovies, getAllSeats } from '../services/reservationService';
import { Billboard } from '../types/Billboard';
import { Movie } from '../types/Movie';
import { Seat } from '../types/Seat';

const AdminButaca = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedBillboardId, setSelectedBillboardId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener carteleras
        const bRes = await getAllBillboards();
        setBillboards(bRes.data);

        // Obtener películas
        const mRes = await getMovies();
        setMovies(mRes);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      if (selectedBillboardId) {
        try {
          // Obtener las butacas de la cartelera seleccionada
          const seatRes = await getAllSeats();
          // Filtrar las butacas que corresponden a la sala de la cartelera
          const filteredSeats = seatRes.data.filter(
            (seat: Seat) => seat.roomId === selectedBillboardId
          );
          setSeats(filteredSeats);
        } catch (error) {
          console.error("Error fetching seats", error);
        }
      }
    };

    fetchSeats();
  }, [selectedBillboardId]);

  const getMovieName = (id: number) =>
    movies.find(m => m.id === id)?.name ?? `#${id}`;

  const toggleSeatAvailability = (seatId: number) => {
    // Aquí, puedes implementar la lógica para cambiar el estado de disponibilidad de una butaca
    const updatedSeats = seats.map(seat =>
      seat.id === seatId
        ? { ...seat, isAvailable: !seat.isAvailable } // Cambia el estado de disponibilidad de la butaca
        : seat
    );
    setSeats(updatedSeats);
    // Llamar al backend para actualizar la disponibilidad de la butaca
    // (esta parte debes implementarla en el servicio)
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Administración de Butacas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {billboards.map(b => (
          <div key={b.id} className="border p-4 rounded shadow-md">
            <h3 className="text-lg font-medium">{getMovieName(b.movieId)}</h3>
            <p>Fecha: {new Date(b.date).toLocaleDateString()}</p>
            <button
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setSelectedBillboardId(b.roomId)} // Al seleccionar la cartelera, mostramos las butacas de la sala correspondiente
            >
              Ver butacas
            </button>
          </div>
        ))}
      </div>

      {selectedBillboardId && (
        <div>
          <h3 className="mt-4 text-xl font-semibold">Butacas de la cartelera</h3>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className={`p-4 text-center cursor-pointer ${seat.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                onClick={() => toggleSeatAvailability(seat.id)}
              >
                Fila {seat.rowNumber} - Butaca {seat.seatNumber}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminButaca;
