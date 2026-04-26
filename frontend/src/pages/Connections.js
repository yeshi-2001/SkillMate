import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Tabs, Tab, Card, CardContent, Avatar, Chip, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { connectionService } from '../services/api';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Connections = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.userId) return;
      
      try {
        const [conn, req] = await Promise.all([
          connectionService.getUserConnections(user.userId),
          connectionService.getPendingRequests(user.userId),
        ]);
        setConnections(conn.data);
        setRequests(req.data);
      } catch (err) {
        console.error('Error fetching connections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAccept = async (requestId) => {
    if (!user || !user.userId) return;
    try {
      await connectionService.acceptRequest(requestId);
      const [conn, req] = await Promise.all([
        connectionService.getUserConnections(user.userId),
        connectionService.getPendingRequests(user.userId),
      ]);
      setConnections(conn.data);
      setRequests(req.data);
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleReject = async (requestId) => {
    if (!user || !user.userId) return;
    try {
      await connectionService.rejectRequest(requestId);
      const [conn, req] = await Promise.all([
        connectionService.getUserConnections(user.userId),
        connectionService.getPendingRequests(user.userId),
      ]);
      setConnections(conn.data);
      setRequests(req.data);
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <PeopleIcon sx={{ fontSize: 40, color: '#D8D365', mr: 2 }} />
          <Typography variant="h4" sx={{ color: '#E6F082', fontWeight: 700 }}>
            My Connections
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
          Manage your learning partnerships and connection requests
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'rgba(216, 211, 101, 0.2)', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': {
              color: '#E0E0E0',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#E6F082 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#D8D365',
              height: 3,
            },
          }}
        >
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Active Connections" />
          <Tab
            icon={<NotificationsActiveIcon />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Pending Requests
                {requests.length > 0 && (
                  <Chip
                    label={requests.length}
                    size="small"
                    sx={{ backgroundColor: '#D8D365', color: '#454040', height: 20, minWidth: 20 }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#D8D365' }} />
        </Box>
      ) : tab === 0 ? (
        connections.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <PeopleIcon sx={{ fontSize: 80, color: '#7A7570', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#E0E0E0', mb: 2 }}>
                No active connections yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 3 }}>
                Find matches and send connection requests to start learning
              </Typography>
              <Button variant="contained" href="/matches">
                Find Matches
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {connections.map((conn) => {
              const partner = conn.user1.id === user.userId ? conn.user2 : conn.user1;
              return (
                <Card key={conn.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            backgroundColor: '#D8D365',
                            color: '#454040',
                            fontWeight: 700,
                            mr: 2,
                          }}
                        >
                          {partner.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                            {partner.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                            {partner.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<ChatIcon />}
                        href={`/chat?connectionId=${conn.id}`}
                      >
                        Open Chat
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )
      ) : requests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <NotificationsActiveIcon sx={{ fontSize: 80, color: '#7A7570', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#E0E0E0', mb: 1 }}>
              No pending requests
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
              You're all caught up!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: '#D8D365',
                      color: '#454040',
                      fontWeight: 700,
                      mr: 2,
                    }}
                  >
                    {req.sender.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 0.5 }}>
                      {req.sender.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 1 }}>
                      {req.sender.email}
                    </Typography>
                    {req.message && (
                      <Typography variant="body2" sx={{ color: '#E0E0E0', fontStyle: 'italic' }}>
                        "{req.message}"
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleAccept(req.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReject(req.id)}
                    sx={{
                      borderColor: '#7A7570',
                      color: '#E0E0E0',
                      '&:hover': {
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    Decline
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Connections;
