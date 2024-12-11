import {users,cooks} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers/pranHelpers.js'
import bcrypt from 'bcryptjs';
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
  username = username.toLowerCase();

  const sameUsername = await userCollection.findOne({ username: username });
  const sameCookname = await cookCollection.findOne({ username: username });
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
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail))
    throw "Please enter valid gmail";
  const sameGamil = await userCollection.findOne({ gmail: gmail });
  const sameCookGamil = await cookCollection.findOne({ gmail: gmail });
  if (sameGamil || sameCookGamil) {
    throw `Error : Already gmail exists with ${gmail}`;
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
    availability: {
      days: [], // E.g., ['Monday', 'Wednesday', 'Friday']
      hours: { start: "", end: "" }, // E.g., {"start": "10:00", "end": "20:00"}
    },
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
  latitude,
  longitude
) => {
  if (
    !userId ||
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
    !latitude ||
    !longitude
  ) {
    throw "All mandatory field are not provided";
  }
  userId = helpers.checkId(userId, "userId");
  const currUser = await cookCollection.findOne({ _id: new ObjectId(userId) });
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

  // latitude_float = parseFloat(latitude.trim());
  let latitude_float = helpers.latitudeAndLongitude(latitude, 'Latitude')

  // longitude_float = parseFloat(longitude.trim());
  let longitude_float = helpers.latitudeAndLongitude(longitude, 'Longitude')

  gmail = gmail.trim();
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail))
    throw "Please enter valid gmail";
  if (currUser.gmail !== gmail) {
    const matchedCount = await userCollection.countDocuments({ gmail: gmail });
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

  let updateduserData = {
    firstName: firstName,
    lastName: lastName,
    username: username,
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
  };
  const updateInfo = await cookCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updateduserData },
    { returnDocument: "after" }
  );
  if (!updateInfo)
    throw `Error: Update failed! Could not update cook's data with id ${userId}`;
  return { cookDataUpdated: true };
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