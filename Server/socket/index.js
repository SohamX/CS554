import { Server } from 'socket.io';
import client from '../config/redisClient.js';

const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        //-------------------------------------------------------------------------------------
        // cooks join a room here to get notified when an order is placed
        socket.on('join cook', ({ cookId }) => {
            console.log('joining room', cookId);
            socket.join(`cook:${cookId}`);
        });
        // notification from users to cooks
        socket.on('new order', ({ order }) =>{
            console.log('new order', order);
            io.to(`cook:${order.cookId}`).emit('new order', order);
        })
        // cooks leave the room when they are done for the day
        socket.on('leave cook', ({ cookId }) => {
            console.log('leaving room', cookId);
            socket.leave(`cook:${cookId}`);
        });
        //-------------------------------------------------------------------------------------

        //-------------------------------------------------------------------------------------
        // users and cooks join a room so that cook can notify users about the status of their order
        socket.on('join status', async ({ orderId, orderStatus }) => {
            console.log('joining room', orderId);
            socket.join(`status:${orderId}`);
            let chat = await client.lRange(`chat:${orderId}`, 0, -1);
            if(typeof chat === 'string'){
                chat = JSON.parse(chat);
            }
            if(chat.length > 0){
                let chatMessages = [];
                chat.forEach((msg) => {
                    chatMessages.push(JSON.parse(msg));
                });
                socket.emit('chat history', chatMessages);
            }
            // const status = await client.get(`status:${orderId}`);
            // const statusObj = JSON.parse(status);
            // console.log('status from redis', statusObj);
            // if(statusObj === orderStatus){
            //     return;
            // } else{
            //     try {
            //         await client.del(`status:${orderId}`);
            //         await client.set(`status:${orderId}`, JSON.stringify({ status: orderStatus }), 'EX', 1800);
            //         console.log('status updated in redis for order', orderId);
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
        });
        // notification from cooks to users
        socket.on('order status update', async ({ orderId, status }) => {
            console.log('order status update', orderId, status);
            io.to(`status:${orderId}`).emit('order status update', { orderId, status });
            if(status === 'completed'){
                console.log("leaving room", orderId);
                socket.leave(`status:${orderId}`);
            }
            // try {
            //     await client.del(`status:${orderId}`);
            //     if(status === 'completed'){
            //         console.log("leaving room", orderId);
            //         socket.leave(`status:${orderId}`);
            //     }
            //     else{
            //         await client.set(`status:${orderId}`, JSON.stringify({ status }), 'EX', 3600);
            //         console.log('status updated in redis for order', orderId);
            //     }
            // } catch (error) {
            //     console.log(error);
            // }
        });
        // users and cooks leave the room when the order is completed
        socket.on('leave status', async ({ orderId }) => {
            //await client.del(`status:${orderId}`);
            console.log('leaving room', orderId);
            socket.leave(`status:${orderId}`);
        });
        //-------------------------------------------------------------------------------------
        socket.on('chat message', async ({msg}) => {
            console.log('message: ', msg);
            const { orderId } = msg;
            const chat = await client.rPush(`chat:${orderId}`, JSON.stringify(msg));
            if(chat > 50){
                await client.lPop(`chat:${orderId}`);
            }
            await client.expire(`chat:${orderId}`, 3600);
            socket.broadcast.to(`status:${orderId}`).emit('chat message', msg);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

export default setUpSocket;