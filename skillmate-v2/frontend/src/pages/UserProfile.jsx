import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, sendConnectionRequest } from '../api';
import SkillBadge from '../components/SkillBadge';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(id).then(res => setProfile(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(id);
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!profile) return <div className="empty-state"><p>User not found</p></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt={profile.username} style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid var(--primary)', objectFit: 'cover' }} />
              : <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--primary)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                  {profile.username?.[0]?.toUpperCase()}
                </div>
            }
            <div>
              <h1>{profile.fullName || profile.username}</h1>
              <p style={{ color: 'var(--text-muted)' }}>@{profile.username}</p>
              {profile.isOnline && <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>● Online</span>}
            </div>
          </div>

          {profile.bio && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{profile.bio}</p>}

          {profile.skills && profile.skills.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.map(s => <SkillBadge key={s.id} skill={s} />)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleConnect}>🤝 Connect</button>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
