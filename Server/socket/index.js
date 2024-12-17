import redis from 'redis';
import { Server } from 'socket.io';
const client = redis.createClient();
await client.connect()

const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('join status', async ({ orderId, orderStatus }) => {
            console.log('joining room', orderId);
            socket.join(`status:${orderId}`);
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

        socket.on('leave status', async ({ orderId }) => {
            //await client.del(`status:${orderId}`);
            console.log('leaving room', orderId);
            socket.leave(`status:${orderId}`);
        });


        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

export default setUpSocket;