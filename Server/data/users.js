//import mongo collections, bcrypt and implement the following data functions
import {users,cooks,dishes} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers/pranHelpers.js'
import { checkisValidString, validateCardNumber, validateCvv, validateZipCode } from '../helpers/validationHelper.js';

import bcrypt from 'bcryptjs';
const dishCollection = await dishes();
const userCollection = await users();
const cookCollection = await cooks();
const saltRounds = 16;
export const registerUser = async (
  firstName,
  lastName,
  username,
  gmail,
  mobileNumber,
  address, //address mean just street address
  city,
  state,
  zipcode,
  country,
  latitude,
  longitude
) => {
  if(!firstName ||
    !lastName ||
    !username ||
    !address ||
  !city ||
  !state ||
  !zipcode ||
  !country ||
  !gmail||
  !mobileNumber ||
  !latitude ||
  !longitude
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
  // if(typeof password!=="string"){
  //   throw 'Password should be of type string'
  // }
  // password = password.trim()

  // if(password===""|| /\s/.test(password) || password.length<8){
  //   throw 'Password should not contains spaces and must be minimum 8 characters long'
  // }
  // if(!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(password) ){
  //   throw 'Password should contain at least one uppercase character and at least one number and there has to be at least one special character'
  // }
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
  if(!/^\d{5}(-\d{4})?$/.test(zipcode)) throw 'Please enter valid zipcode'
  if(typeof gmail!=="string"){
    throw 'gmail should be of type string'
  }

    // latitude_float = parseFloat(latitude.trim());
    let latitude_float = helpers.latitudeAndLongitude(latitude, 'Latitude')

    // longitude_float = parseFloat(longitude.trim());
    let longitude_float = helpers.latitudeAndLongitude(longitude, 'Longitude')
  
  
  gmail = gmail.trim();
  if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) throw 'Please enter valid gmail'
  const sameGamil = await userCollection.findOne({gmail:gmail});
  const sameCookGmail = await cookCollection.findOne({gmail:gmail});
  if(sameGamil||sameCookGmail){
    throw `Error : Already gmail exists with ${gmail}`
  }

  if(typeof mobileNumber!=="string"){
    throw 'mobileNumber should be of type string'
  }
  
  mobileNumber = mobileNumber.trim();
  if(!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
  const sameNumber = await userCollection.findOne({mobileNumber:mobileNumber});
  const sameCookNumber = await cookCollection.findOne({mobileNumber:mobileNumber});
  if(sameNumber||sameCookNumber){
    throw `Error : Already mobile number exists with ${sameNumber}`
  }

  country = helpers.checkString(country,'country');
  country = helpers.checkSpecialCharsAndNum(country,'country');

 // const saltRounds = 16;

  //const plainTextPassword = 'mySuperAwesomePassword';
  // const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName:firstName,
    lastName:lastName,  
    username:username, 
    
    role:"user",
    gmail:gmail,
    mobileNumber:mobileNumber,
    location: {
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        country: country,
        coordinates: { longitude: longitude_float, latitude: latitude_float} //Calculated and stored?
    },
    favourites : [],
    cart : {
      cookId : "",
      dishes : []
    },
    
    paymentCards : []
  };
  //const productCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add User';
  
  const createdUser = await userCollection.findOne({ _id: insertInfo.insertedId }, { projection: { paymentCards: 0 } });

  if (!createdUser) throw "Failed to retrieve the created user";

  return { signupCompleted: true, user: createdUser };


};

