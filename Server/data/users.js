//import mongo collections, bcrypt and implement the following data functions
import {users,cooks} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers/pranHelpers.js'
import bcrypt from 'bcryptjs';
const userCollection = await users();
const cookCollection = await cooks();
export const registerUser = async (
  firstName,
  lastName,
  username,
  password,
  gmail,
  mobileNumber,
  address, //address mean just street address
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
  
  const sameUsername = await userCollection.findOne({username:username});
  const sameCookname = await cookCollection.findOne({username:username});
  if(sameUsername || sameCookname){
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
  const sameCookGmail = await cookCollection.findOne({gmail:gmail});
  if(sameGamil||sameCookGmail){
    throw `Error : Already gmail exists with ${gmail}`
  }

  if(typeof mobileNumber!=="string"){
    throw 'mobileNumber should be of type string'
  }
  
  mobileNumber = mobileNumber.trim();
  if(/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
  const sameNumber = await userCollection.findOne({mobileNumber:mobileNumber});
  const sameCookNumber = await cookCollection.findOne({mobileNumber:mobileNumber});
  if(sameNumber||sameCookNumber){
    throw `Error : Already mobile number exists with ${sameNumber}`
  }

  country = helpers.checkString(country,'country');
  country = helpers.checkSpecialCharsAndNum(country,'country');

  const saltRounds = 16;

  //const plainTextPassword = 'mySuperAwesomePassword';
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName:firstName,
    lastName:lastName,  
    username:username, 
    password: hash,
    role:"user",
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
  
  const usernameFound = await userCollection.findOne({username:username});
  const cooknameFound = await cookCollection.findOne({username:username});
  if(!usernameFound){
    if(cooknameFound){
        let check = false;
        try {
            check = await bcrypt.compare(password, cooknameFound.password);
        } catch (error) {
            //no op
        }
        if (check) {
          const { password,...dataforsessions } = cooknameFound
          return dataforsessions
        } else {
            throw "Either the username or password is invalid"
        }
    }else{
        throw "Either the username or password is invalid"
    }
  }else{
    let compareToMatch = false;

    try {
        compareToMatch = await bcrypt.compare(password, usernameFound.password);
    } catch (e) {
        //no op
    }

    if (compareToMatch) {
        const { password,...dataforsessions } = usernameFound
        return dataforsessions
    } else {
        throw "Either the username or password is invalid"
    }

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
    
    const sameUsername = await userCollection.findOne({username:username});
    const sameCookname = await cookCollection.findOne({username:username});
    if(sameUsername || sameCookname ){
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
    const sameCookGamil = await cookCollection.findOne({gmail:gmail});
    if(sameGamil||sameCookGamil){
      throw `Error : Already gmail exists with ${gmail}`
    }
  
    if(typeof mobileNumber!=="string"){
      throw 'mobileNumber should be of type string'
    }
    
    mobileNumber = mobileNumber.trim();
    if(/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
    const sameNumber = await userCollection.findOne({mobileNumber:mobileNumber});
    const sameCookNumber = await cookCollection.findOne({mobileNumber:mobileNumber});
    if(sameNumber||sameCookNumber){
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
      role:"cook",
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
      availability: {
            days: [],  // E.g., ['Monday', 'Wednesday', 'Friday']
            hours: { start: "", end: ""}  // E.g., {"start": "10:00", "end": "20:00"}
        },
      earnings: 0,
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

  export const updateUser = async (userId, firstName,
    lastName,
    username,
    
    gmail,
    mobileNumber,
    address,
    city,
    state,
    zipcode,
    country) => {
      if(!userId||!firstName ||
        !lastName ||
        !username ||
        
        !address ||
      !city ||
      !state ||
      !zipcode ||
      !country ||
      !gmail||
      !mobileNumber
      ){
          throw "Some fields cannot be empty"
        }
      userId = helpers.checkId(userId,'userId');
      const currUser = await userCollection.findOne({_id:ObjectId(userId)});
      if(!currUser){
        throw 'No user with that ID';
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
      if(currUser.username!==username){
        const matchedCount = await userCollection.countDocuments({ username: username });
        const cookMatched =  await cookCollection.countDocuments({ username: username });
        if(matchedCount>0||cookMatched>0){
          throw 'Already username exists'
        }
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
      if(currUser.gmail!==gmail){
        const matchedCount = await userCollection.countDocuments({ gmail: gmail });
        const cookMatched =  await cookCollection.countDocuments({ gmail: gmail });
        if(matchedCount>0||cookMatched>0){
          throw 'Already gmail exists'
        } 
      }
      
    
      if(typeof mobileNumber!=="string"){
        throw 'mobileNumber should be of type string'
      }
      
      mobileNumber = mobileNumber.trim();
      if(/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
      if(currUser.mobileNumber!==mobileNumber){
        const matchedCount = await userCollection.countDocuments({ mobileNumber:mobileNumber });
        const cookMatched =  await cookCollection.countDocuments({ mobileNumber:mobileNumber });
        if(matchedCount>0||cookMatched>0){
          throw 'Already mobileNumber exists'
        } 
      }
    
      country = helpers.checkString(country,'country');
      country = helpers.checkSpecialCharsAndNum(country,'country');
    
      let updateduserData = {
        firstName:firstName,
        lastName:lastName,  
        username:username, 
        gmail:gmail,
        mobileNumber:mobileNumber,
        location: {
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
            country: country
        }
        
        
      };
      
      const updateInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(userId)},
        {$set: updateduserData},
        {returnDocument: 'after'}
      );
      if (!updateInfo)
        throw `Error: Update failed! Could not update post with productId ${productId}`;
      return updateInfo;
    
      
    }
  export const updateCook = async(userId, firstName,
    lastName,
    username,
    gmail,
    mobileNumber,
    address,
    city,
    state,
    zipcode,
    country) =>{
      if(!userId||!firstName ||
        !lastName ||
        !username ||
        !address ||
      !city ||
      !state ||
      !zipcode ||
      !country ||
      !gmail||
      !mobileNumber
      ){
          throw "Some fields cannot be empty"
        }
      userId = helpers.checkId(userId,'userId');
      const currUser = await cookCollection.findOne({_id:ObjectId(userId)});
      if(!currUser){
        throw 'No cook with that ID';
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
      if(currUser.username!==username){
        const matchedCount = await userCollection.countDocuments({ username: username });
        const cookMatched =  await cookCollection.countDocuments({ username: username });
        if(matchedCount>0||cookMatched>0){
          throw 'Already username exists'
        }
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
      if(currUser.gmail!==gmail){
        const matchedCount = await userCollection.countDocuments({ gmail: gmail });
        const cookMatched =  await cookCollection.countDocuments({ gmail: gmail });
        if(matchedCount>0||cookMatched>0){
          throw 'Already gmail exists'
        } 
      }
      
    
      if(typeof mobileNumber!=="string"){
        throw 'mobileNumber should be of type string'
      }
      
      mobileNumber = mobileNumber.trim();
      if(/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
      if(currUser.mobileNumber!==mobileNumber){
        const matchedCount = await userCollection.countDocuments({ mobileNumber:mobileNumber });
        const cookMatched =  await cookCollection.countDocuments({ mobileNumber:mobileNumber });
        if(matchedCount>0||cookMatched>0){
          throw 'Already mobileNumber exists'
        } 
      }
    
      country = helpers.checkString(country,'country');
      country = helpers.checkSpecialCharsAndNum(country,'country');
    
      let updateduserData = {
        firstName:firstName,
        lastName:lastName,  
        username:username, 
        gmail:gmail,
        mobileNumber:mobileNumber,
        location: {
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
            country: country
        }
        
        
      };
      
      const updateInfo = await cookCollection.findOneAndUpdate(
        {_id: new ObjectId(userId)},
        {$set: updateduserData},
        {returnDocument: 'after'}
      );
      if (!updateInfo)
        throw `Error: Update failed! Could not update post with productId ${productId}`;
      return updateInfo;
    


    }

  export const deleteUser = async(userId) =>{
    userId = helpers.checkId(userId,'userId');
    
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(userId)
    });

    if (!deletionInfo) {
      throw `Could not delete user Id of ${userId}`;
    }
    let deletedobj = {
      _id : deletionInfo._id,
      
    }
    deletedobj.deleted = new Boolean(true);
    return deletedobj;
  }
  export const deleteCook = async(userId) =>{
    userId = helpers.checkId(userId,'userId');
    
    const deletionInfo = await cookCollection.findOneAndDelete({
      _id: new ObjectId(userId)
    });

    if (!deletionInfo) {
      throw `Could not delete user Id of ${userId}`;
    }
    let deletedobj = {
      _id : deletionInfo._id,
      
    }
    deletedobj.deleted = new Boolean(true);
    return deletedobj;
  }
