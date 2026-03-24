import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Connections from './pages/Connections';
import Chat from './pages/Chat';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import './pages/Notifications.css';

const App = () => (
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
          <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={3000}
          toastStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>
);

export default App;
