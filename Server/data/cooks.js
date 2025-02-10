import { users, cooks } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers/pranHelpers.js'
import bcrypt from 'bcryptjs';
import client from '../config/redisClient.js';
const userCollection = await users();
const cookCollection = await cooks();

export const registerCook = async (
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
) => {
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
    throw "All fields need to be supplied";
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

  const sameUsername = await userCollection.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  const sameCookname = await cookCollection.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  if (sameUsername || sameCookname) {
    throw `Error: User/Cook with ${username} already exists`;
  }
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

  // latitude_float = parseFloat(latitude.trim());
  let latitude_float = helpers.latitudeAndLongitude(latitude, 'Latitude')
  // longitude_float = parseFloat(longitude.trim());
  let longitude_float = helpers.latitudeAndLongitude(longitude, 'Longitude')

  gmail = gmail.trim();
  if (!/^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(gmail))
    throw "Please enter valid email";
  const sameGamil = await userCollection.findOne({ gmail: gmail });
  const sameCookGamil = await cookCollection.findOne({ gmail: gmail });
  if (sameGamil || sameCookGamil) {
    throw `Error : Already email exists with ${gmail}`;
  }

  if (typeof mobileNumber !== "string") {
    throw "mobileNumber should be of type string";
  }

  mobileNumber = mobileNumber.trim();
  if (!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber))
    throw "Please enter valid mobileNumber in 000-000-0000 format";
  const sameNumber = await userCollection.findOne({
    mobileNumber: mobileNumber,
  });
  const sameCookNumber = await cookCollection.findOne({
    mobileNumber: mobileNumber,
  });
  if (sameNumber) {
    throw `Error : A user already exists with number: ${sameNumber.mobileNumber}`;
  } else if (sameCookNumber) {
    throw `Error : A cook already exists with number: ${sameCookNumber.mobileNumber}`;
  }

  country = helpers.checkString(country, "country");
  country = helpers.checkSpecialCharsAndNum(country, "country");
  bio = helpers.checkString(bio, "bio");
  if (/^[^a-zA-Z]+$/.test(bio)) {
    throw "Bio contains only numeric and special characters";
  }
  // const saltRounds = 16;

  // //const plainTextPassword = 'mySuperAwesomePassword';
  // const hash = await bcrypt.hash(password, saltRounds);
  let newCook = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    role: "cook",
    gmail: gmail,
    mobileNumber: mobileNumber,
    bio: bio,
    location: {
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      country: country,
      coordinates: { longitude: longitude_float, latitude: latitude_float }, //Calculated and stored?
    },
    availability: true,
    earnings: 0,
    dishes: [],
    avgRating: 0,
    reviews: [],
  };
  //const productCollection = await users();
  const insertInfo = await cookCollection.insertOne(newCook);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add User";

  const createdCook = await cookCollection.findOne({ _id: insertInfo.insertedId });

  if (!createdCook) throw "Failed to retrieve the created cook";

  return { signupCompleted: true, cook: createdCook };

};