export const loginUser = async (gmail) => {
  if(!gmail){
    throw 'gmail must be supplied'
  }

  gmail = gmail.trim();
  if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) throw 'Please enter valid gmail'
  
  const userFound = await userCollection.findOne({gmail:gmail});
  const cookFound = await cookCollection.findOne({gmail:gmail});
  if(!userFound){
    if(cookFound){
        
        
          
          return cookFound;
        } 
    else{
        throw "No user or cook found with that gmail"
    }
  }else{
    

    

    
        const { paymentCards,...dataforsessions } = userFound
        return dataforsessions
    

  }
  

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
    country,
    latitude,
    longitude) => {
      if(!userId||!firstName ||
        !lastName ||
        !username ||
        !address ||
      !city ||
      !state ||
      !zipcode ||
      !country ||
      !gmail||
      !mobileNumber ||
      !latitude || 
      !longitude
      ){
          throw "Some fields cannot be empty"
        }
      userId = helpers.checkId(userId,'userId');
      const currUser = await userCollection.findOne({_id: new ObjectId(userId)});
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
      if(!/^\d{5}(-\d{4})?$/.test(zipcode)) throw 'Please enter valid zipcode'
      if(typeof gmail!=="string"){
        throw 'gmail should be of type string'
      }
      
      // latitude_float = parseFloat(latitude.trim());
      let latitude_float = helpers.latitudeAndLongitude(latitude, 'Latitude')
  
      // longitude_float = parseFloat(longitude.trim());
      let longitude_float = helpers.latitudeAndLongitude(longitude, 'Longitude')
  
      gmail = gmail.trim();
      if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) throw 'Please enter valid gmail'
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
      if(!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'
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
            country: country,
            coordinates : {
              longitude: longitude_float,
              latitude: latitude_float
            }
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
    
  export const getUserById = async(userId) =>{
    userId = helpers.checkId(userId,'userId');
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `Error: User does not exist`;
    }
    return user;
  }



//CART RELATED FUNCTIONS ADDING,DELETING,GET,UPDATE FOR USER





export const addItemtoCart = async (
  userId,
  dishId,
  
) => {
  if(!userId||!dishId){
    throw("All fields need to be supplied")
  }
  userId = helpers.checkId(userId, 'userId');
  dishId = helpers.checkId(dishId, 'dishId');
  //cookId = helpers.checkId(cookId, 'cookId');

  
  const user = await userCollection.findOne({_id: new ObjectId(userId)});
  if (!user) throw 'No user with that userId';
  const dish = await dishCollection.findOne({_id: new ObjectId(dishId)});
  if (!dish) throw 'No dish with that dishId';
  // const cook = await cookCollection.findOne({_id: new ObjectId(cookId)});
  // if (!cook) throw 'No cook with that cookId';
  dish.cookId = dish.cookId.toString();
  const cook = await cookCollection.findOne({_id:new ObjectId(dish.cookId)});
  
  if(user.cart.cookId!=="" && user.cart.cookId!==dish.cookId){
    throw("You can't add items from different cooks")
  }

  if(user.cart.cookId===""){
    const updatedCart = {
      cookId : dish.cookId,
      dishes : [{
        dishId : dishId,
        quantity : 1
      }]
    }
    const updatedUser = await userCollection.findOneAndUpdate({_id:new ObjectId(userId)},{$set:{cart:updatedCart}},{returnDocument:'after'});
    if(!updatedUser){
      throw("Item is not added")
    }
    
    updatedUser.cart.cookName = cook.username;
    updatedUser.cart.dishes[0].dishName = dish.name;
    updatedUser.cart.dishes[0].subTotat = dish.cost;
    updatedUser.cart.totalCost = dish.cost;

    return updatedUser;

  }

  else{
    let found = false;

    
    user.cart.dishes.forEach((item) => {
        if (item.dishId === dishId) {
            found = true;
            item.quantity += 1; 
        }
    });
    
    if (!found) {
        
        user.cart.dishes.push({
            dishId: dishId,
            quantity: 1
        });
   }

   const updatedUserData = await userCollection.findOneAndUpdate({_id:new ObjectId(userId)},{$set:{cart:user.cart}},{returnDocument:'after'});

    if(!updatedUserData){
      throw("Item is not added")
    }
    
    updatedUserData.cart.cookName = cook.username;

    for (const element of updatedUserData.cart.dishes) {
      let dish = await dishCollection.findOne({ _id: new ObjectId(element.dishId) });
      element.dishName = dish.name;
      element.subTotal = dish.cost * element.quantity;
    }

    // updatedUserData.cart.dishes.forEach(async(element)=>{
    //   let dish = await dishCollection.findOne({_id:new ObjectId(element.dishId)});
    //   console.log(dish);
    //   element.dishName = dish.name;
    //   element.subTotal = dish.cost*element.quantity;
      
    // })

    const totalCost = updatedUserData.cart.dishes.reduce((sum, element) => {
      return sum + element.subTotal;
    }, 0);
  
  
    updatedUserData.cart.totalCost = totalCost;  

    return updatedUserData.cart;
}};

