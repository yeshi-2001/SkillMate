import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, getConnections, getSkills } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import UserCard from '../components/UserCard';
import SkillBadge from '../components/SkillBadge';
import { sendConnectionRequest } from '../api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotifications();
  const [matches, setMatches] = useState([]);
  const [connections, setConnections] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMatches(), getConnections(), getSkills()])
      .then(([m, c, s]) => {
        setMatches(m.data);
        setConnections(c.data);
        setSkills(s.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async (userId) => {
    try {
      await sendConnectionRequest(userId);
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-hero card">
          <div className="dashboard-welcome">
            <div className="dashboard-avatar">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.username} />
                : <div className="avatar-lg">{user.username?.[0]?.toUpperCase()}</div>
              }
            </div>
            <div>
              <h1>Welcome back, {user.fullName || user.username}!</h1>
              <p style={{ color: 'var(--text-muted)' }}>@{user.username}</p>
            </div>
          </div>
          <div className="dashboard-stats">
            <div className="stat-box">
              <span className="stat-num">{matches.length}</span>
              <span className="stat-label">Matches</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{connections.length}</span>
              <span className="stat-label">Connections</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{skills.length}</span>
              <span className="stat-label">Skills</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{unreadCount}</span>
              <span className="stat-label">Notifications</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div>
            <div className="section-header">
              <h2>Your Skills</h2>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>
                Manage
              </button>
            </div>
            {skills.length === 0
              ? <div className="empty-state card"><p>No skills added yet. <a href="/profile">Add skills</a> to find matches!</p></div>
              : <div className="card skills-list">
                  {skills.map(s => <SkillBadge key={s.id} skill={s} />)}
                </div>
            }

            <div className="section-header" style={{ marginTop: '2rem' }}>
              <h2>Recent Notifications</h2>
              <a href="/notifications">View all</a>
            </div>
            <div className="card">
              {notifications.slice(0, 3).length === 0
                ? <p style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                : notifications.slice(0, 3).map(n => (
                    <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                      <span>{n.message}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          <div>
            <div className="section-header">
              <h2>Skill Matches</h2>
              <span className="badge badge-active">{matches.length} found</span>
            </div>
            {matches.length === 0
              ? <div className="empty-state card"><p>No matches yet. Add more skills to get matched!</p></div>
              : matches.slice(0, 4).map(match => (
                  <UserCard
                    key={match.id}
                    user={match.matchedUser}
                    actions={
                      <button className="btn btn-primary btn-sm"
                        onClick={() => handleConnect(match.matchedUser.id)}>
                        Connect
                      </button>
                    }
                  />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
