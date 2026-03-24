export const SkillBadge = ({ skill }) => (
  <span className={`badge badge-${skill.skillType?.toLowerCase()}`}>
    {skill.skillName}
    {skill.skillType === 'KNOWN' ? ' ✓' : ' 📖'}
  </span>
);

export default SkillBadge;
