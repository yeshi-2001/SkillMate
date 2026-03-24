import { useState, useEffect } from 'react';
import { getSkills, addSkill, deleteSkill, updateMe, updateAvatar } from '../api';
import { useAuth } from '../contexts/AuthContext';
import SkillBadge from '../components/SkillBadge';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skillName: '', skillType: 'KNOWN' });
  const [editForm, setEditForm] = useState({ fullName: user?.fullName || '', bio: user?.bio || '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSkills().then(res => setSkills(res.data)).finally(() => setLoading(false));
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skillName.trim()) return;
    try {
      const res = await addSkill(newSkill);
      setSkills(prev => [...prev, res.data]);
      setNewSkill({ skillName: '', skillType: 'KNOWN' });
      toast.success('Skill added! Matching algorithm running...');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      toast.success('Skill removed');
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMe(editForm);
      setUser(prev => ({ ...prev, ...res.data }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    const url = e.target.avatarUrl.value;
    try {
      const res = await updateAvatar(url);
      setUser(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  };

  const knownSkills = skills.filter(s => s.skillType === 'KNOWN');
  const learningSkills = skills.filter(s => s.skillType === 'LEARNING');

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: '1.5rem' }}>My Profile</h1>

        <div className="profile-grid">
          {/* Left: Profile Info */}
          <div>
            <div className="card profile-card">
              <div className="profile-avatar-section">
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.username} className="profile-avatar" />
                  : <div className="profile-avatar avatar-placeholder">{user?.username?.[0]?.toUpperCase()}</div>
                }
                <div>
                  <h2>{user?.fullName || user?.username}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>@{user?.username}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={editForm.fullName}
                    onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea rows={3} value={editForm.bio}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell others about yourself..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>

              <form onSubmit={handleAvatarUpdate} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Avatar URL</label>
                  <input name="avatarUrl" defaultValue={user?.avatarUrl || ''} placeholder="https://..." />
                </div>
                <button type="submit" className="btn btn-outline btn-sm">Update Avatar</button>
              </form>
            </div>
          </div>

          {/* Right: Skills */}
          <div>
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Add Skill</h3>
              <form onSubmit={handleAddSkill} className="add-skill-form">
                <input
                  placeholder="Skill name (e.g. Python, Guitar)"
                  value={newSkill.skillName}
                  onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
                  required
                />
                <select value={newSkill.skillType}
                  onChange={e => setNewSkill({ ...newSkill, skillType: e.target.value })}>
                  <option value="KNOWN">I Know This ✓</option>
                  <option value="LEARNING">I Want to Learn 📖</option>
                </select>
                <button type="submit" className="btn btn-primary">Add</button>
              </form>
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3>Skills I Know ({knownSkills.length})</h3>
              {knownSkills.length === 0
                ? <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No skills added yet</p>
                : <div className="skills-grid">
                    {knownSkills.map(s => (
                      <div key={s.id} className="skill-item">
                        <SkillBadge skill={s} />
                        <button className="skill-delete" onClick={() => handleDeleteSkill(s.id)}>✕</button>
                      </div>
                    ))}
                  </div>
              }
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3>Skills I'm Learning ({learningSkills.length})</h3>
              {learningSkills.length === 0
                ? <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No learning goals added yet</p>
                : <div className="skills-grid">
                    {learningSkills.map(s => (
                      <div key={s.id} className="skill-item">
                        <SkillBadge skill={s} />
                        <button className="skill-delete" onClick={() => handleDeleteSkill(s.id)}>✕</button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
