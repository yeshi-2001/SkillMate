import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { connectionService, matchService } from '../services/api';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ connections: 0, requests: 0, matches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !user.userId) return;
      
      try {
        const [connectionsRes, requestsRes, matchesRes] = await Promise.all([
          connectionService.getUserConnections(user.userId),
          connectionService.getPendingRequests(user.userId),
          matchService.findMatches(user.userId),
        ]);
        setStats({
          connections: connectionsRes.data.length,
          requests: requestsRes.data.length,
          matches: matchesRes.data.length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const statCards = [
    { title: 'Active Connections', value: stats.connections, icon: <PeopleIcon sx={{ fontSize: 50 }} />, color: '#D8D365', path: '/connections' },
    { title: 'Pending Requests', value: stats.requests, icon: <NotificationsIcon sx={{ fontSize: 50 }} />, color: '#E6F082', path: '/connections' },
    { title: 'Suggested Matches', value: stats.matches, icon: <PersonSearchIcon sx={{ fontSize: 50 }} />, color: '#D8D365', path: '/matches' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#E6F082', fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
            Here's what's happening with your learning journey today.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#D8D365' }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {statCards.map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      background: 'rgba(96, 91, 81, 0.95)',
                      border: '1px solid rgba(216, 211, 101, 0.3)',
                      backdropFilter: 'blur(5px)',
                    }}
                    onClick={() => navigate(stat.path)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ color: stat.color, mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ mb: 4, background: 'rgba(96, 91, 81, 0.95)', backdropFilter: 'blur(5px)', border: '1px solid rgba(216, 211, 101, 0.3)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 30, color: '#D8D365', mr: 2 }} />
                  <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/skills')}
                      sx={{ py: 1.5 }}
                    >
                      Manage Skills
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/matches')}
                      sx={{ py: 1.5 }}
                    >
                      Find Partners
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/connections')}
                      sx={{ py: 1.5 }}
                    >
                      View Requests
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/chat')}
                      sx={{ py: 1.5 }}
                    >
                      Open Chat
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
  );
};

export default Dashboard;
