# SkillMate Frontend

A modern React.js frontend for the SkillMate skill exchange platform.

## Tech Stack

- React 18+
- React Router DOM v6
- Axios
- Vite
- CSS3

## Features

- User authentication (Register/Login)
- Protected routes with JWT
- Skill management (Add/Remove skills to teach/learn)
- Smart matching algorithm
- Real-time chat interface
- Session scheduling
- Rating and review system
- Responsive design
- Modern UI with gradient themes

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

The default API URL is `http://localhost:5000/api`

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance with JWT
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SkillCard.jsx
│   │   ├── MatchCard.jsx
│   │   ├── ChatBubble.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Skills.jsx
│   │   ├── Matches.jsx
│   │   ├── Chat.jsx
│   │   ├── Sessions.jsx
│   │   └── Ratings.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

## Pages

- **/** - Home page with features
- **/register** - User registration
- **/login** - User login
- **/dashboard** - User dashboard (protected)
- **/skills** - Manage skills (protected)
- **/matches** - Find and view matches (protected)
- **/chat/:userId** - Chat with matched users (protected)
- **/sessions** - Schedule and view sessions (protected)
- **/ratings** - Submit and view ratings (protected)

## API Integration

All API calls are made through the Axios instance in `src/api/axios.js` which:
- Automatically attaches JWT token from localStorage
- Handles 401 errors by redirecting to login
- Uses base URL from environment variables

## Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically attached to all API requests
4. Protected routes check for valid token
5. Logout removes token and redirects to login
