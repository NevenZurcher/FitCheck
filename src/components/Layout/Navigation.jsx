import { NavLink } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
    return (
        <nav className="bottom-nav">
            <NavLink to="/wardrobe" className="nav-item">
                <span className="nav-icon">👔</span>
                <span className="nav-label">Wardrobe</span>
            </NavLink>

            <NavLink to="/generate" className="nav-item">
                <span className="nav-icon">✨</span>
                <span className="nav-label">Generate</span>
            </NavLink>

            <NavLink to="/history" className="nav-item">
                <span className="nav-icon">📋</span>
                <span className="nav-label">History</span>
            </NavLink>
        </nav>
    );
}
