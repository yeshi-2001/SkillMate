-- Remove duplicate connections between same users
-- This keeps only the oldest connection for each pair of users

WITH duplicates AS (
    SELECT 
        id,
        LEAST(user1_id, user2_id) as min_user,
        GREATEST(user1_id, user2_id) as max_user,
        ROW_NUMBER() OVER (
            PARTITION BY LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id) 
            ORDER BY created_at ASC
        ) as rn
    FROM connections
    WHERE status = 'ACCEPTED'
)
DELETE FROM connections
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Verify remaining connections
SELECT 
    c.id,
    u1.name as user1_name,
    u2.name as user2_name,
    c.created_at
FROM connections c
JOIN users u1 ON c.user1_id = u1.id
JOIN users u2 ON c.user2_id = u2.id
WHERE c.status = 'ACCEPTED'
ORDER BY c.created_at;
