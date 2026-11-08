import {
  BarChart3,
  LayoutDashboard,
  Search,
  Trophy,
  X,
} from 'lucide-react';

import { NavLink } from 'react-router';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/search', label: 'Search Scores', icon: Search },
  { to: '/statistics', label: 'Reports', icon: BarChart3 },
  { to: '/ranking', label: 'Top 10 group A ', icon: Trophy },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="menu-heading">
        <strong>Menu</strong>

        <button
          type="button"
          className="close-menu"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <nav aria-label="Điều hướng G-Scores">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}