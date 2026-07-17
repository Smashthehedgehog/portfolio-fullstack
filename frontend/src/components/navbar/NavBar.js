import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import navItems from '../../data/nav.json';
import NavItem from './NavItem';
import './NavBar.css';

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);
    const toggleMenu = () => setMenuOpen((open) => !open);

    return (
        <header className="site-navbar">
            <div className="site-navbar-accent-stripe"></div>
            <div className="site-navbar-inner d-flex align-items-center justify-content-between">
                <NavLink to="/" className="brand headline-4-large no-decoration" onClick={closeMenu}>
                    MA
                </NavLink>

                <nav className={`site-navbar-links ${menuOpen ? 'open' : ''}`} aria-label="Primary">
                    {navItems.map((item) => (
                        <NavItem key={item.path} item={item} onNavigate={closeMenu} />
                    ))}
                    <Link to="/contact" className="btn-cta no-decoration d-flex d-md-none mobile-cta" onClick={closeMenu}>
                        Contact Me!
                    </Link>
                </nav>

                <Link to="/contact" className="btn-cta no-decoration d-none d-md-flex">
                    Contact Me!
                </Link>

                <button
                    type="button"
                    className="site-navbar-toggle d-md-none"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    onClick={toggleMenu}
                >
                    <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                </button>
            </div>
        </header>
    );
}
