// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import AdminButaca from './components/AdminButaca';
import AdminCartelera from './components/AdminCartelera';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import FormularioAgregarCartelera from './components/FormularioAgregarCartelera';
import EditBillboard from './components/EditBillboard';
import HorrorBookings from './components/HorrorBookings';
import { JSX } from 'react';

const Home = (): JSX.Element => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
    <h1 className="text-5xl font-extrabold text-indigo-700 mb-8">
      🎬 Reserva Butacas de Cine
    </h1>
    <nav className="space-x-4">
      <Link
        to="/admin-cartelera"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-shadow duration-200"
      >
        Administrar Cartelera
      </Link>
      <Link
        to="/reservations"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-shadow duration-200"
      >
        Administrar Reservas
      </Link>
      <Link
        to="/admin-butaca"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-shadow duration-200"
      >
        Administrar Butacas
      </Link>
      <Link
  to="/reservas-terror"
  className="inline-block bg-black text-white font-bold py-3 px-6 rounded-lg border-2 border-red-700 shadow-red-800 shadow-lg hover:bg-red-900 hover:text-white transition-all duration-300 tracking-wider"
>
  Reservas de Películas de Terror
</Link>

    </nav>
  </div>
);

const App = (): JSX.Element => {
  return (
    <Router>
      {/* Your custom NavBar component rendered on every page */}
      <NavBar />

      <main className="mt-16"> {/* Add top margin so content clears the navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-butaca" element={<AdminButaca />} />
          <Route path="/admin-cartelera" element={<AdminCartelera />} />
          <Route path="/editar-cartelera/:id" element={<EditBillboard />} />
          <Route path="/formulario-agregar-cartelera" element={<FormularioAgregarCartelera />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/formulario-agregar-reserva" element={<ReservationForm />} />
          <Route path="/reservas-terror" element={<HorrorBookings />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
