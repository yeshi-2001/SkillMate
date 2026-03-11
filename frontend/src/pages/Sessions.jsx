import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './Sessions.css';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    user2_id: '',
    date: '',
    time: '',
    skill: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get('/sessions/user');
      setSessions(response.data.data.sessions);
    } catch (err) {
      setError('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.user2_id || !formData.date || !formData.time || !formData.skill) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axiosInstance.post('/sessions/create', {
        ...formData,
        user2_id: parseInt(formData.user2_id),
      });
      setSuccess('Session scheduled successfully!');
      setFormData({ user2_id: '', date: '', time: '', skill: '' });
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="sessions-page">
      <div className="sessions-container">
        <h1>Learning Sessions</h1>

        <div className="create-session-section">
          <h2>Schedule New Session</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="session-form">
            <div className="form-row">
              <div className="form-group">
                <label>Partner User ID</label>
                <input
                  type="number"
                  value={formData.user2_id}
                  onChange={(e) => setFormData({ ...formData, user2_id: e.target.value })}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Skill</label>
                <input
                  type="text"
                  value={formData.skill}
                  onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                  placeholder="e.g., Python, Guitar"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="schedule-btn">Schedule Session</button>
          </form>
        </div>

        <div className="sessions-list-section">
          <h2>My Sessions ({sessions.length})</h2>
          {sessions.length > 0 ? (
            <div className="sessions-grid">
              {sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <span className="session-skill">📚 {session.skill}</span>
                    <span className="session-date">{formatDate(session.date)}</span>
                  </div>
                  <div className="session-details">
                    <p>🕐 Time: {session.time}</p>
                    <p>👤 With: {session.with_user.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No sessions scheduled yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
