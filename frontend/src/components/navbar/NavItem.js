import { NavLink } from 'react-router-dom';

export default function NavItem({ item, onNavigate }) {
    return (
        <NavLink
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) => `site-navbar-link headline-5-medium no-decoration ${isActive ? 'active' : ''}`}
        >
            {item.title}
        </NavLink>
    );
}
