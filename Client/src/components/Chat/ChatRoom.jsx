import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AccountContext';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Paper, Tabs, Tab, InputAdornment, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { Link } from 'react-router-dom';

const FloatingChatWidget = () => {
  const { currentUser } = useContext(AuthContext);
  const { chatRooms, sendMessage, toast, inOrders } = useContext(SocketContext);
  const [selectedChat , setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tabId, setTabId] = useState(null);
  const [newMessage, setNewMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatRooms, tabId, isChatOpen]);

  useEffect(()=>{
    if(inOrders && inOrders.length > 0){
      setTabId(inOrders[0]._id);
    }
  },[inOrders]);

  useEffect(()=>{
    if(!isChatOpen){
      if(Object.keys(chatRooms).length > 0){
        setNewMessage(true);
      }
    }
  },[chatRooms]);

  const handleSendMessage = (orderId) => {
    if (message.trim()) {
      sendMessage(orderId, message);
      setMessage('');
    }
    else{
      toast.error('Message cannot be empty');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabId(newValue);
  };

  const handleMessageSend = (e) => {
    if(e.target.value.length <= 140){
      setMessage(e.target.value);
    }
  };

  const handleChatIcon = () => {
    setIsChatOpen(!isChatOpen);
    if(!isChatOpen){
      setNewMessage(false);
    }
  };

  if(!currentUser) return null;
  else if(inOrders && inOrders.length>0){
    return (
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, width: "fit-content", zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
        {isChatOpen && (
           <Paper
           sx={{
             p: 2,
             display: 'flex',
             flexDirection: 'column',
             gap: 1,
             width: '25vw',
             height: '70vh',
             overflowY: 'hidden',
             position: 'relative',
             alignItems: 'center',
             borderRadius: 2,
             boxShadow: 4,
           }}
         >
            {inOrders? (
                <>
                  <Tabs 
                    value={tabId} 
                    onChange={handleTabChange} 
                    variant='scrollable' 
                    scrollButtons="auto"
                    sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                    {inOrders.map((order)=>(
                      <Tab 
                        label={`Chat with ${currentUser.role==="user"? order.dishes.cookName: order.username}`} 
                        key={order._id} 
                        wrapped 
                        value={order._id} 
                        variant='fullWidth' 
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                          },
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        }}
                      />
                    ))}
                  </Tabs>
                  {inOrders.map((order)=>(
                    tabId === order._id && (
                      <Box 
                        key={order._id} 
                        sx={{display: "flex", height: "fit-content", flexDirection: "column", justifyContent: "space-between", gap: 1, width: '100%'}}
                      >
                        <Link to={`/${currentUser.role==="user"? 'student': 'cook'}/orders/${order._id}`} style={{ textDecoration: 'none' }}>
                          <Typography variant='subtitle2'>Order Details</Typography>
                        </Link>
                        <List 
                          sx={{ 
                            width: '100%', 
                            bgcolor: 'background.paper', 
                            position: 'relative', 
                            overflowY: 'auto', 
                            flexGrow: 1, 
                            p: 1, 
                            borderRadius: 2, 
                            height: '44vh',
                            scrollbarWidth: 'none' 
                          }}
                        >
                          {chatRooms[order._id] && chatRooms[order._id].map((chat, index) => (
                            <ListItem 
                              key={index} 
                              sx={{ display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: chat.user === currentUser.username ? 'flex-end' : 'flex-start', 
                                marginBottom: chatRooms[order._id][index + 1] && chatRooms[order._id][index + 1].user !== chat.user ? 1 : 0,
                                paddingBottom: chatRooms[order._id][index + 1] && chatRooms[order._id][index + 1].user !== chat.user ? 1 : 0,
                              }}
                            >
                              {/* <Typography variant="body2" sx={{ color: 'offwhite' }}>
                                {chat.user} {new Date(chat.timestamp).toLocaleTimeString()}
                              </Typography>
                              <Typography variant="body1">
                                {chat.text}
                              </Typography> */}
                              {/* <ListItemText
                                primary={chat.text}
                                secondary={new Date(chat.timestamp).toLocaleTimeString()}
                                sx={{ borderRadius: 2, bgcolor: chat.user === currentUser.username ? 'primary.main' : 'secondary.main', color: 'white', p: 1 }}
                              /> */}
                              {chatRooms[order._id][index - 1] && chatRooms[order._id][index - 1].user !== chat.user && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    alignSelf:
                                      chat.user === currentUser.username
                                        ? 'flex-end'
                                        : 'flex-start',
                                  }}
                                >
                                  {chat.user} -{' '}
                                  {chat.timestamp}
                                </Typography>
                              )}
                              <Box
                                sx={{
                                  maxWidth: '70%',
                                  bgcolor:
                                    chat.user === currentUser.username
                                      ? 'primary.main'
                                      : 'grey.200',
                                  color:
                                    chat.user === currentUser.username
                                      ? 'white'
                                      : 'black',
                                  borderRadius: 2,
                                  p: 1,
                                }}
                              >
                                <Typography variant="body1">{chat.text}</Typography>
                              </Box>
                            </ListItem>
                          ))}
                          <div ref={messagesEndRef} />
                        </List>
                        <TextField
                          label="Type a message"
                          variant="outlined"
                          value={message}
                          onChange={handleMessageSend}
                          sx={{ width: '100%', mt: 1 }}
                          helperText="140 characters max"
                          error={message.length > 140}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end" sx={{ width: 24, justifyContent: 'flex-end' }}>
                                  <IconButton onClick={() => handleSendMessage(order._id)} variant='contained' color='primary' size='small' sx={{ p: 0, width: 24, height: 24  }} edge='end' >
                                    <SendIcon fontSize='small' />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                            formHelperText: { sx: { color: message.length >=140? "red": "inherit"}}
                          }}
                        />
                        {/* <Button onClick={() => handleSendMessage(order._id)} variant='contained'>
                          <SendIcon />
                        </Button> */}
                      </Box>
                    )
                  ))}
                </>
              ):(
                <Typography variant='h6'>No orders</Typography>
            )}
          </Paper>
        )}
        <Badge color="secondary" variant="dot" invisible={!newMessage}>
          <IconButton onClick={handleChatIcon} sx={{ m: 1, width: 56, height: 56, backgroundColor: 'primary.main', color: 'white', position: 'relative', zIndex: 1000 }}>
            <ChatIcon />
          </IconButton>
        </Badge>
      </Box>
    );
  }
};

export default FloatingChatWidget;