export const getCartItems = async (userId) => {
  if(!userId){
    throw("userID need to be supplied")
  }
  userId = helpers.checkId(userId,'userId');
  const user = await userCollection.findOne({_id: new ObjectId(userId)});
  if (!user) throw 'No user with that userId';
  
  if(user.cart.cookId===""){
    return user.cart;
  }
  let cook = await cookCollection.findOne({_id:new ObjectId(user.cart.cookId)});
  user.cart.cookName = cook.username;
  for (const element of user.cart.dishes) {
    let dish = await dishCollection.findOne({ _id: new ObjectId(element.dishId) });
    element.dishName = dish.name;
    element.subTotal = dish.cost * element.quantity;
  }
  const totalCost = user.cart.dishes.reduce((sum, element) => {
    return sum + element.subTotal;
  }, 0);


  user.cart.totalCost = totalCost;  
  
  return user.cart;
};





export const getItem = async(itemId)=>{
  if(!itemId){
    throw("itemId need to be supplied")
  }
  itemId = helpers.checkId(itemId,'itemId');
  
  
  const foundItem = await userCollection.findOne(
    {'cart._id': new ObjectId(itemId)},
    {projection: {'cart.$': 1}}
  );
  if (!foundItem) throw 'Item Not found';
  //console.log(foundReview.reviews);
  return foundItem.cart[0];
}


export const updateItembyQuant = async (itemId) => {
  if(!itemId){
    throw("itemId need to be supplied")
  }
  itemId = helpers.checkId(itemId,'itemId');

  const item = await getItem(itemId);
  let newQuant = item.quantity+1;
  let newSubtotal = item.eachCost*newQuant;
  
  var newObject = {
    'cart.$.quantity': newQuant,
    'cart.$.subtotal': newSubtotal
  }
  const updatedItem = await userCollection.findOneAndUpdate({'cart._id': new ObjectId(itemId)}, {$set:newObject},{returnDocument:'after'});
  
  let sum = 0
  updatedItem.cart.forEach((element) => {
    sum += element.subtotal;    
  });

  const updatedCartTotal = await userCollection.findOneAndUpdate({_id: new ObjectId(updatedItem._id)}, {$set:{cartTotal:sum}},{returnDocument:'after'});
  
  
  return updatedCartTotal;
};

export const removeItemFromCart = async (itemId) => {
  if(!itemId){
    throw("itemId need to be supplied")
  }
  itemId = helpers.checkId(itemId,'itemId');
  
  const user = await userCollection.findOne({'cart._id': new ObjectId(itemId)});
  if(!user){
    throw("No item with that ID")
  }
  if(user.cart.length===1){
    await userCollection.findOneAndUpdate({'cart._id': new ObjectId(itemId)}, {$set:{cartTotal:0}});
  }
  else{
    let deleteSubTotal = 0;
    let sum = 0;
    user.cart.forEach((element) => {
      if(element._id.toString() === itemId){
        deleteSubTotal = element.subtotal;
        
      }
      sum+=element.subtotal; 
    });
    await userCollection.findOneAndUpdate({'cart._id': new ObjectId(itemId)}, {$set:{cartTotal:(sum-deleteSubTotal)}});
  }
  const removedreview=await userCollection.findOneAndUpdate(
    {'cart._id': new ObjectId(itemId)},
    {$pull: {cart: {_id: new ObjectId(itemId)}}},
    { returnDocument: "after" }
  );
  if(!removedreview){
    throw("Review is not deleted")
  }
  return {deleted:true};
};


