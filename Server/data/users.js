//import mongo collections, bcrypt and implement the following data functions
import {users,cooks} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers/pranHelpers.js'
import bcrypt from 'bcryptjs';
export const registerUser = async (
  firstName,
  lastName,
  username,
  password,
  gmail,
  mobileNumber,
  address,
  city,
  state,
  zipcode,
  country
) => {
  if(!firstName ||
    !lastName ||
    !username ||
    !password ||
    !address ||
  !city ||
  !state ||
  !zipcode ||
  !country ||
  !gmail||
  !mobileNumber
  ){
      throw "All fields need to be supplied"
    }
  firstName = helpers.checkString(firstName,'firstName');
  firstName = helpers.checkSpecialCharsAndNum(firstName,'firstName');
  lastName = helpers.checkString(lastName,'lastName');
  lastName = helpers.checkSpecialCharsAndNum(lastName,'lastName');
  username = helpers.checkString(username,'username');
  username = helpers.checkSpecialCharsAndNum(username,'username');
  if(username.length<5||username.length>10){
    throw 'username should be at least 5 characters long with a max of 10 characters '
  }
  username=username.toLowerCase();
  const userCollection = await users();
  const sameUsername = await userCollection.findOne({username:username});
  if(sameUsername){
    throw `Error : Already username exists with ${username}`
  }
  if(typeof password!=="string"){
    throw 'Password should be of type string'
  }
  password = password.trim()

  if(password===""|| /\s/.test(password) || password.length<8){
    throw 'Password should not contains spaces and must be minimum 8 characters long'
  }
  if(!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(password) ){
    throw 'Password should contain at least one uppercase character and at least one number and there has to be at least one special character'
  }
  address = helpers.checkString(address,'address');
  if(/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(address)){
    throw `address cannot contains special characters`
  }
  city = helpers.checkString(city,'city');
  city = helpers.checkSpecialCharsAndNum(city,'city');
  state = helpers.checkString(state,'state');
  state = helpers.checkSpecialCharsAndNum(state,'state');
  if(typeof zipcode!=="string"){
    throw 'zipcode should be of type string'
  }
  
  zipcode = zipcode.trim();
  if(/^\d{5}(-\d{4})?$/.test(zipcode)) throw 'Please enter valid zipcode'
  if(typeof gmail!=="string"){
    throw 'gmail should be of type string'
  }
  
  gmail = gmail.trim();
  if(/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) throw 'Please enter valid gmail'
  const sameGamil = await userCollection.findOne({gmail:gmail});
  if(sameGamil){
    throw `Error : Already gmail exists with ${gmail}`
  }

  if(typeof mobileNumber!=="string"){
    throw 'mobileNumber should be of type string'
  }
  
  mobileNumber = mobileNumber.trim();
  if(/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
  const sameNumber = await userCollection.findOne({mobileNumber:mobileNumber});
  if(sameNumber){
    throw `Error : Already mobile number exists with ${sameNumber}`
  }

  country = helpers.checkString(country,'country');
  country = helpers.checkSpecialCharsAndNum(country,'country');

  const saltRounds = 16;

  //const plainTextPassword = 'mySuperAwesomePassword';
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName,
    lastName,  
    username, 
    password: hash,
    gmail:gmail,
    mobileNumber:mobileNumber,
    location: {
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        country: country,
        coordinates: { longitude: "", latitude: "" } //Calculated and stored?
    },
    favourites : [],
    mealRequested : []
  };
  //const productCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add User';
  
  const succ = {signupCompleted: true}
  return succ;


};

export const loginUser = async (username, password) => {
  if(!username || !password){
    throw 'Both Username and Password must be supplied'
  }
  username = helpers.checkString(username,'username');
  username = helpers.checkSpecialCharsAndNum(username,'username');
  if(username.length<5||username.length>10){
    throw 'username should be at least 5 characters long with a max of 10 characters '
  }
  username=username.toLowerCase();
  if(typeof password!=="string"){
    throw 'Password should be of type string'
  }
  password = password.trim()

  if(password===""|| /\s/.test(password) || password.length<8){
    throw 'Password should not contains spaces and must be minimum 8 characters long'
  }
  if(!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(password) ){
    throw 'Password should contain at least one uppercase character and at least one number and there has to be at least one special character'
  }
  const userCollection = await users();
  const usernameFound = await userCollection.findOne({username:username});
  if(!usernameFound){
    throw "Either the username or password is invalid"
  }
  let compareToMatch = false;

  try {
    compareToMatch = await bcrypt.compare(password, usernameFound.password);
  } catch (e) {
    //no op
  }

  if (compareToMatch) {
    const { _id,password, ...dataforsessions } = usernameFound
    return dataforsessions
  } else {
    throw "Either the username or password is invalid"
  }

};

