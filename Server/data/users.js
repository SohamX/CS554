//import mongo collections, bcrypt and implement the following data functions
import { users, cooks, dishes } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();
import helpers from '../helpers/pranHelpers.js'
import { checkisValidString, validateCardNumber, validateCvv, validateZipCode } from '../helpers/validationHelper.js';

import bcrypt from 'bcryptjs';
import { console } from 'inspector';
const dishCollection = await dishes();
const userCollection = await users();
const cookCollection = await cooks();
const saltRounds = 16;

const aesKey = Buffer.from(process.env.AES_KEY, 'hex');
const iv = Buffer.from(process.env.IV, 'hex');//crypto.randomBytes(16);

function encrypt(plainText) {
  console.log('encrypt 1');
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  console.log('encrypt 2');
  let encrypted = cipher.update(plainText, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText, ivHex) {
  //const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

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
  
  const sameUsername = await userCollection.findOne({username: { $regex: new RegExp(`^${username}$`, 'i') } });
  const sameCookname = await cookCollection.findOne({username: { $regex: new RegExp(`^${username}$`, 'i') } });
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



  export const updateUser = async (userId,updateData) => {
    if (!userId) {
      throw "User ID cannot be empty";
    } 
    userId = helpers.checkId(userId,'userId');
    const currUser = await userCollection.findOne({_id: new ObjectId(userId)});
    if(!currUser){
      throw 'No user with that ID';
    } 
    if(!updateData.firstName &&
      !updateData.lastName &&
      !updateData.username &&      
      !updateData.address &&
      !updateData.city &&
      !updateData.state &&
      !updateData.zipcode &&
      !updateData.country &&
      !updateData.mobileNumber&&
      !updateData.latitude &&
      !updateData.longitude
      )
    {
      throw "All fields cannot be empty"
    }

    const updatedUserData = {};
    if (updateData.firstName) {
      updatedUserData.firstName = helpers.checkString(updateData.firstName, 'firstName');
      updatedUserData.firstName = helpers.checkSpecialCharsAndNum(updatedUserData.firstName, 'firstName');
    }
    if (updateData.lastName) {
      updatedUserData.lastName = helpers.checkString(updateData.lastName, 'lastName');
      updatedUserData.lastName = helpers.checkSpecialCharsAndNum(updatedUserData.lastName, 'lastName');
    }
    if (updateData.username) {
      updatedUserData.username = helpers.checkString(updateData.username, 'username');
      updatedUserData.username = helpers.checkSpecialCharsAndNum(updatedUserData.username, 'username');
      if (updatedUserData.username.length < 5 || updatedUserData.username.length > 10) {
        throw 'Username should be at least 5 characters long with a max of 10 characters';
      }
      if (currUser.username !== updatedUserData.username) {
        const matchedCount = await userCollection.countDocuments({ username: { $regex: new RegExp(`^${updatedUserData.username}$`, 'i') } });
        const cookMatched = await cookCollection.countDocuments({ username: { $regex: new RegExp(`^${updatedUserData.username}$`, 'i') } });
        if (matchedCount > 1 || cookMatched > 0) {
          throw 'Username already exists';
        }
      }
    }
    if (updateData.address) {
      updatedUserData['location.address'] = helpers.checkString(updateData.address, 'address');
      if (/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(updatedUserData['location.address'])) {
        throw 'Address cannot contain special characters';
      }
    }
    if (updateData.city) {
      updatedUserData['location.city'] = helpers.checkString(updateData.city, 'city');
      updatedUserData['location.city'] = helpers.checkSpecialCharsAndNum(updatedUserData['location.city'], 'city');
    }
    if (updateData.state) {
      updatedUserData['location.state'] = helpers.checkString(updateData.state, 'state');
      updatedUserData['location.state'] = helpers.checkSpecialCharsAndNum(updatedUserData['location.state'], 'state');
    }
    if (updateData.zipcode) {
      if (typeof updateData.zipcode !== 'string') {
        throw 'Zipcode should be of type string';
      }
      updatedUserData['location.zipcode'] = updateData.zipcode.trim();
      if (!/^\d{5}(-\d{4})?$/.test(updatedUserData['location.zipcode'])) {
        throw 'Please enter a valid zipcode';
      }
    }
    if (updateData.country) {
      updatedUserData['location.country'] = helpers.checkString(updateData.country, 'country');
      updatedUserData['location.country'] = helpers.checkSpecialCharsAndNum(updatedUserData['location.country'], 'country');
    }
    if (updateData.latitude) {
      updatedUserData['location.coordinates.latitude'] = updateData.latitude;
      updatedUserData['location.coordinates.latitude'] = helpers.latitudeAndLongitude(updatedUserData['location.coordinates.latitude'], 'Latitude');
    }
    if (updateData.longitude) {
      updatedUserData['location.coordinates.longitude'] = updateData.longitude;
      updatedUserData['location.coordinates.longitude'] = helpers.latitudeAndLongitude(updatedUserData['location.coordinates.longitude'], 'Longitude');
    }
    if (updateData.mobileNumber) {
      if (typeof updateData.mobileNumber !== 'string') {
        throw 'Mobile number should be of type string';
      }
      updatedUserData.mobileNumber = updateData.mobileNumber.trim();
      if (!/^\d{3}-\d{3}-\d{4}$/.test(updatedUserData.mobileNumber)) {
        throw 'Please enter a valid mobile number in 000-000-0000 format';
      }
      if (currUser.mobileNumber !== updatedUserData.mobileNumber) {
        const matchedCount = await userCollection.countDocuments({ mobileNumber: updatedUserData.mobileNumber });
        const cookMatched = await cookCollection.countDocuments({ mobileNumber: updatedUserData.mobileNumber });
        if (matchedCount > 0 || cookMatched > 0) {
          throw 'Mobile number already exists';
        }
      }
    }
      
    const updateInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {$set: updatedUserData},
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
    updatedUser.cart.dishes[0].subTotal = dish.cost;
    updatedUser.cart.totalCost = dish.cost;

    return updatedUser.cart;

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


// export const updateItembyQuant = async (itemId) => {
//   if(!itemId){
//     throw("itemId need to be supplied")
//   }
//   itemId = helpers.checkId(itemId,'itemId');

//   const item = await getItem(itemId);
//   let newQuant = item.quantity+1;
//   let newSubtotal = item.eachCost*newQuant;
  
//   var newObject = {
//     'cart.$.quantity': newQuant,
//     'cart.$.subtotal': newSubtotal
//   }
//   const updatedItem = await userCollection.findOneAndUpdate({'cart._id': new ObjectId(itemId)}, {$set:newObject},{returnDocument:'after'});
  
//   let sum = 0
//   updatedItem.cart.forEach((element) => {
//     sum += element.subtotal;    
//   });

//   const updatedCartTotal = await userCollection.findOneAndUpdate({_id: new ObjectId(updatedItem._id)}, {$set:{cartTotal:sum}},{returnDocument:'after'});
  
  
//   return updatedCartTotal;
// };

// export const removeItemFromCart = async (itemId) => {
//   if(!itemId){
//     throw("itemId need to be supplied")
//   }
//   itemId = helpers.checkId(itemId,'itemId');
  
//   const user = await userCollection.findOne({'cart._id': new ObjectId(itemId)});
//   if(!user){
//     throw("No item with that ID")
//   }
//   if(user.cart.length===1){
//     await userCollection.findOneAndUpdate({'cart._id': new ObjectId(itemId)}, {$set:{cartTotal:0}});
//   }
//   else{
//     let deleteSubTotal = 0;
//     let sum = 0;
//     user.cart.forEach((element) => {
//       if(element._id.toString() === itemId){
//         deleteSubTotal = element.subtotal;
        
//       }
//       sum+=element.subtotal; 
//     });
//     await userCollection.findOneAndUpdate({'cart._id': new ObjectId(itemId)}, {$set:{cartTotal:(sum-deleteSubTotal)}});
//   }
//   const removedreview=await userCollection.findOneAndUpdate(
//     {'cart._id': new ObjectId(itemId)},
//     {$pull: {cart: {_id: new ObjectId(itemId)}}},
//     { returnDocument: "after" }
//   );
//   if(!removedreview){
//     throw("Review is not deleted")
//   }
//   return {deleted:true};
// };

export const emptyCart = async (userId) => {
  if (!userId) {
    throw ("userId need to be supplied")
  }
  userId = helpers.checkId(userId, 'userId');
  const user = await getUserById(userId);
  user.cart = {
    cookId: "",
    dishes: []
  }
  const updateInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: user },
    { returnDocument: 'after' }
  );
  if (!updateInfo)
    throw `Error: Update failed! Could not empty cart for user ${userId}`;
  return updateInfo;
};

export const duplicateCardCheckHelper = async (cards, cardNumber, cvv, expirationDate) => {
  //try {
  let decryptedcardNumber;
  let decryptedcvv;
  console.log('cards : ' + cards);
  for (let i = 0; i < cards.length; i++) {
    console.log('cardsi : ' + [i].cardNumber);
    decryptedcardNumber = decrypt(cards[i].cardNumber, iv);
    decryptedcvv = decrypt(cards[i].cvv, iv);
    console
    if ((cardNumber === decryptedcardNumber) && (cvv === decryptedcvv) && (expirationDate === cards[i].expirationDate)) {
      console.error("Card with the provided Card Number, CVV and Expiration Date is already present.");
      throw `Card with the provided Card Number, CVV and Expiration Date is already present.`;
    }
  }
  // } catch (e) {
  //   throw e;
  // }

};

export const duplicateCardCheck = async (userId, cardNumber, cvv, expirationDate) => {
  //duplicate card check
  console.log('duplicateCardCheck');
  let cards;
  try {
    cards = await getAllPayementMethodByUserId(userId);
  } catch (e) {
    if (e === 'No payment method added for User.') {
      console.log("No payment method found for the user. Continuing execution.");
      return;
    } else {
      throw e;
    }
  }
  //try {
  await duplicateCardCheckHelper(cards, cardNumber, cvv, expirationDate);
  // } catch (e) {
  //   throw e;
  // }
};


export const addCardDetails = async (userId, type, provider, cardNumber, cardHolderName, expirationDate, cvv, zipcode, country, nickName) => {
  if (!userId || !type || !provider || !cardNumber || !cardHolderName || !expirationDate || !cvv || !zipcode || !country) {
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
  
  //try {
  await duplicateCardCheck(userId, cardNumber, cvv, expirationDate);
  // } catch (e) {
  //   if (e.includes("Card with the provided Card Number")) {
  //     console.warn("Duplicate card detected. Returning error.");
  //     throw new Error(e); // Bubble up for caller to handle
  //   } else {
  //     console.error("Unexpected error during duplicate card check:", e);
  //     throw e;
  //   }
  // }


  zipcode = zipcode.trim();
  zipcode = validateZipCode(zipcode, 'zipcode');
  country = helpers.checkString(country, 'country');
  country = helpers.checkSpecialCharsAndNum(country, 'country');
  const encryptcardNumber = encrypt(cardNumber);

  const encryptcvv = encrypt(cvv);

  // console.log(isDefault);
  // if (isDefault === "true") {
  //   isDefault = true;
  // } else {
  //   isDefault = false;
  // }

  if (nickName) {
    nickName = checkisValidString(nickName, 'nickName');
  }

  const carddetails = {
    _id: new ObjectId(),
    type: type,
    provider: provider,
    cardNumber: encryptcardNumber,
    last4Digits: lastFourDigits,
    cardHolderName: cardHolderName,
    expirationDate: expirationDate,
    cvv: encryptcvv,
    zipcode: zipcode,
    country: country,
    // isDefault: isDefault,
    nickName: nickName ? nickName : ''
  };
  
  
  const updateInfo = await userCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, { $push: { paymentCards: carddetails } }, { returnDocument: 'after' });
  if (!updateInfo) {
    throw ("Card details not added")
  }
  return { added: true };
}

export const updateCardDetails = async (userId, cardId, cardHolderName, expirationDate, cvv, nickName, zipcode, country) => {
  if (!userId || !cardId) {
    throw ("User ID and Payment Card ID must be provided");
  }

  userId = helpers.checkId(userId, 'userId');
  cardId = helpers.checkId(cardId, 'cardId');
  let existCard = getPaymentMethodByUserIdCardId(userId, cardId);

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
    const hashcvv = encrypt(cvv);
    existCard.cvv = hashcvv;
  }
  if (cvv || expirationDate) {
    let cvvVal = cvv ? cvv : decrypt(existCard.cvv);
    let cardNumberVal = decrypt(existCard.cardNumber);
    await duplicateCardCheck(userId, cardNumberVal, cvvVal, expirationDate);
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

  // if (isDefault !== undefined || isDefault !== null) {
  //   isDefault = isDefault === 'true';
  //   existCard.isDefault = isDefault;
  // }
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
  //if (isDefault !== undefined) updateFields['paymentCards.$.isDefault'] = existCard.isDefault;

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
  let existCard = await getPaymentMethodByUserIdCardId(userId, id);
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

  if (paymentMethods === null || paymentMethods.length === 0 || paymentMethods[0].paymentCards === null || paymentMethods[0].paymentCards == [] || paymentMethods[0].paymentCards.length === 0) throw `No payment method added for User.`;
  return paymentMethods[0].paymentCards;
}

export const getPaymentMethodByUserIdCardId = async (
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
  //console.log('card : ' + JSON.stringify(card));
  //const paymentMethods = await userCollection.find({ _id: ObjectId.createFromHexString(userId) }).project({ _id: 0, paymentCards: 1 }).toArray();
  if (card === null || card.length === 0 || card.paymentCards.length === 0 || card.paymentCards[0] === null) throw `No payment method added for User.`;
  return card.paymentCards[0];
}




export const decreaseItemQuantity = async (userId, dishId) => {
  if (!userId || !dishId) {
    throw "All fields need to be supplied";
  }
  
  userId = helpers.checkId(userId, "userId");
  dishId = helpers.checkId(dishId, "dishId");

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) throw "No user with that userId";

  if (!user.cart || !user.cart.dishes || user.cart.dishes.length === 0) {
    throw "Cart is empty";
  }

  // Find the dish in the cart
  const dishIndex = user.cart.dishes.findIndex((item) => item.dishId === dishId);

  if (dishIndex === -1) {
    throw "Dish not found in the cart";
  }

  // Decrease the quantity
  user.cart.dishes[dishIndex].quantity -= 1;

  // If quantity is 0, remove the dish from the cart
  if (user.cart.dishes[dishIndex].quantity === 0) {
    user.cart.dishes.splice(dishIndex, 1);
  }

  // If no more dishes in the cart, reset cookId and totalCost
  if (user.cart.dishes.length === 0) {
    user.cart.cookId = "";
    user.cart.totalCost = 0;
  } else {
    // Recalculate subtotals and totalCost
    for (const element of user.cart.dishes) {
      const dish = await dishCollection.findOne({ _id: new ObjectId(element.dishId) });
      element.dishName = dish.name;
      element.subTotal = dish.cost * element.quantity;
    }

    user.cart.totalCost = user.cart.dishes.reduce((sum, element) => {
      return sum + element.subTotal;
    }, 0);
  }

  // Update the user's cart
  const updatedUserData = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { cart: user.cart } },
    { returnDocument: "after" }
  );
  
  if (!updatedUserData) {
    throw "Failed to update the cart";
  }
  
  return updatedUserData.cart;
};


