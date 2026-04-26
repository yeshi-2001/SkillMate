import React from 'react';
import { Box, Button, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'My Skills', path: '/skills', icon: <SchoolIcon /> },
    { label: 'Find Matches', path: '/matches', icon: <PeopleIcon /> },
    { label: 'Connections', path: '/connections', icon: <ConnectWithoutContactIcon /> },
    { label: 'Chats', path: '/chat', icon: <ChatIcon /> },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          backgroundColor: '#454040',
          borderRadius: '50px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#D8D365',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1,
          }}
        >
          <AutoStoriesIcon sx={{ color: '#454040' }} />
        </Box>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                color: isActive ? '#454040' : '#fff',
                backgroundColor: isActive ? '#E6F082' : 'transparent',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D8D365',
                  color: '#454040',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            color: '#fff',
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 500,
            padding: '8px 18px',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            ml: 1,
            '&:hover': {
              backgroundColor: '#D8D365',
              color: '#454040',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