export const updateCook = async (
  userId, updateData
) => {
  if (
    !updateData.userId &&
    !updateData.firstName &&
    !updateData.lastName &&
    !updateData.username &&
    !updateData.address &&
    !updateData.city &&
    !updateData.state &&
    !updateData.zipcode &&
    !updateData.country &&
    !updateData.gmail &&
    !updateData.mobileNumber &&
    !updateData.latitude &&
    !updateData.longitude &&
    !updateData.bio
  ) {
    throw "Please provide atleast one field to update";
  }
  userId = helpers.checkId(userId, "userId");
  const currUser = await cookCollection.findOne({ _id: new ObjectId(userId) });
  if (!currUser) {
    throw "No cook with that ID";
  }

  const updatedCookData = {};

  if (updateData.firstName) {
    updatedCookData.firstName = helpers.checkString(updateData.firstName, 'firstName');
    updatedCookData.firstName = helpers.checkSpecialCharsAndNum(updatedCookData.firstName, 'firstName');
  }
  if (updateData.lastName) {
    updatedCookData.lastName = helpers.checkString(updateData.lastName, 'lastName');
    updatedCookData.lastName = helpers.checkSpecialCharsAndNum(updatedCookData.lastName, 'lastName');
  }
  if (updateData.username) {
    updatedCookData.username = helpers.checkString(updateData.username, 'username');
    updatedCookData.username = helpers.checkSpecialCharsAndNum(updatedCookData.username, 'username');
    if (updatedCookData.username.length < 5 || updatedCookData.username.length > 10) {
      throw 'Username should be at least 5 characters long with a max of 10 characters';
    }
    if (currUser.username !== updatedCookData.username) {
      const matchedCount = await userCollection.countDocuments({ username: { $regex: new RegExp(`^${updatedCookData.username}$`, 'i') } });
      const cookMatched = await cookCollection.countDocuments({ username: { $regex: new RegExp(`^${updatedCookData.username}$`, 'i') } });
      if (matchedCount > 0 || cookMatched > 1) {
        throw 'Username already exists';
      }
    }
  }
  if (updateData.address) {
    updatedCookData['location.address'] = helpers.checkString(updateData.address, 'address');
    if (/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(updatedCookData['location.address'])) {
      throw 'Address cannot contain special characters';
    }
  }
  if (updateData.city) {
    updatedCookData['location.city'] = helpers.checkString(updateData.city, 'city');
    updatedCookData['location.city'] = helpers.checkSpecialCharsAndNum(updatedCookData['location.city'], 'city');
  }
  if (updateData.state) {
    updatedCookData['location.state'] = helpers.checkString(updateData.state, 'state');
    updatedCookData['location.state'] = helpers.checkSpecialCharsAndNum(updatedCookData['location.state'], 'state');
  }
  if (updateData.zipcode) {
    if (typeof updateData.zipcode !== 'string') {
      throw 'Zipcode should be of type string';
    }
    updatedCookData['location.zipcode'] = updateData.zipcode.trim();
    if (!/^\d{5}(-\d{4})?$/.test(updatedCookData['location.zipcode'])) {
      throw 'Please enter a valid zipcode';
    }
  }
  if (updateData.country) {
    updatedCookData['location.country'] = helpers.checkString(updateData.country, 'country');
    updatedCookData['location.country'] = helpers.checkSpecialCharsAndNum(updatedCookData['location.country'], 'country');
  }

  if (updateData.latitude) {
    updatedCookData['location.coordinates.latitude'] = helpers.latitudeAndLongitude(updateData.latitude, 'Latitude');
  }
  if (updateData.longitude) {
    updatedCookData['location.coordinates.longitude'] = helpers.latitudeAndLongitude(updateData.longitude, 'Longitude');
  }

  if (updateData.mobileNumber) {
    if (typeof updateData.mobileNumber !== 'string') {
      throw 'Mobile number should be of type string';
    }
    updatedCookData.mobileNumber = updateData.mobileNumber.trim();
    if (!/^\d{3}-\d{3}-\d{4}$/.test(updatedCookData.mobileNumber)) {
      throw 'Please enter a valid mobile number in 000-000-0000 format';
    }
    if (currUser.mobileNumber !== updatedCookData.mobileNumber) {
      const matchedCount = await userCollection.countDocuments({ mobileNumber: updatedCookData.mobileNumber, });
      const cookMatched = await cookCollection.countDocuments({ mobileNumber: updatedCookData.mobileNumber, });
      if (matchedCount > 0 || cookMatched > 0) {
        throw 'Mobile number already exists';
      }
    }
  }
  if (updateData.bio) {
    updatedCookData.bio = helpers.checkString(updateData.bio, 'bio');
    if (/^[^a-zA-Z]+$/.test(updatedCookData.bio)) {
      throw 'Bio contains only numeric and special characters';
    }
  }

  const updateInfo = await cookCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updatedCookData },
    { returnDocument: "after" }
  );
  if (!updateInfo)
    throw `Error: Update failed! Could not update cook's data with id ${userId}`;
  return { cookDataUpdated: true, cook: updateInfo };
};

export const deleteCook = async (userId) => {
  userId = helpers.checkId(userId, "userId");

  const deletionInfo = await cookCollection.findOneAndDelete({
    _id: new ObjectId(userId),
  });

  if (!deletionInfo) {
    throw `Could not find user with id: ${userId} for deletion`;
  }
  let deletedobj = {
    _id: deletionInfo._id,
  };
  deletedobj.deleted = new Boolean(true);
  return deletedobj;
};

export const getCookByID = async (userId) => {
  userId = helpers.checkId(userId, "userId");
  const currUser = await cookCollection.findOne({ _id: new ObjectId(userId) });
  if (!currUser) {
    throw `No cook found with ID: ${userId}`;
  }
  if (typeof(currUser.location.coordinates.longitude) == 'string') currUser.location.coordinates.longitude = 0.0
  if (typeof(currUser.location.coordinates.latitude) == 'string') currUser.location.coordinates.latitude = 0.0
  return currUser;
}

export const getCookAvailability = async (userId) => {
  userId = helpers.checkId(userId, "userId");
  const currUser = await cookCollection.findOne({ _id: new ObjectId(userId) });
  if (!currUser) {
    throw `No cook found with ID: ${userId}`;
  }
  return currUser.availability;
}

