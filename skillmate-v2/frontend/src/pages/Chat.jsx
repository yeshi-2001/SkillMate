import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatHistory, getUserById } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { sendMessage } from '../api';
import './Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { subscribe, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    Promise.all([getChatHistory(userId), getUserById(userId)])
      .then(([msgs, usr]) => {
        setMessages(msgs.data);
        setOtherUser(usr.data);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user || !connected) return;
    const unsub = subscribe(`/topic/messages/${user.id}`, (msg) => {
      if (String(msg.senderId) === String(userId)) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return unsub;
  }, [user, connected, subscribe, userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await sendMessage({ receiverId: parseInt(userId), content: input });
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="chat-page">
      <div className="chat-header card">
        {otherUser?.avatarUrl
          ? <img src={otherUser.avatarUrl} alt={otherUser.username} className="chat-avatar" />
          : <div className="chat-avatar avatar-placeholder">{otherUser?.username?.[0]?.toUpperCase()}</div>
        }
        <div>
          <h3>{otherUser?.fullName || otherUser?.username}</h3>
          <span className={`online-status ${otherUser?.isOnline ? 'online' : 'offline'}`}>
            {otherUser?.isOnline ? '● Online' : '○ Offline'}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0
          ? <div className="empty-state"><p>No messages yet. Say hello! 👋</p></div>
          : messages.map((msg, i) => (
              <div key={msg.id || i} className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                <div className="message-bubble">{msg.content}</div>
                <span className="message-time">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
        }
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          autoFocus
        />
        <button type="submit" className="btn btn-primary" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  );
};

export default Chat;
