import React, { useState, useEffect } from 'react';
import './Chat.css'; 

const sanitizeInput = (input) => {
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML;
};

const Chat = ({ token, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [activeConversation, setActiveConversation] = useState(localStorage.getItem('conversationId') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');

  useEffect(() => {
    if (!activeConversation) {
      console.log('No active conversation selected.');
      return;
    }

    const fetchMessages = async () => {
      console.log(`Fetching messages for conversation: ${activeConversation}`);
      try {
        const res = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${activeConversation}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch messages:', await res.text());
          throw new Error('Failed to fetch messages');
        }

        const data = await res.json();

        // Ensure messages are structured properly before setting state
        const formattedMessages = data.map(message => ({
          ...message,
          userId: message.userId, // Ensure userId is correctly mapped
          username: message.username, // Add username for display
          avatar: message.avatar, // Add avatar for display
        }));

        setMessages(formattedMessages); // Update state with fetched messages
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to fetch messages');
      }
    };

    fetchMessages();
  }, [activeConversation, token]);

  const handleSendMessage = async () => {
    const sanitizedMessage = sanitizeInput(newMessage).trim();

    if (sanitizedMessage === '') {
      setError('Message cannot be empty');
      return;
    }

    try {
      const res = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sanitizedMessage,
          conversationId: activeConversation,
        }),
      });

      if (!res.ok) throw new Error(await res.text() || 'Failed to send message');

      const data = await res.json();
      const latestMessage = {
        ...data.latestMessage,
        userId: userId, // Ensure message has userId for correct display
        username: username, // Include the username
        avatar: avatar, // Include the avatar
      };

      setMessages((prevMessages) => [...prevMessages, latestMessage]);
      setNewMessage('');
      setError('');

    } catch (err) {
      console.error('Error sending message:', err);
      setError(`Failed to send message: ${err.message}`);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      const res = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(await res.text() || 'Failed to delete message');

      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msgId));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((message) => {
          const isCurrentUser = message.userId === userId;
          return (
            <div
              key={message.id}
              className={`message ${isCurrentUser ? 'message-right' : 'message-left'}`}
            >
              {!isCurrentUser && <img src={message.avatar} alt={`${message.username}'s avatar`} className="avatar" />}
              <div className="message-content">
                <p>{message.text}</p>
                {isCurrentUser && (
                  <button onClick={() => handleDeleteMessage(message.id)} className="delete-button">
                    Delete
                  </button>
                )}
              </div>
              {isCurrentUser && <img src={avatar} alt="Your avatar" className="avatar" />}
            </div>
          );
        })}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Chat;