export const updateCooksAvailability = async (userId, availability) => {
  if (!userId) throw `Cook ID not Provided`;

  userId = helpers.checkId(userId, "userId");

  const data = await getCookByID(userId);
  if (!data) throw `No cook found with ID: ${userId}`

  const responseObj = await cookCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: { availability: availability } }, { returnDocument: "after", upsert: true });
  if (!responseObj) {
    throw `Unable to update availability`
  }
  let keysToDelete = await client.keys(`home:dishes:*`);
  if(typeof keysToDelete === 'string'){
    keysToDelete = JSON.parse(keysToDelete);
  }
  if (keysToDelete.length > 0) {
      for (const key of keysToDelete) {
      await client.del(key);
      }
  }
  let keystoDel = await client.keys(`historyList:*`);
  if(typeof keystoDel === 'string'){
    keystoDel = JSON.parse(keystoDel);
  }
  if (keystoDel.length > 0) {
      for (const key of keystoDel) {
      await client.del(key);
      }
  }
  return responseObj;
}

export const updateCooksEarnings = async (userId, totalCost) => {
  if (!userId) throw `Cook ID not Provided`;

  userId = helpers.checkId(userId, "userId");
  const cook = await getCookByID(userId);
  let earnings = (parseFloat(cook.earnings) + totalCost).toFixed(2);
  const updatedEarnings = await cookCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: { earnings: earnings } }, { returnDocument: "after" });
  if (!updatedEarnings) {
    throw `Error occured while updating earnings`;
  }
  await client.json.set(`cook:${updatedEarnings.gmail}`, '.',updatedEarnings);
  return updatedEarnings;

}

let oneDecimal = (num) => {
  let decimal = num.toString().split('.')[1];
  let deci = decimal.toString().slice(0, 1);
  let res = num.toString().split('.')[0] + "." + deci;
  return parseFloat(res);
};

let calcAvgRating = (reviewsArr) => {
  let len = reviewsArr.length;
  let avgRating = 0;
  let sumRating = 0;
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      let currReview = reviewsArr[i];
      sumRating += currReview.rating;
    }
    avgRating = sumRating / len;
    if (!(Number.isInteger(avgRating)) && avgRating.toString().split('.')[1].length > 1) {
      avgRating = oneDecimal(avgRating);
    }
    // // Round to nearest 0.5
    // avgRating = Math.round(avgRating * 2) / 2;
  }
  return avgRating;
};

export const updateCooksRating = async (cookId, userId, rating, review) => {
  if (!cookId) throw new Error("Cook ID not provided");
  if (!userId) throw new Error("User ID not provided");
  if (!rating || rating < 0 || rating > 5) throw new Error("Rating must be between 0 and 5");
  if (typeof review !== "string" || review.length > 1000) {
    throw new Error("Review must be a string and cannot exceed 1000 characters");
  }

  cookId = helpers.checkId(cookId, "userId");
  const cook = await getCookByID(cookId);
  let reviewsArr = cook.reviews;
  let newReview = {
    "userId": new ObjectId(userId),
    "review": review.trim(),
    "rating": parseFloat(rating)
  };
  reviewsArr.push(newReview);
  let avgRating = calcAvgRating(reviewsArr);
  const updatedEarnings = await cookCollection.findOneAndUpdate({ _id: new ObjectId(cookId) }, { $set: { avgRating: avgRating, reviews: reviewsArr } }, { returnDocument: "after" });
  if (!updatedEarnings) {
    throw `Error occured while updating avg rating and review`;
  }
  return updatedEarnings;

}

export const cooksForYou = async (lat, long) => {
  try {
    if (!lat || !long) throw `Latitude and Longitude should be provided`;
    lat = helpers.latitudeAndLongitude(lat, 'Latitude')
    long = helpers.latitudeAndLongitude(long, 'Longitude')
    const cooks = await cookCollection.find({availability: true}).sort({avgRating: -1}).toArray()
    let finalCooksArray = []
    for (const cook of cooks) {
      if (finalCooksArray.length < 5) {
        let dist = helpers.getDistanceFromLatLonInKm(lat, long, cook.location.coordinates.latitude, cook.location.coordinates.longitude)
        console.log("cook for you dist:", dist)
        if (dist < 10) {
          finalCooksArray.push(cook)
        }
      } else{
        break
      }
    }
    return finalCooksArray;
  } catch(e) {
    return e
  }
}

export const getCookCoordinates = async (cookId) => {
  cookId = helpers.checkId(cookId, "cookId");
  const coordinates = await cookCollection.findOne({ _id: new ObjectId(cookId) }, { projection: { "location": 1 } });
  if (!coordinates) {
    throw `No cook found with ID: ${cookId}`;
  }
  return coordinates;
}