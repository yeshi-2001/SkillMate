import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Paper, Typography, Avatar, IconButton, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { connectionService, messageService } from '../services/api';
import websocketService from '../services/websocket';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';

const Chat = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user || !user.userId) return;
    
    const fetchConnections = async () => {
      try {
        const response = await connectionService.getUserConnections(user.userId);
        setConnections(response.data);
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };
    
    fetchConnections();
    websocketService.connect(user.userId, handleNewMessage);
    return () => websocketService.disconnect();
  }, [user]);

  const handleSelectConnection = async (connection) => {
    setSelectedConnection(connection);
    try {
      const response = await messageService.getMessages(connection.id);
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleNewMessage = (message) => {
    if (message.connectionId === selectedConnection?.id) {
      setMessages((prev) => [...prev, message]);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConnection) return;
    
    const partner = selectedConnection.user1.id === user.userId ? selectedConnection.user2 : selectedConnection.user1;
    
    const message = {
      senderId: user.userId,
      receiverId: partner.id,
      connectionId: selectedConnection.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    websocketService.sendMessage(message);
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const selectedPartner = selectedConnection
    ? selectedConnection.user1.id === user.userId
      ? selectedConnection.user2
      : selectedConnection.user1
    : null;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', height: '80vh', gap: 2 }}>
        {/* Conversations List */}
        <Paper
          sx={{
            width: '30%',
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#605B51',
            borderRadius: '15px',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, backgroundColor: '#4A4640' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ChatIcon sx={{ fontSize: 30, color: '#D8D365', mr: 2 }} />
              <Typography variant="h5" sx={{ color: '#E6F082', fontWeight: 600 }}>
                Chats
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
              {connections.length} conversation{connections.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(216, 211, 101, 0.1)' }} />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {connections.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 60, color: '#7A7570', mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                  No conversations yet
                </Typography>
              </Box>
            ) : (
              connections.map((conn) => {
                const partner = conn.user1.id === user.userId ? conn.user2 : conn.user1;
                const isSelected = selectedConnection?.id === conn.id;
                return (
                  <Box
                    key={conn.id}
                    onClick={() => handleSelectConnection(conn)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#4A4640' : 'transparent',
                      borderLeft: isSelected ? '4px solid #D8D365' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#4A4640',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 45,
                          height: 45,
                          backgroundColor: isSelected ? '#D8D365' : '#7A7570',
                          color: '#454040',
                          fontWeight: 700,
                          mr: 2,
                        }}
                      >
                        {partner.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: isSelected ? '#E6F082' : '#FFFFFF',
                            fontWeight: isSelected ? 600 : 400,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {partner.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#B0B0B0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {partner.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Paper>

        {/* Chat Window */}
        <Paper
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#605B51',
            borderRadius: '15px',
            overflow: 'hidden',
          }}
        >
          {selectedConnection ? (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2.5, backgroundColor: '#4A4640', display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 45,
                    height: 45,
                    backgroundColor: '#D8D365',
                    color: '#454040',
                    fontWeight: 700,
                    mr: 2,
                  }}
                >
                  {selectedPartner?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#E6F082', fontWeight: 600 }}>
                    {selectedPartner?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                    {selectedPartner?.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: 'rgba(216, 211, 101, 0.1)' }} />

              {/* Messages Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 3,
                  backgroundColor: '#454040',
                  backgroundImage: 'linear-gradient(rgba(96, 91, 81, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 91, 81, 0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <ChatIcon sx={{ fontSize: 60, color: '#7A7570', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg, idx) => {
                    const isSent = msg.senderId === user.userId || msg.sender?.id === user.userId;
                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          justifyContent: isSent ? 'flex-start' : 'flex-end',
                          mb: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '70%',
                            p: 1.5,
                            borderRadius: '12px',
                            backgroundColor: isSent ? '#605B51' : '#D8D365',
                            color: isSent ? '#FFFFFF' : '#454040',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {msg.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              textAlign: 'right',
                              color: isSent ? '#B0B0B0' : '#454040',
                              opacity: 0.7,
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, backgroundColor: '#4A4640' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    multiline
                    maxRows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#605B51',
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      minWidth: 56,
                      height: 56,
                      borderRadius: '12px',
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <ChatIcon sx={{ fontSize: 100, color: '#7A7570', mb: 3 }} />
              <Typography variant="h5" sx={{ color: '#E0E0E0', mb: 1 }}>
                Select a conversation
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                Choose a connection from the list to start chatting
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Chat;
