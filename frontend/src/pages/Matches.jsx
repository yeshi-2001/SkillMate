import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MatchCard from '../components/MatchCard';
import './Matches.css';

const Matches = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [availableMatches, setAvailableMatches] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const [findRes, listRes] = await Promise.all([
        axiosInstance.get('/matches/find'),
        axiosInstance.get('/matches/list'),
      ]);
      setAvailableMatches(findRes.data.data.matches);
      setMyMatches(listRes.data.data.matches);
    } catch (err) {
      setError('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/matches/request', { user2_id: userId });
      setSuccess('Match request sent successfully!');
      fetchMatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleRespond = async (matchId, status) => {
    try {
      await axiosInstance.put('/matches/respond', { match_id: matchId, status });
      setSuccess(`Match request ${status}!`);
      fetchMatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to respond');
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
    <div className="matches-page">
      <div className="matches-container">
        <h1>Find Your Perfect Match</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'find' ? 'active' : ''}`}
            onClick={() => setActiveTab('find')}
          >
            Find Matches ({availableMatches.length})
          </button>
          <button
            className={`tab ${activeTab === 'my-matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-matches')}
          >
            My Matches ({myMatches.length})
          </button>
        </div>

        <div className="matches-content">
          {activeTab === 'find' ? (
            <div className="matches-list">
              {availableMatches.length > 0 ? (
                availableMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onRequest={handleSendRequest}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <p>No matches found. Add more skills to find compatible users!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="matches-list">
              {myMatches.length > 0 ? (
                myMatches.map((match) => (
                  <div key={match.id} className="match-item">
                    <MatchCard match={match.user} showActions={false} />
                    <div className="match-status-actions">
                      <span className={`status-badge ${match.status}`}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                      {match.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleRespond(match.id, 'accepted')}
                            className="btn-accept"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRespond(match.id, 'rejected')}
                            className="btn-reject"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No match requests yet. Start sending requests to connect!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;
