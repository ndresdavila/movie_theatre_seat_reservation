import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { JSX } from 'react';
import AdminButaca from './components/AdminButaca';
import AdminCartelera from './components/AdminCartelera';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import CustomerInfo from './components/CustomerInfo';
import FormularioAgregarCartelera from './components/FormularioAgregarCartelera';
import EditBillboard from './components/EditBillboard';


// Asumiendo que se pueda usar un mock o un estado para el cliente, ya que no hay un back-end configurado para cargar los datos.
const mockCustomer = {
  id: 1, // ID del cliente
  documentNumber: '1234567890', // Número de documento
  name: 'Juan',
  lastname: 'Pérez',
  age: 30,
  email: 'juan.perez@email.com',
  phoneNumber: '1234567890',
};


const Home = (): JSX.Element => (
  <div>
    <h1>Bienvenido a la Reserva de Cine</h1>
    <nav>
      <ul>
        <li><a href="/admin-butaca">Administrar Butacas</a></li>
        <li><a href="/admin-cartelera">Administrar Cartelera</a></li>
        <li><a href="/reservations">Administrar Reservas</a></li>
        <li><a href="/customer-info">Información Cliente</a></li>
      </ul>
    </nav>
  </div>
);

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-butaca" element={<AdminButaca />} />

        <Route path="/admin-cartelera" element={<AdminCartelera />} />
        <Route path="/editar-cartelera/:id" element={<EditBillboard />} />
        <Route path="/formulario-agregar-cartelera" element={<FormularioAgregarCartelera />} />

        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/formulario-agregar-reserva" element={<ReservationForm />} />
        <Route path="/customer-info" element={<CustomerInfo customer={mockCustomer} />} />
      </Routes>
    </Router>
  );
};

export default App;
