let socketServer = null;

const setSocketServer = (io) => {
  socketServer = io;
};

const emitNotification = ({ title, message, type }) => {
  const notification = {
    title,
    message,
    type,
    timestamp: new Date().toISOString()
  };

  if (!socketServer) {
    console.warn('Socket.IO server not initialized. Notification skipped:', notification);
    return notification;
  }

  socketServer.emit('notification', notification);
  console.log(`Notification emitted: ${notification.type} - ${notification.title}`);
  return notification;
};

module.exports = {
  setSocketServer,
  emitNotification
};
