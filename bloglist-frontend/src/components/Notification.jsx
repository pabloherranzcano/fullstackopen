const Notification = ({ message, isErrorNotification }) => {
  const notificationStyle = {
    color: isErrorNotification ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    border: `5px solid ${isErrorNotification ? 'red' : 'green'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  }

  return (
    <div className="error" style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
