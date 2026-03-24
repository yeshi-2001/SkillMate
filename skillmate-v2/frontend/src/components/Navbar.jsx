import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/dashboard" className="navbar-brand">
          SkillMate
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/profile" className={isActive('/profile')}>Profile</Link>
          <Link to="/connections" className={isActive('/connections')}>Connections</Link>
          <Link to="/search" className={isActive('/search')}>Search</Link>
        </div>

        <div className="navbar-right">
          <Link to="/notifications" className={`notif-btn ${isActive('/notifications')}`}>
            🔔
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </Link>
          <div className="navbar-user">
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt={user.username} className="avatar-sm" />
              : <div className="avatar-sm avatar-placeholder">{user.username?.[0]?.toUpperCase()}</div>
            }
            <span>{user.username}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
