import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AccountContext';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';

const ChatRoom = () => {
  const { currentUser } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off('chat message');
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && message.trim()) {
      const msg = {
        user: currentUser.username,
        text: message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('chat message', msg);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Chat Room
      </Typography>
      <List sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${msg.user}: ${msg.text}`}
              secondary={new Date(msg.timestamp).toLocaleTimeString()}
            />
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;