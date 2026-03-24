-- SkillMate V2 Database Schema
-- Run this in PostgreSQL before starting the application

CREATE DATABASE skillmate_v2;
\c skillmate_v2;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_skills (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    skill_type VARCHAR(10) NOT NULL CHECK (skill_type IN ('KNOWN', 'LEARNING')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skill_matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

CREATE TABLE connection_requests (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_user_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_name ON user_skills(skill_name);
CREATE INDEX idx_skill_matches_users ON skill_matches(user1_id, user2_id);
CREATE INDEX idx_chat_messages_users ON chat_messages(sender_id, receiver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
