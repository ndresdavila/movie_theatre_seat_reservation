import React, { useState, useEffect } from 'react';
import { getAllBillboards } from '../services/reservationService';
import { Billboard } from '../types/Billboard';

const AdminButaca = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const response = await getAllBillboards();
        setBillboards(response.data);
      } catch (error) {
        console.error("Error fetching billboards", error);
      }
    };

    fetchBillboards();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Administración de Butacas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {billboards.map(billboard => (
          <div key={billboard.id} className="border p-4 rounded shadow-md">
            <h3 className="text-lg font-medium">{billboard.movieName}</h3>
            <p>Fecha: {new Date(billboard.date).toLocaleDateString()}</p>
            <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">Ver butacas</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminButaca;
