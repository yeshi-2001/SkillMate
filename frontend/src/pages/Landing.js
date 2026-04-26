import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 70 }} />,
      title: '1. Share Your Skills',
      description: 'Add skills you can teach and skills you want to learn',
      color: '#D8D365',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 70 }} />,
      title: '2. Get Matched',
      description: 'AI finds compatible learning partners based on your interests',
      color: '#E6F082',
    },
    {
      icon: <ChatIcon sx={{ fontSize: 70 }} />,
      title: '3. Connect & Learn',
      description: 'Chat in real-time and exchange knowledge freely',
      color: '#D8D365',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #605B51 0%, #4A4640 100%)',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#D8D365',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                boxShadow: '0 8px 32px rgba(216, 211, 101, 0.3)',
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 50, color: '#454040' }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: '#E6F082',
                fontWeight: 800,
                mb: 2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Welcome to SkillMate
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#E0E0E0',
                mb: 5,
                fontWeight: 400,
              }}
            >
              Share Skills, Learn Together - Completely Free
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: '18px',
                  fontWeight: 600,
                  borderColor: '#D8D365',
                  color: '#D8D365',
                  '&:hover': {
                    borderColor: '#E6F082',
                    backgroundColor: 'rgba(216, 211, 101, 0.1)',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: '#E6F082',
            fontWeight: 700,
            mb: 2,
          }}
        >
          How It Works
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: '#E0E0E0',
            mb: 6,
            fontSize: '18px',
          }}
        >
          Start your learning journey in three simple steps
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #605B51 0%, #4A4640 100%)',
                  border: '1px solid rgba(216, 211, 101, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ color: feature.color, mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#E6F082',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#E0E0E0',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #605B51 0%, #4A4640 100%)',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              color: '#E6F082',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Ready to Start Learning?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              mb: 4,
              fontSize: '18px',
            }}
          >
            Join our community of learners and teachers today
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
