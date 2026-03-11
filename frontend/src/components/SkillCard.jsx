import './SkillCard.css';

const SkillCard = ({ skill, type, onDelete }) => {
  return (
    <div className={`skill-card ${type}`}>
      <div className="skill-info">
        <span className="skill-name">{skill.skill_name}</span>
        <span className="skill-type">{type === 'teach' ? '📚 Teaching' : '🎓 Learning'}</span>
      </div>
      {onDelete && (
        <button onClick={() => onDelete(skill.id)} className="delete-btn">
          ✕
        </button>
      )}
    </div>
  );
};

export default SkillCard;
