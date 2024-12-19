import { Router } from 'express';
import multer from 'multer';
//import sharp from 'sharp'
import crypto from 'crypto'
import xss from 'xss';
const router = Router();
import helpers from '../helpers/pranHelpers.js';
import resizeImage from '../data/resizeImage.js';
import { validateCuisineType, validateCost, checkisValidImageArray, validateId, validateUniqueDishesPerCook, checkDishDesc, checkisValidBoolean, errorMsg } from '../helpers/validationHelper.js';
import { dishData,cookData } from '../data/index.js';
import { S3Client,PutObjectCommand,GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
dotenv.config();
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY;
//console.log("Bucket Region:", bucketRegion);
const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey, 
        secretAccessKey: secretKey,
    }
  })

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

import redis from 'redis'
const client = redis.createClient();
client.connect().then(() => {});

router
    .route('/')
    .get(async (req, res) => {
        try {
            const dishes = await dishData.getAvailableDishes();
            for (const dish of dishes) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: dish.imageName
                  }
                
                  
                  const command = new GetObjectCommand(getObjectParams);
                  
                  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                  dish.imageUrl = url;
            }

            res.status(200).json({ status: "success", dishes: dishes });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })
    .post(upload.single('image'),async (req, res) => {
        // console.log(req.body);
        // console.log(req.file);
        try {
            if (!req.file) {
                throw "Please provide dish image";
            }
        } catch (error) {
            res.status(400).json(errorMsg(error));
        }

        const imageName = generateFileName()

        // const fileBuffer = await resizeImage(req.file.buffer);

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params);

        await s3Client.send(command);

        const dishFormData = req.body;
        // console.log(dishFormData);
        let {
            cookId,
            name,
            description,
            cuisineType,
            cost
            // ,images
        } = dishFormData;
        name = xss(name);
        description = xss(description);
        cuisineType = xss(cuisineType);
        cost = xss(cost);

        try {
            if (!cookId || !name || !description || !cuisineType || !cost) {//|| !images
                throw "All fields need to be supplied";
            }
            cookId = validateId(cookId, 'cookId');
            name = helpers.checkString(name, 'dish name');
            description = checkDishDesc(description, 'description');
            cuisineType = helpers.checkString(cuisineType, 'cuisineType');
            cuisineType = validateCuisineType(cuisineType);
            //validate cost
            cost = validateCost(parseFloat(cost), 'cost');
            //images = checkisValidImageArray(images, 'images');

            //check if dish already present for this cook
            await validateUniqueDishesPerCook(cookId, name);

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }


        try {
            const dishAdded = await dishData.addDish(cookId,
                name,
                description,
                cuisineType,
                cost,
                imageName
                // ,
                // images
            );
            if (dishAdded) {
                const keysToDelete = await client.keys(`home:dishes:*`);
                if (keysToDelete.length > 0) {
                    for (const key of keysToDelete) {
                    await client.del(key);
                    }
                }
                res.status(200).json({ status: "success", dish: dishAdded });
                
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
    })


router
    .route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const dish = await dishData.getDishById(req.params.id);
            const getObjectParams = {
                Bucket: bucketName,
                Key: dish.imageName
              }
            
              
              const command = new GetObjectCommand(getObjectParams);
              
              const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
              dish.imageUrl = url;
            res.status(200).json({ status: "success", dish: dish });
        } catch (e) {
            console.log(e);
            res.status(404).json(errorMsg(e));
            return;
        }
    })
    .patch(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        const dishFormData = req.body;
        let {
            cookId,
            name,
            description,
            cuisineType,
            cost,
            images,
            isAvailable } = dishFormData;
        name = xss(name);
        description = xss(description);
        cuisineType = xss(cuisineType);
        cost = xss(cost);
        

        try {
            cookId = validateId(cookId, 'cookId');
            let existingDish = await dishData.getDishById(req.params.id);


            if (name && existingDish.name != name.trim()) {
                name = helpers.checkString(name, 'dish name');
                //check if dish already present for this cook
                validateUniqueDishesPerCook(cookId, name);
            }

            if (description) {
                description = checkDishDesc(description, 'description');
            }

            if (cuisineType) {
                cuisineType = helpers.checkString(cuisineType, 'cuisineType');
                cuisineType = validateCuisineType(cuisineType);
            }
            if (cost) {
                //validate cost
                cost = validateCost(parseFloat(cost), 'cost');
            }

            if (images) {
                images = checkisValidImageArray(images, 'images');
            }
            if (dishFormData.isAvailable != null) {
                isAvailable = checkisValidBoolean(Boolean(dishFormData.isAvailable));
            }

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }


        try {
            const dishUpdated = await dishData.updateDish(req.params.id,
                cookId,
                name,
                description,
                cuisineType,
                cost,
                images,
                isAvailable);
            if (dishUpdated) {
                const keysToDelete = await client.keys(`home:dishes:*`);
                console.log("visited", keysToDelete)
                if (keysToDelete.length > 0) {
                    for (const key of keysToDelete) {
                    await client.del(key);
                    }
                }
                const keystoDel = await client.keys(`historyList:*`);
                if (keystoDel.length > 0) {
                    for (const key of keystoDel) {
                    await client.del(key);
                    }
                }
                res.status(200).json({ status: "success", dish: dishUpdated });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }

    })
    .delete(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const dishDeleted = await dishData.deleteDish(req.params.id);
            const getObjectParams = {
                Bucket: bucketName,
                Key: dishDeleted.imageName
              }
            
              
            const command = new DeleteObjectCommand(getObjectParams);
            await s3Client.send(command);

            const keysToDelete = await client.keys(`home:dishes:*`);
            if (keysToDelete.length > 0) {
                for (const key of keysToDelete) {
                await client.del(key);
                }
            }
            const keysToDel = await client.keys(`historyList*`);
            if (keysToDel.length > 0) {
                for (const key of keysToDel) {
                await client.del(key);
                }
            }

            res.status(200).json({ status: "success", dish: dishDeleted });
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
    })

router
    .route('/cook/:cookId')
    .get(async (req, res) => {
        try {
            req.params.cookId = validateId(req.params.cookId, 'cookId URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const dishes = await dishData.getAllDishesByCookId(req.params.cookId);

            for (const dish of dishes) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: dish.imageName
                  }
                
                  
                  const command = new GetObjectCommand(getObjectParams);
                  
                  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                  dish.imageUrl = url;
            }

            
            res.status(200).json({ status: "success", dishes: dishes });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })


router
    .route('/history/:userId')
    .get(async(req,res)=>{ 
      try{
        const userId = req.params.userId;
        const a = await client.lRange(`historyList:${userId}`,-5,-1);
        const parsedArray = a.map(item => JSON.parse(item));
        console.log(parsedArray.length);
        console.log(parsedArray);
        for (const dish of parsedArray) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: dish.imageName
              }
            
              
              const command = new GetObjectCommand(getObjectParams);
              
              const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
              dish.imageUrl = url;
              const cook = await cookData.getCookByID(dish.cookId.toString());
              dish.cookName = cook.username;
        }

        const filteredDishes = parsedArray.filter((dish => {
            const uniqueIds = new Set();
            return dish => {
                if (uniqueIds.has(dish._id)) {
                    return false; 
                }
                uniqueIds.add(dish._id);
                return true; 
            };
        })());

        res.status(200).json({ status: "success", dishes: filteredDishes });
        }
        catch(e){
          console.log(e);
        }
   
   
   
   
    })

export default router;