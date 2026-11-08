import { useState } from 'react';
import { Outlet } from 'react-router';

import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <Header onOpenMenu={() => setMenuOpen(true)} />

      <div className="layout-body">
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}