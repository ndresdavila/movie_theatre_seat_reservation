// src/components/AdminButaca.tsx
import React, { useState, useEffect } from 'react';
import { getAllBillboards, getMovies } from '../services/reservationService';
import { Billboard } from '../types/Billboard';
import { Movie } from '../types/Movie';

const AdminButaca = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // traemos las carteleras
        const bRes = await getAllBillboards();
        setBillboards(bRes.data);

        // traemos las películas
        const mRes = await getMovies();
        setMovies(mRes);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const getMovieName = (id: number) =>
    movies.find(m => m.id === id)?.name ?? `#${id}`;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Administración de Butacas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {billboards.map(b => (
          <div key={b.id} className="border p-4 rounded shadow-md">
            <h3 className="text-lg font-medium">{getMovieName(b.movieId)}</h3>
            <p>Fecha: {new Date(b.date).toLocaleDateString()}</p>
            <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
              Ver butacas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminButaca;
