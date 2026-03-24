import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const subscriptions = useRef({});

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        console.log('WebSocket connected');
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [user]);

  const subscribe = (topic, callback) => {
    if (!clientRef.current || !connected) return;
    if (subscriptions.current[topic]) return;

    const sub = clientRef.current.subscribe(topic, (msg) => {
      callback(JSON.parse(msg.body));
    });
    subscriptions.current[topic] = sub;
    return () => {
      sub.unsubscribe();
      delete subscriptions.current[topic];
    };
  };

  const publish = (destination, body) => {
    if (!clientRef.current || !connected) return;
    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  };

  return (
    <SocketContext.Provider value={{ connected, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