export const deleteItemFromCart = async (userId, dishId) => {
  if (!userId || !dishId) {
    throw "All fields need to be supplied";
  }

  userId = helpers.checkId(userId, "userId");
  dishId = helpers.checkId(dishId, "dishId");

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) throw "No user with that userId";

  // Check if the cart is empty
  if (!user.cart || !user.cart.dishes || user.cart.dishes.length === 0) {
    throw "Cart is already empty!";
  }

  // Find the dish to remove
  const dishIndex = user.cart.dishes.findIndex((item) => item.dishId === dishId);
  if (dishIndex === -1) throw "Dish not found in the cart";

  // Remove the dish from the cart
  user.cart.dishes.splice(dishIndex, 1);

  // Check if the cart is now empty
  if (user.cart.dishes.length === 0) {
    // Reset the cart if no dishes remain
    user.cart = {
      cookId: "",
      cookName: "",
      dishes: [],
      totalCost: 0,
    };
  } else {
    // If dishes remain, update cookName and subTotal values
    const firstDish = await dishCollection.findOne({
      _id: new ObjectId(user.cart.dishes[0].dishId),
    });
    const cook = await cookCollection.findOne({
      _id: new ObjectId(firstDish.cookId),
    });

    user.cart.cookName = cook.username;

    for (const element of user.cart.dishes) {
      const dish = await dishCollection.findOne({
        _id: new ObjectId(element.dishId),
      });
      element.dishName = dish.name;
      element.subTotal = dish.cost * element.quantity;
    }

    // Calculate the total cost of the cart
    user.cart.totalCost = user.cart.dishes.reduce((sum, element) => {
      return sum + element.subTotal;
    }, 0);
  }

  // Update the user's cart in the database
  const updatedUser = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { cart: user.cart } },
    { returnDocument: "after" }
  );

  if (!updatedUser) {
    throw "Failed to update cart after deleting the item";
  }

  return updatedUser.cart;
};
