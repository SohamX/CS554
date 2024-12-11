import { users, cooks } from "../config/mongoCollections.js";
import { Router } from "express";
import { ObjectId } from "mongodb";
const router = Router();
import { cookData } from "../data/index.js";
import helpers from "../helpers/pranHelpers.js";
const userCollection = await users();
const cookCollection = await cooks();

// ADD COOK ROUTE
router.route("/register").post(async (req, res) => {
  let {
    firstName,
    lastName,
    username,
    gmail,
    mobileNumber,
    address,
    city,
    state,
    zipcode,
    country,
    bio,
    latitude,
    longitude
  } = req.body;
  let latitude_float
  let longitude_float
  try {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !address ||
      !city ||
      !state ||
      !zipcode ||
      !country ||
      !gmail ||
      !mobileNumber ||
      !bio ||
      !latitude ||
      !longitude
    ) {
      throw "All mandatory fields are not supplied";
    }
    firstName = helpers.checkString(firstName, "firstName");
    firstName = helpers.checkSpecialCharsAndNum(firstName, "firstName");
    lastName = helpers.checkString(lastName, "lastName");
    lastName = helpers.checkSpecialCharsAndNum(lastName, "lastName");
    username = helpers.checkString(username, "username");
    username = helpers.checkSpecialCharsAndNum(username, "username");
    if (username.length < 5 || username.length > 10) {
      throw "username should be at least 5 characters long with a max of 10 characters ";
    }
    username = username.toLowerCase();
    // const sameUsername = await userCollection.findOne({ username: username });
    // const sameCookname = await cookCollection.findOne({ username: username });
    // if (sameUsername || sameCookname) {
    //   throw `Error: User/Cook with ${username} already exists`;
    // }
    // if (typeof password !== "string") {
    //   throw "Password should be of type string";
    // }
    // password = password.trim();
    // if (password === "" || /\s/.test(password) || password.length < 8) {
    //   throw "Password should not contains spaces and must be minimum 8 characters long";
    // }
    // if (
    //   !/[A-Z]/.test(password) ||
    //   !/\d/.test(password) ||
    //   !/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(password)
    // ) {
    //   throw "Password should contain at least one uppercase character and at least one number and there has to be at least one special character";
    // }
    address = helpers.checkString(address, "address");
    if (/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(address)) {
      throw `address cannot contains special characters`;
    }
    city = helpers.checkString(city, "city");
    city = helpers.checkSpecialCharsAndNum(city, "city");
    state = helpers.checkString(state, "state");
    state = helpers.checkSpecialCharsAndNum(state, "state");
    if (typeof zipcode !== "string") {
      throw "zipcode should be of type string";
    }

    zipcode = zipcode.trim();
    if (!/^\d{5}(-\d{4})?$/.test(zipcode)) throw "Please enter valid zipcode";
    if (typeof gmail !== "string") {
      throw "gmail should be of type string";
    }

    let str1 = latitude.trim()
    latitude_float = parseFloat(str1);
    latitude_float = helpers.latitudeAndLongitude(latitude_float, 'Latitude')
  
    let str2 = longitude.trim()
    longitude_float = parseFloat(str2);
    longitude_float = helpers.latitudeAndLongitude(longitude_float, 'Longitude')

    gmail = gmail.trim();
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail))
      throw "Please enter valid gmail";
    // const sameGamil = await userCollection.findOne({ gmail: gmail });
    // const sameCookGamil = await cookCollection.findOne({ gmail: gmail });
    // if (sameGamil || sameCookGamil) {
    //   throw `Error: Account with email id: ${gmail} already exists`;
    // }

    if (typeof mobileNumber !== "string") {
      throw "mobileNumber should be of type string";
    }

    mobileNumber = mobileNumber.trim();
    if (!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber))
      throw "Please enter valid mobileNumber in 000-000-0000 format";
    // const sameNumber = await userCollection.findOne({
    //   mobileNumber: mobileNumber,
    // });
    // const sameCookNumber = await cookCollection.findOne({
    //   mobileNumber: mobileNumber,
    // });
    // console.log("same:", sameCookNumber);
    // if (sameNumber) {
    //   throw `Error: A user already exists with number: ${sameNumber.mobileNumber}`;
    // } else if (sameCookNumber) {
    //   throw `Error: A cook already exists with number: ${sameCookNumber.mobileNumber}`;
    // }

    country = helpers.checkString(country, "country");
    country = helpers.checkSpecialCharsAndNum(country, "country");
    bio = helpers.checkString(bio, "bio");
    if (/^[^a-zA-Z]+$/.test(bio)) {
      throw "Bio contains only numeric and special characters";
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const success = await cookData.registerCook(
      firstName,
      lastName,
      username,
      gmail,
      mobileNumber,
      address,
      city,
      state,
      zipcode,
      country,
      bio,
      latitude_float,
      longitude_float
    );
    if (success.signupCompleted) {
      res.status(200).json({ status: "Cook Registered Successfully",cook:success.cook });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
});

