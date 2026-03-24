import { useNavigate } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ user, actions }) => {
  const navigate = useNavigate();

  return (
    <div className="user-card card">
      <div className="user-card-header" onClick={() => navigate(`/profile/${user.id}`)}>
        {user.avatarUrl
          ? <img src={user.avatarUrl} alt={user.username} className="user-card-avatar" />
          : <div className="user-card-avatar avatar-placeholder">{user.username?.[0]?.toUpperCase()}</div>
        }
        <div>
          <h3>{user.fullName || user.username}</h3>
          <p className="text-muted">@{user.username}</p>
          {user.isOnline && <span className="online-dot">● Online</span>}
        </div>
      </div>
      {user.bio && <p className="user-card-bio">{user.bio}</p>}
      {actions && <div className="user-card-actions">{actions}</div>}
    </div>
  );
};

export default UserCard;