export const addCardDetails = async (userId, type, provider, cardNumber, cardHolderName, expirationDate, cvv, zipcode, country, isDefault, nickName) => {
  if (!userId || !type || !provider || !cardNumber || !cardHolderName || !expirationDate || !cvv || !zipcode || !country || !isDefault) {
    throw ("All fields need to be supplied")
  }
  userId = helpers.checkId(userId, 'userId');
  if (typeof cardNumber !== 'string') throw `Error: ${cardNumber} must be a string!`;
  cardNumber = cardNumber.trim();
  let lastFourDigits = cardNumber.slice(-4);
  
  cardNumber = validateCardNumber(cardNumber, 'cardNumber');
  cardHolderName = helpers.checkString(cardHolderName, 'cardHolderName');
  cardHolderName = helpers.checkSpecialCharsAndNum(cardHolderName, 'cardHolderName');
  if (!helpers.isValidExpirationDate(expirationDate)) throw 'Your Card is Expired';
  if (typeof cvv !== 'string') throw `Error: ${cvv} must be a string!`;
  cvv = cvv.trim();
  cvv = validateCvv(cvv, 'cvv');
  if (typeof zipcode !== "string") {
    throw 'zipcode should be of type string'
  }
  
  zipcode = zipcode.trim();
  zipcode = validateZipCode(zipcode, 'zipcode');
  country = helpers.checkString(country, 'country');
  country = helpers.checkSpecialCharsAndNum(country, 'country');
  
  const hashcardNumber = await bcrypt.hash(cardNumber, saltRounds);
  const hashcvv = await bcrypt.hash(cvv, saltRounds);
  if (isDefault === "true") {
    isDefault = true;
  } else {
      isDefault = false;
    }
  if (nickName) {
    nickName = checkisValidString(nickName, 'nickName');
  }

  const carddetails = {
    _id: new ObjectId(),
    type: type,
    provider: provider,
    cardNumber: hashcardNumber,
    last4Digits: lastFourDigits,
    cardHolderName: cardHolderName,
    expirationDate: expirationDate,
    cvv: hashcvv,
    zipcode: zipcode,
    country: country,
    isDefault: isDefault,
    nickName: nickName ? nickName : ''
  };
  
  
  const updateInfo = await userCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, { $push: { paymentCards: carddetails } }, { returnDocument: 'after' });
  if (!updateInfo) {
    throw ("Card details not added")
  }
  return { added: true };
}