// GET COOK BY ID
router.route("/:id")
.get(async (req, res) => {
  let userId  = req.params.id;
  try {
    if (!userId) throw `Cook ID not Provided`;
    userId = helpers.checkId(userId, "userId");
    const data = await cookData.getCookByID(userId);
    if (data) {
      res.status(200).json({ status: "success", cook: data });
    } else {
      res.status(404).json({ error: "Cook Not Found" });
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
})

// UPDATE USER BY ID
.put(async (req, res) => {
  let {
    // userId,
    firstName,
    lastName,
    username,
    gmail,
    mobileNumber,
    address,
    city,
    state,
    zipcode,
    country,
    bio,
    latitude,
    longitude
  } = req.body;
  let userId = req.params.id
  let latitude_float, longitude_float;

  try {
    if (
      // !userId ||
      !firstName ||
      !lastName ||
      !username ||
      !address ||
      !city ||
      !state ||
      !zipcode ||
      !country ||
      !gmail ||
      !mobileNumber ||
      !bio ||
      !latitude ||
      !longitude
    ) {
      throw "All mandatory fields are not provided";
    }
    userId = helpers.checkId(userId, "userId");
    const currUser = await cookCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!currUser) {
      throw "No cook with that ID";
    }
    
    firstName = helpers.checkString(firstName, "firstName");
    firstName = helpers.checkSpecialCharsAndNum(firstName, "firstName");
    lastName = helpers.checkString(lastName, "lastName");
    lastName = helpers.checkSpecialCharsAndNum(lastName, "lastName");
    username = helpers.checkString(username, "username");
    username = helpers.checkSpecialCharsAndNum(username, "username");
    if (username.length < 5 || username.length > 10) {
      throw "username should be at least 5 characters long with a max of 10 characters ";
    }
    username = username.toLowerCase();
    if (currUser.username !== username) {
      const matchedCount = await userCollection.countDocuments({
        username: username,
      });
      const cookMatched = await cookCollection.countDocuments({
        username: username,
      });
      if (matchedCount > 0 || cookMatched > 0) {
        throw "Already username exists";
      }
    }
    address = helpers.checkString(address, "address");
    if (/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(address)) {
      throw `address cannot contains special characters`;
    }
    city = helpers.checkString(city, "city");
    city = helpers.checkSpecialCharsAndNum(city, "city");
    state = helpers.checkString(state, "state");
    state = helpers.checkSpecialCharsAndNum(state, "state");
    if (typeof zipcode !== "string") {
      throw "zipcode should be of type string";
    }

    zipcode = zipcode.trim();
    if (!/^\d{5}(-\d{4})?$/.test(zipcode)) throw "Please enter valid zipcode";
    if (typeof gmail !== "string") {
      throw "gmail should be of type string";
    }

    let str1 = latitude.trim()
    latitude_float = parseFloat(str1);
    latitude_float = helpers.latitudeAndLongitude(latitude_float, 'Latitude')
  
    let str2 = longitude.trim()
    longitude_float = parseFloat(str2);
    longitude_float = helpers.latitudeAndLongitude(longitude_float, 'Longitude')

    gmail = gmail.trim();
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail))
      throw "Please enter valid gmail";
    if (currUser.gmail !== gmail) {
      const matchedCount = await userCollection.countDocuments({
        gmail: gmail,
      });
      const cookMatched = await cookCollection.countDocuments({ gmail: gmail });
      if (matchedCount > 0 || cookMatched > 0) {
        throw "Already gmail exists";
      }
    }

    if (typeof mobileNumber !== "string") {
      throw "mobileNumber should be of type string";
    }

    mobileNumber = mobileNumber.trim();
    if (!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber))
      throw "Please enter valid mobileNumber in 000-000-0000 format";
    if (currUser.mobileNumber !== mobileNumber) {
      const matchedCount = await userCollection.countDocuments({
        mobileNumber: mobileNumber,
      });
      const cookMatched = await cookCollection.countDocuments({
        mobileNumber: mobileNumber,
      });
      if (matchedCount > 0 || cookMatched > 0) {
        throw "Already mobileNumber exists";
      }
    }
    country = helpers.checkString(country, "country");
    country = helpers.checkSpecialCharsAndNum(country, "country");
    bio = helpers.checkString(bio, "bio");
    if (/^[^a-zA-Z]+$/.test(bio)) {
      throw "Bio contains only numeric and special characters";
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const success = await cookData.updateCook(
      userId,
      firstName,
      lastName,
      username,
      gmail,
      mobileNumber,
      address,
      city,
      state,
      zipcode,
      country,
      bio,
      latitude_float,
      longitude_float
    );
    if (success.cookDataUpdated) {
      res.status(200).json({ status: "Cook Updated Successfully" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
})

// DELETE USER BY ID
.delete(async (req, res) => {
  let { userId } = req.body;
  try {
    if (!userId) throw `Cook ID not Provided`;
    userId = helpers.checkId(userId, "userId");
    const success = await cookData.deleteCook(userId);
    if (success.deleted) {
      res.status(200).json({ status: "Cook Deleted Successfully" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
});

// UPDATE COOK'S AVAILABILTY
router.route("/availability/:id").put(async(req, res) => {
  // let userId = req.params.id
  // let {
  //   days,
  //   hours
  // } = req.body
  // try {
  //   if (!userId) throw `Cook ID not Provided`;
  //   userId = helpers.checkId(userId, "userId");
  //   const data = await cookData.getCookByID(userId);
  //   if (data) {
  //     res.status(200).json({ status: "success", cook: data });
  //   } else {
  //     res.status(404).json({ error: "Cook Not Found" });
  //   }
  // } catch (e) {
    res.status(400).json({ error: "Logic not implemented yet" });
    return;
  // }
})

// GET COOK'S AVAILABILITY BY ID
.get(async(req, res) => {
  let userId = req.params.id
  try {
    if (!userId) throw `Cook ID not Provided`;
    userId = helpers.checkId(userId, "userId");
    const data = await cookData.getCookByID(userId);
    if (!data) {
      res.status(404).json({ error: "Cook Not Found" });
    }
    const availability = await cookData.getCookAvailability(userId);
    if (availability) {
      res.status(200).json({ status: "success", availability: availability });
    } else {
      res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
})
export default router;
