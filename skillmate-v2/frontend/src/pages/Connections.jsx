import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConnections, getMatches, sendConnectionRequest, acceptRequest, rejectRequest } from '../api';
import UserCard from '../components/UserCard';
import { toast } from 'react-toastify';

const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState('connections');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getConnections(), getMatches()])
      .then(([c, m]) => { setConnections(c.data); setMatches(m.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async (userId) => {
    try {
      await sendConnectionRequest(userId);
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: '1.5rem' }}>Connections</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {['connections', 'matches'].map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTab(t)}>
              {t === 'connections' ? `My Connections (${connections.length})` : `Skill Matches (${matches.length})`}
            </button>
          ))}
        </div>

        {tab === 'connections' && (
          connections.length === 0
            ? <div className="empty-state card"><p>No connections yet. Find matches and connect!</p></div>
            : <div className="grid-2">
                {connections.map(c => (
                  <UserCard key={c.id} user={c.user}
                    actions={
                      <button className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/chat/${c.user.id}`)}>
                        💬 Chat
                      </button>
                    }
                  />
                ))}
              </div>
        )}

        {tab === 'matches' && (
          matches.length === 0
            ? <div className="empty-state card"><p>No matches yet. Add skills to get matched!</p></div>
            : <div className="grid-2">
                {matches.map(m => (
                  <UserCard key={m.id} user={m.matchedUser}
                    actions={
                      <>
                        <span className={`badge badge-${m.status?.toLowerCase()}`}>{m.status}</span>
                        <button className="btn btn-outline btn-sm"
                          onClick={() => handleConnect(m.matchedUser.id)}>
                          Connect
                        </button>
                      </>
                    }
                  />
                ))}
              </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
