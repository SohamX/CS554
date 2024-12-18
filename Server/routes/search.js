import { Router } from "express";
const router = Router();
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});
import helpers from "../helpers/pranHelpers.js";
import { dishData } from "../data/index.js";
import { cookData } from "../data/index.js";
import { validateCuisineType } from "../helpers/validationHelper.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { userHome } from "./middlewares.js";
import dotenv from "dotenv";
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

router.route("/").get(async (req, res) => {
  try {
    let dish = req.query.dish;
    let cuisine = req.query.cuisine;
    let location = req.query.location;
    let min = req.query.min;
    let max = req.query.max;
    let minPrice;
    let maxPrice;
    let latitude = req.query.latitude
    let longitude = req.query.longitude
    if (cuisine) {
      cuisine = helpers.checkString(cuisine, "cuisine");
      cuisine = validateCuisineType(cuisine);
    } else {
      cuisine = "";
    }

    if (!dish) dish = "";

    if (!location) location = "";

    if (min) {
      minPrice = helpers.validateFloats(min, "Min Price");
    }

    if (max) {
      maxPrice = helpers.validateFloats(max, "Max Price");
    }

    if (minPrice && maxPrice && minPrice > maxPrice) throw `Error: Min price cannot be greater than Max price`;
    //location validation to be implemented

    // get data from data functions
    const dishes = await dishData.searchQuery(
      dish,
      cuisine,
      location,
      minPrice,
      maxPrice,
      latitude,
      longitude
    );
    if (!dishes) {
      res.status(404).json({ error: "No Data Found" });
      return
    }
    for (const dish of dishes) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: dish.imageName,
      };

      const command = new GetObjectCommand(getObjectParams);

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      dish.imageUrl = url;
    }
    return res.status(200).json({ status: "success", dishes: dishes });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.route("/home/").get(userHome,async (req, res) => {
  try {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const userId = req.query.userId;
    console.log(userId);
    const dishes = await dishData.getAvailableDishes(latitude, longitude);
    await client.json.set(`home:dishes:${userId}`, '.',dishes);
    console.log("Setup in redis cache");
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
  } catch (e) {
    res.status(404).json({error : e});
    return;
  }
});

router.route("/cooks/").get(async (req, res) => {
  try {
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    if (!latitude || !longitude) throw `Latitude and Longitude should be provided`
    let isLat = helpers.beforeParseFloat(latitude)
    if (!isLat) throw `Invalid latitude`
    let isLong = helpers.beforeParseFloat(longitude)
    if (!isLong) throw `Invalid longitude`
    latitude = helpers.latitudeAndLongitude(parseFloat(latitude), 'Latitude')
    longitude = helpers.latitudeAndLongitude(parseFloat(longitude), 'Longitude')
    const cooks = await cookData.cooksForYou(latitude, longitude)
    res.status(200).json({ status: "success", cooks: cooks });
  } catch (e) {
    res.status(404).json({error : e});
    return;
  }
})
export default router;
