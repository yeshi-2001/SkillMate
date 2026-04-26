import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(userId, onMessageReceived) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        this.connected = true;
        this.stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
          if (onMessageReceived) {
            onMessageReceived(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker error: ' + frame.headers['message']);
        console.error('Details: ' + frame.body);
      },
    });

    this.stompClient.activate();
  }

  sendMessage(message) {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
      });
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }
}

export default new WebSocketService();
