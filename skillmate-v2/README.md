# SkillMate V2

A full-stack skill-sharing platform where users find learning partners based on complementary skills and chat in real time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Java Spring Boot 3.x |
| Database | PostgreSQL |
| Real-Time | WebSockets (STOMP over SockJS) |
| Auth | JWT (24h expiry) |

## Project Structure

```
skillmate-v2/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/skillmate/
│   │   ├── config/             # Security, JWT, WebSocket, CORS
│   │   ├── controller/         # REST controllers
│   │   ├── entity/             # JPA entities
│   │   ├── repository/         # Spring Data JPA repos
│   │   ├── service/            # Business logic
│   │   └── websocket/          # WebSocket handlers
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React application
│   └── src/
│       ├── api/                # Axios API functions
│       ├── contexts/           # AuthContext, SocketContext
│       ├── components/         # Navbar, UserCard, SkillBadge, etc.
│       ├── hooks/              # useNotifications
│       └── pages/              # All page components
└── schema.sql                  # PostgreSQL schema
```

## Setup Instructions

### 1. PostgreSQL Setup

```bash
psql -U postgres
CREATE DATABASE skillmate_v2;
\q
psql -U postgres -d skillmate_v2 -f schema.sql
```

### 2. Backend Setup

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillmate_v2
spring.datasource.username=postgres
spring.datasource.password=yeshika
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
server.port=8080
```

Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT

### Users (JWT required)
- `GET /api/users/me` — Get own profile
- `PUT /api/users/me` — Update profile
- `POST /api/users/me/avatar` — Update avatar URL
- `GET /api/users/{id}` — Get user by ID
- `GET /api/users/search?skill=` — Search by skill

### Skills (JWT required)
- `GET /api/skills` — Get my skills
- `POST /api/skills` — Add skill `{ skillName, skillType: "KNOWN"|"LEARNING" }`
- `DELETE /api/skills/{id}` — Delete skill

### Matches (JWT required)
- `GET /api/matches` — Get all my matches (auto-created by algorithm)

### Connections (JWT required)
- `POST /api/connections/request/{userId}` — Send connection request
- `PUT /api/connections/request/{id}/accept` — Accept request
- `PUT /api/connections/request/{id}/reject` — Reject request
- `GET /api/connections` — List accepted connections

### Chat (JWT required)
- `GET /api/chat/messages/{userId}` — Get chat history
- `POST /api/chat/messages` — Send message

### Notifications (JWT required)
- `GET /api/notifications` — Get all notifications + unread count
- `PUT /api/notifications/{id}/read` — Mark one as read
- `PUT /api/notifications/read-all` — Mark all as read

## WebSocket

- Endpoint: `http://localhost:8080/ws` (SockJS)
- Subscribe to messages: `/topic/messages/{myUserId}`
- Subscribe to notifications: `/topic/notifications/{myUserId}`
- Send message: `/app/chat.send`

## Matching Algorithm

Runs automatically when a user adds or removes a skill:

1. For each LEARNING skill of current user
2. Find users who have that skill as KNOWN
3. Check if those users have a LEARNING skill that current user has as KNOWN
4. If mutual → create a `skill_match` record
5. Notify both users via WebSocket

## Business Rules

1. Matches are **auto-created** by the system (mutual skill exchange only)
2. Users can only **chat** after connection request is **accepted**
3. Connection requests can only be sent to **matched** users
4. Passwords are **bcrypt hashed**
5. JWT tokens expire after **24 hours**

## Running Ports

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| Database | localhost:5432 |
