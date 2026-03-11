# SkillMate Backend API

A production-ready REST API for SkillMate - a skill exchange platform where users can teach and learn skills from each other.

## Tech Stack

- Python 3.10+
- Flask (REST API)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Flask-Bcrypt (Password Hashing)
- Flask-CORS (Cross-Origin Support)

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL=postgresql://username:password@localhost:5432/skillmate_db
JWT_SECRET_KEY=your-secret-key-here-change-in-production
FLASK_ENV=development
FLASK_APP=app.py
```

### 3. Create PostgreSQL Database

```bash
createdb skillmate_db
```

### 4. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login and get JWT token
- `POST /api/logout` - Logout (invalidate token)

### User Profile

- `GET /api/user/profile` - Get logged-in user profile (JWT required)
- `PUT /api/user/profile/update` - Update user profile (JWT required)

### Skills Management

- `POST /api/skills/add` - Add skill to teach/learn (JWT required)
- `GET /api/skills/user` - Get user's skills (JWT required)
- `DELETE /api/skills/remove` - Remove skill (JWT required)

### Matching System

- `GET /api/matches/find` - Find compatible users (JWT required)
- `POST /api/matches/request` - Send match request (JWT required)
- `GET /api/matches/list` - List all matches (JWT required)
- `PUT /api/matches/respond` - Accept/reject match (JWT required)

### Messaging

- `POST /api/messages/send` - Send message to matched user (JWT required)
- `GET /api/messages/history?user_id=<id>` - Get chat history (JWT required)

### Sessions

- `POST /api/sessions/create` - Schedule learning session (JWT required)
- `GET /api/sessions/user` - Get user's sessions (JWT required)

### Ratings

- `POST /api/ratings/add` - Submit rating for user (JWT required)
- `GET /api/ratings/user?user_id=<id>` - Get user ratings

## Request/Response Format

All responses follow this structure:

```json
{
  "status": "success|error",
  "message": "Description",
  "data": {}
}
```

## Security Features

- Password hashing with Bcrypt
- JWT-based authentication
- Token blacklist for logout
- Input validation on all endpoints
- Protected routes (JWT required)
- Environment-based configuration

## Database Schema

- **Users**: User accounts and profiles
- **Skills**: Available skills catalog
- **UserSkills**: User's teach/learn skills
- **Matches**: Match requests between users
- **Messages**: Chat messages
- **Sessions**: Scheduled learning sessions
- **Ratings**: User ratings and reviews
