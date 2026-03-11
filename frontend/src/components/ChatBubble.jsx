import './ChatBubble.css';

const ChatBubble = ({ message, isSent }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
      <div className="bubble-content">
        <p>{message.message}</p>
        <span className="bubble-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
