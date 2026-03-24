import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotifRead, markAllNotifsRead } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const { subscribe, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user || !connected) return;
    const unsub = subscribe(`/topic/notifications/${user.id}`, (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    return unsub;
  }, [user, connected, subscribe]);

  const markRead = async (id) => {
    await markNotifRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await markAllNotifsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markRead, markAllRead, refetch: fetchNotifications };
};
