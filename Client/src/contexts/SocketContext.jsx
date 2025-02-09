import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AccountContext';
import { useApi } from './ApiContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const { apiCall } = useApi();
    const [socket, setSocket] = useState(null);
    const [inOrders, setInOrders] = useState([]);
    const [chatRooms, setChatRooms] = useState({});
    const joinedStatusRef = useRef(new Set());
    const socketRef = useRef();

    useEffect(() => {
        if (!currentUser) return;

        if (!socketRef.current) {
            socketRef.current = io(`${import.meta.env.VITE_SERVER_URL}`);
            setSocket(socketRef.current);

            socketRef.current.on('connect', () => {
                console.log('Connected to socket server');
                joinIncompleteOrders();
            });

            socketRef.current.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });

            socketRef.current.on('order status update', (updatedOrder) => {
                if (updatedOrder.status === 'completed') {
                    socketRef.current.emit('leave status', { orderId: updatedOrder.orderId});
                    joinedStatusRef.current.delete(updatedOrder.orderId);
                    setInOrders((prevOrders) => prevOrders.filter((order) => order._id !== updatedOrder.orderId));
                    if(currentUser.role === 'user'){
                        toast.success(`Your order was completed at ${new Date().toLocaleTimeString()}`);
                    }
                    setChatRooms((prevChatRooms)=> {
                        const newChatRooms = {...prevChatRooms};
                        delete newChatRooms[updatedOrder.orderId];
                        return newChatRooms;
                    })
                } else{
                    let newOrder ={}
                    setInOrders((prevOrders) => prevOrders.map((order) => {
                        if (order._id === updatedOrder.orderId) {
                            newOrder = { ...order, status: updatedOrder.status };
                            return { ...order, status: updatedOrder.status };
                        }
                        return order;
                    }));
                    if(currentUser.role === 'user'){
                        if(updatedOrder.status === 'in_progress'){
                            toast.success(`${newOrder.dishes.cookName} has started preparing your order at ${new Date().toLocaleTimeString()}`);
                        }
                        else if(updatedOrder.status === 'ready'){
                            console.log(newOrder.dishes.cookName,"here");
                            toast.success(`${newOrder.dishes.cookName} has finished preparing your order at ${new Date().toLocaleTimeString()}`);
                        } else if(updatedOrder.status === 'completed'){
                            toast.success(`Your order from ${newOrder.dishes.cookName} was completed at ${new Date().toLocaleTimeString()}`);
                        }
                    }
                }
            });

            socketRef.current.on('new order', (order) => {
                if(currentUser.role === 'cook'){
                    setInOrders((prevOrders) => [...prevOrders, order]);
                    socketRef.current.emit('join status', {orderId: order._id, orderStatus: order.status});
                    joinedStatusRef.current.add(order._id);
                    setChatRooms((prevChatRooms) => {
                        const newChatRooms = {...prevChatRooms};
                        newChatRooms[order._id] = [];
                        return newChatRooms;
                    })
                    toast.success(`New order from ${order.username} at ${new Date().toLocaleTimeString()}`);
                }
            });

            socketRef.current.on('chat message', (msg) => {
                console.log('message: ', msg);
                setChatRooms((prevChatRooms) => {
                    const newChatRooms = {...prevChatRooms};
                    if(newChatRooms[msg.orderId]){
                        newChatRooms[msg.orderId].push(msg);
                    } else{
                        newChatRooms[msg.orderId] = [msg];
                    }
                    return newChatRooms;
                });
            });

            socketRef.current.on('chat history', (chat) => {
                console.log('chat history', chat);
                setChatRooms((prevChatRooms) => {
                    const newChatRooms = {...prevChatRooms};
                    newChatRooms[chat[0].orderId] = chat;
                    return newChatRooms;
                });
            });
        }

        const joinIncompleteOrders = async () => {
            try {
                const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/orders/${currentUser.role ==='user'? 'user':'cook'}/incomplete/${currentUser._id}`);
                if (response.status === 'success') {
                    response.orders.forEach(order => {
                        if (!joinedStatusRef.current.has(order._id)) {
                            socketRef.current.emit('join status', {orderId: order._id, orderStatus: order.status});
                            joinedStatusRef.current.add(order._id);
                            setChatRooms((prevChatRooms) => {
                                const newChatRooms = {...prevChatRooms};
                                newChatRooms[order._id] = [];
                                return newChatRooms;
                            })
                        }
                    });
                    setInOrders(response.orders);
                    if(currentUser.role === 'cook'){
                        socketRef.current.emit('join cook', {cookId: currentUser._id});
                    }
                }
            } catch (error) {
                console.error('Error fetching incomplete orders:', error);
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.off('join status');
                socketRef.current.off('order status update');
                socketRef.current.off('new order');
                socketRef.current.off('chat message');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [currentUser, apiCall]);

    const updateOrderStatus = (orderId, status) => {
        if(currentUser.role === 'cook'){
            socketRef.current.emit('order status update', { orderId, status });
        }
    }

    const newOrderPlaced = (order) => {
        if(currentUser.role === 'user'){
            setInOrders((prevOrders) => [...prevOrders, order]);
            socketRef.current.emit('new order', {order: order});
            socketRef.current.emit('join status', {orderId: order._id, orderStatus: order.status});
            joinedStatusRef.current.add(order._id);
            setChatRooms((prevChatRooms) => {
                const newChatRooms = {...prevChatRooms};
                newChatRooms[order._id] = [];
                return newChatRooms;
            })
        }
    }

    const sendMessage = (orderId, message) => {
        if (socketRef.current && message.trim()) {
            const msg = {
                user: currentUser.username,
                text: message,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                orderId: orderId
            };
            socketRef.current.emit('chat message', {msg: msg});
            setChatRooms((prevChatRooms) => {
                const newChatRooms = {...prevChatRooms};
                newChatRooms[orderId].push(msg);
                return newChatRooms;
            });
        }
    }

    return (
        <SocketContext.Provider value={{socket, inOrders, toast, updateOrderStatus, newOrderPlaced, chatRooms, sendMessage}}>
            {children}
            <ToastContainer />
        </SocketContext.Provider>
    );
};