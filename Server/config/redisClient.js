import redis from 'redis';
import dotenv from 'dotenv';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || '';

const client = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`,
    password: redisPassword
});

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Redis connection error:', err);
});

export default client;