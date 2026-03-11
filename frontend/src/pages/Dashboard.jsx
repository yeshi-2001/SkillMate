import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import SkillCard from '../components/SkillCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState({ teach: [], learn: [] });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, matchesRes] = await Promise.all([
        axiosInstance.get('/skills/user'),
        axiosInstance.get('/matches/find'),
      ]);
      setSkills(skillsRes.data.data);
      setMatches(matchesRes.data.data.matches.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user?.name?.charAt(0)}</div>
            )}
          </div>
          <div className="user-info">
            <h1>Welcome, {user?.name}!</h1>
            <p>📍 {user?.location || 'Location not set'}</p>
            <p>📧 {user?.email}</p>
          </div>
        </div>
        <Link to="/skills" className="btn-edit">Edit Skills</Link>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Skills I Teach ({skills.teach?.length || 0})</h2>
          {skills.teach?.length > 0 ? (
            skills.teach.map((skill) => (
              <SkillCard key={skill.id} skill={skill} type="teach" />
            ))
          ) : (
            <p className="empty-state">No teaching skills added yet</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Skills I Want to Learn ({skills.learn?.length || 0})</h2>
          {skills.learn?.length > 0 ? (
            skills.learn.map((skill) => (
              <SkillCard key={skill.id} skill={skill} type="learn" />
            ))
          ) : (
            <p className="empty-state">No learning skills added yet</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recommended Matches</h2>
          <Link to="/matches" className="view-all">View All →</Link>
        </div>
        {matches.length > 0 ? (
          <div className="matches-preview">
            {matches.map((match) => (
              <div key={match.id} className="match-preview-card">
                <div className="match-avatar-small">
                  {match.profile_image ? (
                    <img src={match.profile_image} alt={match.name} />
                  ) : (
                    <div className="avatar-placeholder-small">{match.name?.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <h4>{match.name}</h4>
                  <p>{match.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No matches found. Add more skills to find matches!</p>
        )}
      </div>

      <div className="quick-actions">
        <Link to="/skills" className="action-card">
          <span className="action-icon">📚</span>
          <h3>Manage Skills</h3>
          <p>Add or remove skills</p>
        </Link>
        <Link to="/matches" className="action-card">
          <span className="action-icon">🤝</span>
          <h3>Find Matches</h3>
          <p>Connect with learners</p>
        </Link>
        <Link to="/sessions" className="action-card">
          <span className="action-icon">📅</span>
          <h3>My Sessions</h3>
          <p>View scheduled sessions</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
