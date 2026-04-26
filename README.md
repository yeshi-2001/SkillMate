# SkillMate - Free Skill Sharing Platform

A web-based platform that connects people who want to teach skills with those who want to learn them. Features AI-powered matching and real-time chat for collaborative learning.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Skill Management**: Add skills you can teach and want to learn
- **AI-Powered Matching**: Find compatible learning partners using intelligent algorithms
- **Connection System**: Send and accept connection requests
- **Real-Time Chat**: WebSocket-based instant messaging between connected users
- **Responsive Design**: Mobile-friendly Material-UI interface

## Tech Stack

### Backend
- Spring Boot 3.2.0
- Java 17
- PostgreSQL
- Spring Security with JWT
- Spring WebSocket (STOMP)
- Spring Data JPA

### Frontend
- React 18
- Material-UI
- React Router
- Axios
- SockJS + STOMP for WebSocket

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 15 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE skillmate;
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillmate
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. (Optional) Add your Gemini API key for AI matching:
```properties
gemini.api.key=your-gemini-api-key
```

4. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. **Register**: Create a new account at `/register`
2. **Add Skills**: Navigate to "My Skills" and add skills you can teach and want to learn
3. **Find Matches**: Go to "Find Matches" to see AI-suggested learning partners
4. **Connect**: Send connection requests to potential partners
5. **Accept Requests**: Check "Connections" for pending requests
6. **Chat**: Once connected, use the real-time chat to communicate

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `POST /api/skills/teach/{userId}` - Add teaching skill
- `POST /api/skills/learn/{userId}` - Add learning skill
- `GET /api/skills/teach/{userId}` - Get user's teaching skills
- `GET /api/skills/learn/{userId}` - Get user's learning skills

### Matching
- `GET /api/matches/{userId}` - Get AI-matched users

### Connections
- `POST /api/connections/request` - Send connection request
- `POST /api/connections/accept/{requestId}` - Accept request
- `POST /api/connections/reject/{requestId}` - Reject request
- `GET /api/connections/{userId}` - Get user connections

### Messages
- `GET /api/messages/{connectionId}` - Get chat messages
- WebSocket endpoint: `/ws` (STOMP)

## Project Structure

```
skill_share/
├── backend/
│   ├── src/main/java/com/skillmate/
│   │   ├── config/          # Security, CORS, WebSocket config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # JWT and authentication
│   │   └── service/         # Business logic
│   └── pom.xml
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # React context (Auth)
    │   ├── pages/           # Page components
    │   └── services/        # API and WebSocket services
    └── package.json
```

## Future Enhancements

- Rating and review system
- Video/audio calls
- Skill verification badges
- Group learning sessions
- Mobile app
- Advanced AI matching with Gemini API

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
