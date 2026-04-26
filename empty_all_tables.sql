-- Empty all tables in skillmate_db database
-- This will delete all data but keep table structures
-- Auto-increment IDs will restart from 1

TRUNCATE TABLE 
    messages,
    notifications,
    connection_requests,
    connections,
    user_skills_teach,
    user_skills_learn,
    users,
    skills
RESTART IDENTITY CASCADE;

-- Verify all tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'skills', COUNT(*) FROM skills
UNION ALL
SELECT 'user_skills_teach', COUNT(*) FROM user_skills_teach
UNION ALL
SELECT 'user_skills_learn', COUNT(*) FROM user_skills_learn
UNION ALL
SELECT 'connections', COUNT(*) FROM connections
UNION ALL
SELECT 'connection_requests', COUNT(*) FROM connection_requests
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
