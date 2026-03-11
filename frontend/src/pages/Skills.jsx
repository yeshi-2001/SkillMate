import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import SkillCard from '../components/SkillCard';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState({ teach: [], learn: [] });
  const [formData, setFormData] = useState({ skill_name: '', type: 'teach' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axiosInstance.get('/skills/user');
      setSkills(response.data.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.skill_name.trim()) {
      setError('Please enter a skill name');
      return;
    }

    try {
      await axiosInstance.post('/skills/add', formData);
      setSuccess('Skill added successfully!');
      setFormData({ skill_name: '', type: 'teach' });
      fetchSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;

    try {
      await axiosInstance.delete('/skills/remove', { data: { id: skillId } });
      setSuccess('Skill removed successfully!');
      fetchSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove skill');
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
    <div className="skills-page">
      <div className="skills-container">
        <h1>Manage Your Skills</h1>

        <div className="add-skill-section">
          <h2>Add New Skill</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="skill-form">
            <input
              type="text"
              placeholder="Enter skill name (e.g., Python, Guitar, Spanish)"
              value={formData.skill_name}
              onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
              className="skill-input"
            />
            
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="teach"
                  checked={formData.type === 'teach'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <span>I can teach this</span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  value="learn"
                  checked={formData.type === 'learn'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <span>I want to learn this</span>
              </label>
            </div>

            <button type="submit" className="add-btn">Add Skill</button>
          </form>
        </div>

        <div className="skills-grid">
          <div className="skills-column">
            <h2>Skills I Teach ({skills.teach?.length || 0})</h2>
            {skills.teach?.length > 0 ? (
              skills.teach.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  type="teach"
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="empty-state">No teaching skills added yet</p>
            )}
          </div>

          <div className="skills-column">
            <h2>Skills I Want to Learn ({skills.learn?.length || 0})</h2>
            {skills.learn?.length > 0 ? (
              skills.learn.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  type="learn"
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="empty-state">No learning skills added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
