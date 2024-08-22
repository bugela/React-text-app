import React, { useState, useEffect } from 'react';
import './Chat.css'; 
/*import icon from './Assets/icon.png';*/

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
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to fetch messages');
      }
    };

    fetchMessages();
  }, [activeConversation, token]);

  const handleSendMessage = async () => {
    const sanitizedMessage = sanitizeInput(newMessage).trim();

      // Check if the message is empty
  if (sanitizedMessage === '') {
    setError('Message cannot be empty');
    return; // Stop the function if the message is empty
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
      const latestMessage = data.latestMessage;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...latestMessage,
          userId: userId, // Ensure that the message is associated with the current user
        },
      ]);

      setNewMessage('');
      setError(''); // Clear any previous errors

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
              <div className="message-content">
                <p>{message.text}</p>
                {isCurrentUser && (
                  <button onClick={() => handleDeleteMessage(message.id)} className="delete-button">
                    Delete
                  </button>
                )}
              </div>
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
