import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReservationProvider } from './context/ReservationContext';
import { ToastContainer } from 'react-toastify'; // Importa el ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ReservationProvider>
      <App />
      {/* Agrega el ToastContainer aquí */}
      <ToastContainer />
    </ReservationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
