import { useNotifications } from '../hooks/useNotifications';

const Notifications = () => {
  const { notifications, markRead, markAllRead } = useNotifications();

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1>Notifications</h1>
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>
        </div>

        {notifications.length === 0
          ? <div className="empty-state card"><p>No notifications yet</p></div>
          : <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {notifications.map(n => (
                <div key={n.id}
                  className={`notif-row ${!n.isRead ? 'notif-unread' : ''}`}
                  onClick={() => !n.isRead && markRead(n.id)}>
                  <div className="notif-icon">
                    {n.type === 'NEW_MATCH' ? '🤝' : n.type === 'CONNECTION' ? '👥' : '🔔'}
                  </div>
                  <div className="notif-content">
                    <p>{n.message}</p>
                    <span className="notif-time">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!n.isRead && <div className="notif-dot" />}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

export default Notifications;
