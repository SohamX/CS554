import client from '../config/redisClient.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { cookData } from "../data/index.js";
dotenv.config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});




export const userHome = async(req,res,next)=>{
    let userId = req.query.userId;
    //console.log(req.originalUrl);
    let exists = await client.exists(`home:dishes:${userId}`);
    
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log(`Dishes List from cache for user ${userId}`);
      let dishes = await client.json.GET(`home:dishes:${userId}`);
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      for (const dish of dishes) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: dish.imageName,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        dish.imageUrl = url;
        const cook = await cookData.getCookByID(dish.cookId.toString());
        dish.cookName = cook.username;
      }
  
      res.status(200).json({ status: "success", dishes: dishes });
      
      return;
    } else {
      next();
    }

}


export const loginDetails = async(req,res,next)=>{
        let {gmail} = req.body;
        let exists = await client.exists(`user:${gmail}`);
        if (exists) {
        //if we do have it in cache, send the raw html from cache
        console.log('user details from Cache');
        let data = await client.json.get(`user:${gmail}`);
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        res.status(200).json({ status: "success", data:data});
        return;
        } else{
            let flag = await client.exists(`cook:${gmail}`);
            if(flag){
                console.log('cook details from Cache');
                let data = await client.json.get(`cook:${gmail}`);
                if (typeof data === 'string') {
                  data = JSON.parse(data);
                }
                res.status(200).json({ status: "success", data:data});
                return;


            }else{
                next();
            }

        
        }

}


// export const mwMl = async(req,res,next)=>{
//       let exists = await client.exists('moveList');
//       if (exists) {
//         //if we do have it in cache, send the raw html from cache
//         console.log('Move List from cache');
//         let showsHomePage = await client.json.get('moveList');
//         //console.log('Sending HTML from Redis....');
//         res.json(showsHomePage);
//         return;
//       } else {
//         next();
//       }
// }

// export const mwMid = async(req,res,next)=>{
//       let exists = await client.exists(`move${req.params.id}`);
//       if (exists) {
//         //if we do have it in cache, send the raw html from cache
//         console.log('move in Cache');
//         let showDetailPage = await client.json.get(`move${req.params.id}`);
//         //console.log('Sending HTML from Redis....');
//         res.json(showDetailPage);
//         return;
//       } else {
//         next();
//       }
    

// }

// export const mwIl = async(req,res,next)=>{
//       let exists = await client.exists('itemList');
//       if (exists) {
//         //if we do have it in cache, send the raw html from cache
//         console.log('item List from cache');
//         let showsHomePage = await client.json.get('itemList');
//         //console.log('Sending HTML from Redis....');
//         res.json(showsHomePage);
//         return;
//       } else {
//         next();
//       }


// }

// export const mwIid = async(req,res,next)=>{
//       let exists = await client.exists(`item${req.params.id}`);
//       if (exists) {
//         //if we do have it in cache, send the raw html from cache
//         console.log('item in Cache');
//         let showDetailPage = await client.json.get(`item${req.params.id}`);
//         //console.log('Sending HTML from Redis....');
//         //await client.lPush('historyList',JSON.stringify(showDetailPage));
//         res.json(showDetailPage);
//         return;
//       } else {
//         next();
//       }
// }