export const updateCardDetails = async (userId, cardId, cardHolderName, expirationDate, cvv, nickName, zipcode, country, isDefault) => {
  if (!userId || !cardId) {
    throw ("User ID and Payment Card ID must be provided");
  }

  userId = helpers.checkId(userId, 'userId');
  cardId = helpers.checkId(cardId, 'cardId');
  let existCard = getPayementMethodByUserIdCardId(userId, cardId);

  if (cardHolderName) {
    cardHolderName = helpers.checkString(cardHolderName, 'cardHolderName');
    cardHolderName = helpers.checkSpecialCharsAndNum(cardHolderName, 'cardHolderName');
    existCard.cardHolderName = cardHolderName;
  }

  if (expirationDate) {
    if (!helpers.isValidExpirationDate(expirationDate)) {
      throw 'Invalid Expiration Date';
    }
    existCard.expirationDate = expirationDate;
  }

  if (cvv) {
    if (typeof cvv !== 'string') throw `Error: ${cvv} must be a string!`;
    cvv = cvv.trim();
    cvv = validateCvv(cvv, 'cvv');
    const hashcvv = await bcrypt.hash(cvv, saltRounds);
    existCard.cvv = hashcvv;
  }

  if (zipcode) {
    if (typeof zipcode !== 'string') throw 'Zipcode should be of type string';
    zipcode = zipcode.trim();
    zipcode = validateZipCode(zipcode, 'zipcode');
    existCard.zipcode = zipcode;
  }

  if (country) {
    country = helpers.checkString(country, 'country');
    country = helpers.checkSpecialCharsAndNum(country, 'country');
    existCard.country = country;
  }

  if (isDefault !== undefined || isDefault !== null) {
    isDefault = isDefault === 'true';
    existCard.isDefault = isDefault;
  }
  if (nickName) {
    nickName = checkisValidString(nickName, 'nickName');
    existCard.nickName = nickName;
  }


  const updateFields = {};

  if (cardHolderName) updateFields['paymentCards.$.cardHolderName'] = existCard.cardHolderName;
  if (expirationDate) updateFields['paymentCards.$.expirationDate'] = existCard.expirationDate;
  if (cvv) updateFields['paymentCards.$.cvv'] = existCard.cvv;
  if (nickName) updateFields['paymentCards.$.nickName'] = existCard.nickName;
  if (zipcode) updateFields['paymentCards.$.zipcode'] = existCard.zipcode;
  if (country) updateFields['paymentCards.$.country'] = existCard.country;
  if (isDefault !== undefined) updateFields['paymentCards.$.isDefault'] = existCard.isDefault;

  const updateResult = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId), 'paymentCards._id': new ObjectId(cardId) },
    { $set: updateFields },
    { returnDocument: 'after' }
  );

  if (!updateResult) {
    throw ("Payment card details not updated");
  }

  return { updated: true, card: updateResult };
};

export const deleteCard = async (
  userId,
  id
) => {
  userId = helpers.checkId(userId, 'userId');
  id = helpers.checkId(id, 'id');
  let existCard = await getPayementMethodByUserIdCardId(userId, id);
  const updateResult = await userCollection.updateOne(
    { _id: ObjectId.createFromHexString(userId) },
    { $pull: { paymentCards: { _id: ObjectId.createFromHexString(id) } } }
  );
  if (!updateResult) {
    throw `Could not delete card with id of ${id}`;
  }
  let resObj = {
    "_id": id,
    "deleted": true
  }
  return resObj;
}

export const getAllPayementMethodByUserId = async (
  userId
) => {
  if (!userId) {
    throw ("User Id need to be supplied")
  }
  userId = helpers.checkId(userId, 'userId');
  const paymentMethods = await userCollection.find({ _id: ObjectId.createFromHexString(userId) }).project({ _id: 0, paymentCards: 1 }).toArray();
  if (paymentMethods === null || paymentMethods.length === 0 || paymentMethods[0].paymentCards === null || paymentMethods[0].paymentCards.length === 0) throw `No payment method added for User.`;
  return paymentMethods[0].paymentCards;
}

export const getPayementMethodByUserIdCardId = async (
  userId, id
) => {
  if (!userId) {
    throw ("User Id need to be supplied");
  }
  if (!id) {
    throw ("Card Id need to be supplied");
  }
  userId = helpers.checkId(userId, 'userId');
  id = helpers.checkId(id, 'cardId');
  const card = await userCollection.findOne({ _id: ObjectId.createFromHexString(userId), 'paymentCards._id': ObjectId.createFromHexString(id) },
    {
      projection: { _id: 0, 'paymentCards.$': 1 }
    }
  );
  console.log('card : ' + JSON.stringify(card));
  //const paymentMethods = await userCollection.find({ _id: ObjectId.createFromHexString(userId) }).project({ _id: 0, paymentCards: 1 }).toArray();
  if (card === null || card.length === 0 || card.paymentCards.length === 0 || card.paymentCards[0] === null) throw `No payment method added for User.`;
  return card.paymentCards[0];
}