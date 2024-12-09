//import mongo collections, bcrypt and implement the following data functions
import {users,cooks,dishes} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers/pranHelpers.js'
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
  country
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
        coordinates: { longitude: "", latitude: "" } //Calculated and stored?
    },
    favourites : [],
    cart : [],
    cartTotal : 0,
    paymentCards : []
  };
  //const productCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add User';
  
  const createdUser = await userCollection.findOne({ _id: insertInfo.insertedId }, { projection: { password: 0 } });

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
  const cook = await cookCollection.findOne({_id:new ObjectId(dish.cookId)});

  const newItem = {
    _id: new ObjectId(),
    dishName : dish.name,
    cookName : cook.username,
    eachCost: dish.cost,
    quantity: 1,
    subtotal: dish.cost
  };
  
  const updateInfo = await userCollection.updateOne({_id: new ObjectId(userId)}, {$push: {cart: newItem}});
  
  if (!updateInfo)
    throw `Error: Update failed! Could not add the item for the user Id with userId ${userId}`;
  const userData = await userCollection.findOne({_id: new ObjectId(userId)});
  let sum = 0;
  userData.cart.forEach((element)=>{
    sum+=element.subtotal;
  })
  const addedItem = await userCollection.findOneAndUpdate({_id:new ObjectId(userId)},{$set:{cartTotal:sum}},{returnDocument:'after'});
  if(!addedItem){
    throw("Item is not added")
  }
  return addedItem;
};

export const getCartItems = async (userId) => {
  if(!userId){
    throw("userID need to be supplied")
  }
  userId = helpers.checkId(userId,'userId');
  const user = await userCollection.findOne({_id: new ObjectId(userId)});
  if (!user) throw 'No user with that userId';
  
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


export const addCardDetails = async (userId, type, provider, cardNumber, cardHolderName,expirationDate,cvv,zipcode,country,isDefault) => {
  if(!userId||!type||!provider||!cardNumber||!cardHolderName||!expirationDate||!cvv||!zipcode||!country||!isDefault){
    throw("All fields need to be supplied")
  }
  userId = helpers.checkId(userId, 'userId');
  if (typeof cardNumber !== 'string') throw `Error: ${cardNumber} must be a string!`;
  cardNumber = cardNumber.trim();
  
  if(!/^\d{16}$/.test(cardNumber)) throw 'Please enter valid card number';
  cardHolderName = helpers.checkString(cardHolderName, 'cardHolderName');
  cardHolderName = helpers.checkSpecialCharsAndNum(cardHolderName, 'cardHolderName');
  if(!helpers.isValidExpirationDate(expirationDate)) throw 'Your Card is Expired';
  if(typeof cvv !== 'string') throw `Error: ${cvv} must be a string!`;
  cvv = cvv.trim();
  if(!/^\d{3}$/.test(cvv)) throw 'Please enter valid cvv';
  if(typeof zipcode!=="string"){
    throw 'zipcode should be of type string'
  }
  
  zipcode = zipcode.trim();
  if(!/^\d{5}(-\d{4})?$/.test(zipcode)) throw 'Please enter valid zipcode'
  country = helpers.checkString(country,'country');
  country = helpers.checkSpecialCharsAndNum(country,'country');
  
  const hashcardNumber = await bcrypt.hash(cardNumber, saltRounds);
  const hashcvv = await bcrypt.hash(cvv, saltRounds);
  if(isDefault ==="true"){
    isDefault = true;}else{
      isDefault = false;
    }

  const carddetails = {
    _id: new ObjectId(),
    type: type,
    provider: provider,
    cardNumber: hashcardNumber,
    cardHolderName: cardHolderName,
    expirationDate: expirationDate,
    cvv: hashcvv,
    zipcode: zipcode,
    country: country,
    isDefault: isDefault
  };
  
  
  const updateInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(userId)}, {$push: {paymentCards: carddetails}}, {returnDocument: 'after'});
  if(!updateInfo){
    throw("Card details not added")
  }
  return {added:true};
}




