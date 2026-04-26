import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, IconButton, Tabs, Tab, Chip, CircularProgress, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useAuth } from '../context/AuthContext';
import { skillService } from '../services/api';

const Skills = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ 
    skillName: '', 
    category: '',
    proficiencyLevel: '', 
    description: '' 
  });

  const categories = [
    'Technology & Programming',
    'Languages',
    'Arts & Crafts',
    'Music',
    'Business & Finance',
    'Health & Fitness',
    'Cooking',
    'Other'
  ];

  const proficiencyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  useEffect(() => {
    if (user && user.userId) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    if (!user || !user.userId) {
      console.log('User not loaded yet');
      return;
    }
    
    try {
      const [teach, learn] = await Promise.all([
        skillService.getUserTeachSkills(user.userId),
        skillService.getUserLearnSkills(user.userId),
      ]);
      setTeachSkills(teach.data);
      setLearnSkills(learn.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!user || !user.userId) {
      alert('Please login first');
      return;
    }
    
    try {
      const skillData = {
        skillName: newSkill.skillName,
        category: newSkill.category,
        proficiencyLevel: newSkill.proficiencyLevel,
        description: newSkill.description
      };

      if (tab === 0) {
        await skillService.addTeachSkill(user.userId, skillData);
      } else {
        await skillService.addLearnSkill(user.userId, skillData);
      }
      
      fetchSkills();
      setOpen(false);
      setNewSkill({ skillName: '', category: '', proficiencyLevel: '', description: '' });
    } catch (err) {
      console.error('Error adding skill:', err);
      alert('Failed to add skill: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      if (tab === 0) {
        await skillService.deleteTeachSkill(id);
      } else {
        await skillService.deleteLearnSkill(id);
      }
      fetchSkills();
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const currentSkills = tab === 0 ? teachSkills : learnSkills;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#E6F082', fontWeight: 700, mb: 1 }}>
          My Skills
        </Typography>
        <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
          Manage the skills you can teach and want to learn
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
          <Tab icon={<SchoolIcon />} iconPosition="start" label="I Can Teach" />
          <Tab icon={<MenuBookIcon />} iconPosition="start" label="I Want to Learn" />
        </Tabs>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        Add New Skill
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#D8D365' }} />
        </Box>
      ) : currentSkills.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#E0E0E0', mb: 2 }}>
              No skills added yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
              Click "Add New Skill" to get started
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {currentSkills.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: '#E6F082', mb: 1 }}>
                      {item.skill?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      {item.skill?.category && (
                        <Chip
                          label={item.skill.category}
                          size="small"
                          sx={{ backgroundColor: '#7A7570', color: '#FFFFFF' }}
                        />
                      )}
                      <Chip
                        label={item.proficiencyLevel || item.desiredLevel}
                        size="small"
                        sx={{ backgroundColor: '#D8D365', color: '#454040' }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#E0E0E0', mt: 1 }}>
                      {item.description || item.goals}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    sx={{ color: '#ff6b6b', '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#605B51', color: '#E6F082' }}>
          Add {tab === 0 ? 'Teaching' : 'Learning'} Skill
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#605B51', pt: 3 }}>
          <TextField
            fullWidth
            label="Skill Name"
            value={newSkill.skillName}
            onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
            margin="normal"
            placeholder="e.g., Python Programming, Guitar, Spanish"
            required
            autoFocus
          />
          <TextField
            select
            fullWidth
            label="Category"
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            margin="normal"
            required
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label={tab === 0 ? 'Proficiency Level' : 'Desired Level'}
            value={newSkill.proficiencyLevel}
            onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
            margin="normal"
            required
          >
            <MenuItem value="">Select a level</MenuItem>
            {proficiencyLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newSkill.description}
            onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            margin="normal"
            placeholder={tab === 0 ? "Describe your experience and what you can teach" : "Describe what you want to learn and your goals"}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#605B51', p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#E0E0E0' }}>Cancel</Button>
          <Button 
            onClick={handleAddSkill} 
            variant="contained"
            disabled={!newSkill.skillName || !newSkill.category || !newSkill.proficiencyLevel}
          >
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Skills;
