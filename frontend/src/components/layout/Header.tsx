import { Menu } from 'lucide-react';

export default function Header({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  return (
    <header className="site-header">
      <button
        type="button"
        className="mobile-menu"
        aria-label="Open menu"
        onClick={onOpenMenu}
      >
        <Menu size={22} />
      </button>

      <h1>G-Scores</h1>
      <span className="header-year">THPT 2024</span>
    </header>
  );
}