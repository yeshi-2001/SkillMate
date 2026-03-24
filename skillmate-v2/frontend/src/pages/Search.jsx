import { useState } from 'react';
import { searchUsers, sendConnectionRequest } from '../api';
import UserCard from '../components/UserCard';
import { toast } from 'react-toastify';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchUsers(query);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await sendConnectionRequest(userId);
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: '1.5rem' }}>Search Users by Skill</h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by skill (e.g. Python, Guitar, Spanish...)"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        {searched && (
          results.length === 0
            ? <div className="empty-state card"><p>No users found with skill "{query}"</p></div>
            : <>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Found {results.length} user(s) with "{query}"
                </p>
                <div className="grid-3">
                  {results.map(u => (
                    <UserCard key={u.id} user={u}
                      actions={
                        <button className="btn btn-outline btn-sm" onClick={() => handleConnect(u.id)}>
                          Connect
                        </button>
                      }
                    />
                  ))}
                </div>
              </>
        )}
      </div>
    </div>
  );
};

export default Search;
