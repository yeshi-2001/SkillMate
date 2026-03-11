import { useNavigate } from 'react-router-dom';
import './MatchCard.css';

const MatchCard = ({ match, onRequest, showActions = true }) => {
  const navigate = useNavigate();

  return (
    <div className="match-card">
      <div className="match-avatar">
        {match.profile_image ? (
          <img src={match.profile_image} alt={match.name} />
        ) : (
          <div className="avatar-placeholder">{match.name?.charAt(0)}</div>
        )}
      </div>
      
      <div className="match-info">
        <h3>{match.name}</h3>
        <p className="match-location">📍 {match.location || 'Location not set'}</p>
        {match.status && (
          <span className={`match-status ${match.status}`}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </span>
        )}
      </div>
      
      {showActions && (
        <div className="match-actions">
          {match.status === 'accepted' ? (
            <button 
              onClick={() => navigate(`/chat/${match.id}`)} 
              className="btn-chat"
            >
              💬 Chat
            </button>
          ) : !match.status ? (
            <button 
              onClick={() => onRequest(match.id)} 
              className="btn-request"
            >
              🤝 Send Request
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
