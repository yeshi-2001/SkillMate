import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, Chip, Box, LinearProgress, CircularProgress, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { matchService, connectionService } from '../services/api';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user || !user.userId) return;
      
      try {
        const response = await matchService.findMatches(user.userId);
        setMatches(response.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [user]);

  const handleConnect = async (matchUserId) => {
    try {
      await connectionService.sendRequest({
        senderId: user.userId,
        receiverId: matchUserId,
        message: 'Hi! I would like to connect and learn together.',
      });
      setSentRequests(new Set([...sentRequests, matchUserId]));
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <PersonSearchIcon sx={{ fontSize: 40, color: '#D8D365', mr: 2 }} />
          <Typography variant="h4" sx={{ color: '#E6F082', fontWeight: 700 }}>
            Find Learning Partners
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
          AI-powered matches based on your skills and interests
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#D8D365' }} />
        </Box>
      ) : matches.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <PersonSearchIcon sx={{ fontSize: 80, color: '#7A7570', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#E0E0E0', mb: 2 }}>
              No matches found yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 3 }}>
              Add more skills to find compatible learning partners
            </Typography>
            <Button variant="contained" href="/skills">
              Add Skills
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {matches.map((match) => {
            const isRequested = sentRequests.has(match.userId);
            return (
              <Grid item xs={12} md={6} key={match.userId}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #605B51 0%, #4A4640 100%)',
                    border: '1px solid rgba(216, 211, 101, 0.1)',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                        {match.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                          {match.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                          {match.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${match.matchScore}% Match`}
                        sx={{
                          backgroundColor: match.matchScore >= 70 ? '#D8D365' : '#7A7570',
                          color: '#454040',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#B0B0B0', mb: 1, display: 'block' }}>
                        Match Score
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={match.matchScore}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#454040',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: match.matchScore >= 70 ? '#D8D365' : '#7A7570',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    {match.bio && (
                      <Typography variant="body2" sx={{ color: '#E0E0E0', mb: 2 }}>
                        {match.bio}
                      </Typography>
                    )}

                    {match.matchingSkills && match.matchingSkills.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#D8D365', mb: 1 }}>
                          Matching Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {match.matchingSkills.map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              sx={{ backgroundColor: '#454040', color: '#E6F082' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {isRequested ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        disabled
                        startIcon={<CheckCircleIcon />}
                        sx={{ borderColor: '#D8D365', color: '#D8D365' }}
                      >
                        Request Sent
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ConnectWithoutContactIcon />}
                        onClick={() => handleConnect(match.userId)}
                      >
                        Connect
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Matches;
