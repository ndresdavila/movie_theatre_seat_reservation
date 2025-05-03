import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/admin-cartelera', label: 'Cartelera' },
  { to: '/reservations', label: 'Reservas' },
  { to: '/admin-butaca', label: 'Butacas' },
  { to: '/reservas-terror', label: 'Reservas de Pelícluas de Terror' },
];

export default function NavBar() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-600">🎬 Reserva Butacas de Cine</div>
        <ul className="flex space-x-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `text-gray-700 hover:text-indigo-600 transition-colors ${
                    isActive ? 'font-semibold border-b-2 border-indigo-600' : ''
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