export const registerCook = async (
    firstName,
    lastName,
    username,
    password,
    gmail,
    mobileNumber,
    address,
    city,
    state,
    zipcode,
    country,
    bio
  ) => {
    if(!firstName ||
      !lastName ||
      !username ||
      !password ||
      !address ||
    !city ||
    !state ||
    !zipcode ||
    !country ||
    !gmail||
    !mobileNumber || !bio
    ){
        throw "All fields need to be supplied"
      }
    firstName = helpers.checkString(firstName,'firstName');
    firstName = helpers.checkSpecialCharsAndNum(firstName,'firstName');
    lastName = helpers.checkString(lastName,'lastName');
    lastName = helpers.checkSpecialCharsAndNum(lastName,'lastName');
    username = helpers.checkString(username,'username');
    username = helpers.checkSpecialCharsAndNum(username,'username');
    if(username.length<5||username.length>10){
      throw 'username should be at least 5 characters long with a max of 10 characters '
    }
    username=username.toLowerCase();
    const userCollection = await cooks();
    const sameUsername = await userCollection.findOne({username:username});
    if(sameUsername){
      throw `Error : Already username exists with ${username}`
    }
    if(typeof password!=="string"){
      throw 'Password should be of type string'
    }
    password = password.trim()
  
    if(password===""|| /\s/.test(password) || password.length<8){
      throw 'Password should not contains spaces and must be minimum 8 characters long'
    }
    if(!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(password) ){
      throw 'Password should contain at least one uppercase character and at least one number and there has to be at least one special character'
    }
    address = helpers.checkString(address,'address');
    if(/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(address)){
      throw `address cannot contains special characters`
    }
    city = helpers.checkString(city,'city');
    city = helpers.checkSpecialCharsAndNum(city,'city');
    state = helpers.checkString(state,'state');
    state = helpers.checkSpecialCharsAndNum(state,'state');
    if(typeof zipcode!=="string"){
      throw 'zipcode should be of type string'
    }
    
    zipcode = zipcode.trim();
    if(/^\d{5}(-\d{4})?$/.test(zipcode)) throw 'Please enter valid zipcode'
    if(typeof gmail!=="string"){
      throw 'gmail should be of type string'
    }
    
    gmail = gmail.trim();
    if(/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) throw 'Please enter valid gmail'
    const sameGamil = await userCollection.findOne({gmail:gmail});
    if(sameGamil){
      throw `Error : Already gmail exists with ${gmail}`
    }
  
    if(typeof mobileNumber!=="string"){
      throw 'mobileNumber should be of type string'
    }
    
    mobileNumber = mobileNumber.trim();
    if(/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
    const sameNumber = await userCollection.findOne({mobileNumber:mobileNumber});
    if(sameNumber){
      throw `Error : Already mobile number exists with ${sameNumber}`
    }
  
    country = helpers.checkString(country,'country');
    country = helpers.checkSpecialCharsAndNum(country,'country');
    bio = helpers.checkString(bio,'bio');
    if(/^[^a-zA-Z]+$/.test(bio)){
        throw 'Bio contains only numeric and special characters'
    }
    const saltRounds = 16;
  
    //const plainTextPassword = 'mySuperAwesomePassword';
    const hash = await bcrypt.hash(password, saltRounds);
    let newCook = {
      firstName : firstName,
      lastName : lastName,  
      username : username, 
      password: hash,
      gmail:gmail,
      mobileNumber:mobileNumber,
      bio:bio,
      location: {
          address: address,
          city: city,
          state: state,
          zipcode: zipcode,
          country: country,
          coordinates: { longitude: "", latitude: "" } //Calculated and stored?
      },
      dishes:[],
      avgRating:0,
      reviews:[]
      
    };
    //const productCollection = await users();
    const insertInfo = await userCollection.insertOne(newCook);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add User';
    
    const succ = {signupCompleted: true}
    return succ;
  
  
  };
  
