import { Router } from "express";
import { userData } from '../data/index.js';
import helpers from '../helpers/pranHelpers.js'
import { checkisValidString } from '../helpers/validationHelper.js';
import { errorMsg, validateCardNumber, validateCvv, validateZipCode } from '../helpers/validationHelper.js';
import { loginDetails } from "./middlewares.js";
import xss from 'xss';
import client from '../config/redisClient.js';
const router = Router();

//REGISTER USER ROUTE

router
  .route("/register")
  .post(async (req, res) => {
    let { firstName,
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
      longitude } = req.body;
      firstName = xss(firstName)
      lastName = xss(lastName)
      username = xss(username)
      gmail = xss(gmail)
      mobileNumber = xss(mobileNumber)
      address = xss(address)
      city = xss(city)
      state = xss(state)
      zipcode = xss(zipcode)
      country = xss(country)
     // bio = xss(bio)
      // latitude = xss(latitude)
      // longitude = xss(longitude)
      let latitude_float
      let longitude_float
    try {
      
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
            console.log(req.body)
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

        latitude_float = latitude
        latitude_float = helpers.latitudeAndLongitude(latitude_float, 'Latitude')
        
        longitude_float = longitude
        longitude_float = helpers.latitudeAndLongitude(longitude_float, 'Longitude')

        gmail = gmail.trim();
        if(!/^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(gmail)) throw 'Please enter valid gmail'

        if(typeof mobileNumber!=="string"){
          throw 'mobileNumber should be of type string'
        }
        
        mobileNumber = mobileNumber.trim();
        if(!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'

        country = helpers.checkString(country,'country');
        country = helpers.checkSpecialCharsAndNum(country,'country');
      }catch (e) {
          console.log(e);
          return res.status(400).json({error:e})
        }
    try {
      const succ = await userData.registerUser(firstName,
        lastName,
        username,
        gmail,
        mobileNumber,
        address, //address mean just street address
        city,
        state,
        zipcode,
        country,
        latitude_float,
        longitude_float);
    if (succ.signupCompleted) {
      await client.json.set(`user:${succ.user.gmail}`,'.',succ.user);
      res.status(200).json({ status: "success",user:succ.user });
    }
    else {
      res.status(500).json({ error: "Internal Server Error" });
    }

    } catch (error) {
      res.status(400).json({ error: error });
      return;
    }
  });

router.route('/login').post(loginDetails,async (req, res) => {     // AFTER LOGIN 
    let { gmail } = req.body;
    try {
      if(!gmail){
        throw 'gmail must be supplied'
      }
    
      gmail = gmail.trim();
      if(!/^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(gmail)) throw 'Please enter valid gmail'
    } catch (e) {
      return res.status(400).json({error:e});;
    }
    try {
      const data = await userData.loginUser(gmail);
      if(data.role==="user"){
        await client.json.set(`user:${gmail}`,'.',data);
      }else{
        await client.json.set(`cook:${gmail}`,'.',data);
      }
      res.status(200).json({ status: "success", data:data});
    } catch (e) {
      console.log(e, " here error");
      return res.status(404).json({error:e});
    }
  });
  

//GET USER BY ID ROUTE   


  router
  .route('/:id')
  .get(async (req, res) => {
      try {
          req.params.id = helpers.checkId(req.params.id, 'id URL Param');
      } catch (e) {
          res.status(400).json({error:e});
          return;
      }
      try {
          const user = await userData.getUserById(req.params.id);
          res.status(200).json({ status: "success", user: user });
      } catch (e) {
          res.status(404).json({error:e});
          return;
      }
  })
  //UPDATE USER BY ID ROUTE

  .put(async (req, res) => {
      try {
          req.params.id = helpers.checkId(req.params.id, 'id URL Param');
      } catch (e) {
          res.status(400).json({error:e});
          return;
      }

      const updateData = {};
      
      let {
        firstName,
        lastName,
        username,
        mobileNumber,
        address,
        city,
        state,
        zipcode,
        country,
        latitude,
        longitude } = req.body

        firstName = xss(firstName)
        lastName = xss(lastName)
        username = xss(username)
        mobileNumber = xss(mobileNumber)
        address = xss(address)
        city = xss(city)
        state = xss(state)
        zipcode = xss(zipcode)
        country = xss(country)
        // latitude = xss(latitude)
        // longitude = xss(longitude)

      try {
        if(!firstName &&
          !lastName &&
          !username &&      
          !address &&
          !city &&
          !state &&
          !zipcode &&
          !country &&
          !mobileNumber&&
          !latitude &&
          !longitude
          )
        {
          throw "All fields cannot be empty"
        }
        console.log(latitude)
        if(address||city||state||zipcode||country||latitude||longitude){
          await client.del(`home:dishes:${req.params.id}`);
        }
        if (firstName) {
          updateData.firstName = helpers.checkString(firstName, 'firstName');
          updateData.firstName = helpers.checkSpecialCharsAndNum(updateData.firstName, 'firstName');
        }
        if (lastName) {
          updateData.lastName = helpers.checkString(lastName, 'lastName');
          updateData.lastName = helpers.checkSpecialCharsAndNum(updateData.lastName, 'lastName');
        }
        if (username) {
          updateData.username = helpers.checkString(username, 'username');
          updateData.username = helpers.checkSpecialCharsAndNum(updateData.username, 'username');
          if (updateData.username.length < 5 || updateData.username.length > 10) {
            throw 'username should be at least 5 characters long with a max of 10 characters';
          }
        }
        if (address) {
          updateData.address = helpers.checkString(address, 'address');
          if (/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(updateData.address)) {
            throw 'address cannot contain special characters';
          }
        }
        if (city) {
          updateData.city = helpers.checkString(city, 'city');
          updateData.city = helpers.checkSpecialCharsAndNum(updateData.city, 'city');
        }
        if (state) {
          updateData.state = helpers.checkString(state, 'state');
          updateData.state = helpers.checkSpecialCharsAndNum(updateData.state, 'state');
        }
        if (zipcode) {
          if (typeof zipcode !== 'string') {
            throw 'zipcode should be of type string';
          }
          updateData.zipcode = zipcode.trim();
          if (!/^\d{5}(-\d{4})?$/.test(updateData.zipcode)) {
            throw 'Please enter a valid zipcode';
          }
        }
        if (latitude) {
          updateData.latitude = latitude;
          console.log(typeof updateData.latitude)
          updateData.latitude = helpers.latitudeAndLongitude(updateData.latitude, 'Latitude');
        }
        if (longitude) {
          updateData.longitude = longitude;
          updateData.longitude = helpers.latitudeAndLongitude(updateData.longitude, 'Longitude');
        }
        if (mobileNumber) {
          if (typeof mobileNumber !== 'string') {
            throw 'mobileNumber should be of type string';
          }
          updateData.mobileNumber = mobileNumber.trim();
          if (!/^\d{3}-\d{3}-\d{4}$/.test(updateData.mobileNumber)) {
            throw 'Please enter a valid mobileNumber in 000-000-0000 format';
          }
        }
        if (country) {
          updateData.country = helpers.checkString(country, 'country');
          updateData.country = helpers.checkSpecialCharsAndNum(updateData.country, 'country');
        }
      } catch (e) {
          return res.status(400).json({error:e})
      }

      try {
          const updateInfo = await userData.updateUser(req.params.id,updateData);
        if (updateInfo) {
          await client.json.set(`user:${updateInfo.gmail}`,'.',updateInfo);
          res.status(200).json({ status: "success", user: updateInfo });
        }
        else {
          res.status(500).json({ error: "Internal Server Error" });
        }

      } catch (e) {
        res.status(500).json({ error: e, message: e.message });
        return;
      }

  })


//DELETE USER BY ID ROUTE 

router
  .route('/delete/:id')
  .post(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id, 'id URL Param');
    } catch (e) {
      res.status(400).json({error:e});
      return;
    }
    try {
      const deletedobj = await userData.deleteUser(req.params.id);
      res.status(200).json(deletedobj);
    } catch (e) {
      res.status(404).json({error:e});
      return;
    }
  });


//ALL CART ROUTES

router
  .route('/cart/:userId')
  .get(async (req, res) => {
    try {
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
    } catch (e) {
      
      res.status(400).json({error:e});
      return;
    }
    try {
      const cart = await userData.getCartItems(req.params.userId);
      res.status(200).json({ status: "success", cart: cart });
    } catch (e) {
      console.log(e);
      res.status(404).json({error:e});
      return;
    }
  }) 
  //ADD ITEM TO CART ROUTE
router
  .route('/cart/add/:dishId/to/:userId/by/:quantity')
  .post(async (req, res) => {
    try {
      req.params.dishId = helpers.checkId(req.params.dishId, 'dishId URL Param');
      // req.params.cookId = helpers.checkId(req.params.cookId, 'cookId URL Param');
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
    } catch (e) {
      res.status(400).json({error:e});
      return;
    }
    try {
      
      const addedItem = await userData.addItemToCart(req.params.userId, req.params.dishId,parseInt(req.params.quantity));

      res.status(200).json({ status: "success", addedItem: addedItem });
    } catch (e) {
      res.status(404).json({error:e});
      return;
    }
  })
router
   .route('/cart/dec/:dishId/to/:userId')
   .post(async (req, res) => {
    try {
      req.params.dishId = helpers.checkId(req.params.dishId, 'dishId URL Param');
      // req.params.cookId = helpers.checkId(req.params.cookId, 'cookId URL Param');
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
    } catch (e) {
      res.status(400).json({error:e});
      return;
    }
    try {
      const decItem = await userData.decreaseItemQuantity(req.params.userId, req.params.dishId);
      res.status(200).json({ status: "success", decItem: decItem });
    } catch (e) {
      res.status(404).json({error:e});
      return;
    }
  })

router
    .route('/cart/rem/:dishId/to/:userId')
    .post(async(req,res)=>{
      try {
        req.params.dishId = helpers.checkId(req.params.dishId, 'dishId URL Param');
        // req.params.cookId = helpers.checkId(req.params.cookId, 'cookId URL Param');
        req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
      } catch (e) {
        res.status(400).json({error:e});
        return;
      }
      try {
        const remItem = await userData.deleteItemFromCart(req.params.userId, req.params.dishId);
        res.status(200).json({ status: "success", remItem: remItem });
      } catch (e) {
        res.status(404).json({error:e});
        return;
      }

    })
  //UPDATE ITEM QUANT ROUTE
// router.route('/cart/update/:itemId').post(async (req, res) => {
//     try {
//       req.params.itemId = helpers.checkId(req.params.itemId, 'itemId URL Param');
//     } catch (e) {
//       res.status(400).json({error:e});
//       return;
//     }
//     try {
//       const updatedCartTotal = await userData.updateItembyQuant(req.params.itemId);
//       res.status(200).json({ status: "success", updatedCartTotal: updatedCartTotal });
//     } catch (e) {
//       res.status(404).json({error:e});
//       return;
//     }
//   })

//   //DELETE ITEM FROM CART ROUTE
// router
//   .route('/cart/delete/:itemId')
//   .post(async (req, res) => {
//     try {
//       req.params.itemId = helpers.checkId(req.params.itemId, 'itemId URL Param');
//     } catch (e) {
//       res.status(400).json({error:e});
//       return;
//     }
//     try {
//       const statObj = await userData.removeItemFromCart(req.params.itemId);
//       res.status(200).json({ status: "success", statObj: statObj });
//     } catch (e) {
//       res.status(404).json({error:e});
//       return;
//     }
//   })

//ALL PAYMENT CARD ROUTES

router
  .route('/paymentCard/:userId')
  .get(async (req, res) => {
    try {
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
    } catch (e) {
      res.status(400).json(errorMsg(e));
      return;
    }
    try {
      const paymentMethodList = await userData.getAllPayementMethodByUserId(req.params.userId);
      res.status(200).json({ status: "success", paymentMethodList: paymentMethodList });
    } catch (e) {
      res.status(400).json(errorMsg(e));
      return;
    }

  })
  .post(async (req, res) => {
    let { type, provider, cardNumber, cardHolderName, expirationDate, cvv, zipcode, country, nickName } = req.body;
    type = xss(type);
    provider = xss(provider);
    cardNumber = xss(cardNumber);
    cardHolderName = xss(cardHolderName);
    expirationDate = xss(expirationDate);
    cvv = xss(cvv);
    zipcode = xss(zipcode);
    country = xss(country);
    nickName = xss(nickName);
    try {
      if (!type || !provider || !cardNumber || !cardHolderName || !expirationDate || !cvv || !zipcode || !country) {
        throw ("All fields need to be supplied")
      }
      
      if (typeof cardNumber !== 'string') throw `Error: ${cardNumber} must be a string!`;
      cardNumber = cardNumber.trim();
      cardNumber = validateCardNumber(cardNumber, 'cardNumber');
      //if (!/^\d{16}$/.test(cardNumber)) throw 'Please enter valid card number';
      cardHolderName = helpers.checkString(cardHolderName, 'cardHolderName');
      cardHolderName = helpers.checkSpecialCharsAndNum(cardHolderName, 'cardHolderName');
      if (!helpers.isValidExpirationDate(expirationDate)) throw 'Your Card is Expired';
      if (typeof cvv !== 'string') throw `Error: ${cvv} must be a string!`;
      cvv = cvv.trim();
      cvv = validateCvv(cvv, 'cvv');
      //if (!/^\d{3}$/.test(cvv)) throw 'Please enter valid cvv';
      if (typeof zipcode !== "string") {
        throw 'zipcode should be of type string'
      }
      
      zipcode = zipcode.trim();
      zipcode = validateZipCode(zipcode, 'zipcode');
      //if (!/^\d{5}(-\d{4})?$/.test(zipcode)) throw 'Please enter valid zipcode'
      country = helpers.checkString(country, 'country');
      country = helpers.checkSpecialCharsAndNum(country, 'country');
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');

      if (nickName) {
        nickName = checkisValidString(nickName, 'nickName');
      }
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }
    try {
      const statObj = await userData.addCardDetails(req.params.userId, type, provider, cardNumber, cardHolderName, expirationDate, cvv, zipcode, country, nickName);
      res.status(200).json({ status: "success" });
    } catch (e) {
      console.error("Card with the provided Card Number, CVV and Expiration Date is already present." + JSON.stringify(errorMsg(e)));
      res.status(400).json(errorMsg(e));
      return;
    }
  })


router
  .route('/paymentCard/:userId/:id')
  .patch(async (req, res) => {
    //const { id, userId } = req.params;
    let { cardHolderName, expirationDate, cvv, zipcode, country, nickName } = req.body;
    cardHolderName = xss(cardHolderName);
    expirationDate = xss(expirationDate);
    cvv = xss(cvv);
    zipcode = xss(zipcode);
    country = xss(country);
    nickName = xss(nickName);

    console.log('HERE 1' + JSON.stringify(req.body));
    try {
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
      req.params.id = helpers.checkId(req.params.id, 'cardId URL Param');
      let existCard = userData.getPaymentMethodByUserIdCardId(req.params.userId, req.params.id);
      if (!cardHolderName || !expirationDate || !cvv || !zipcode || !country || !nickName) {
        throw 'At least one field must be updated';
      }
      if (cardHolderName) {
        cardHolderName = helpers.checkString(cardHolderName, 'cardHolderName');
        cardHolderName = helpers.checkSpecialCharsAndNum(cardHolderName, 'cardHolderName');
      }
      if (expirationDate && !helpers.isValidExpirationDate(expirationDate)) {
        throw 'Invalid expiration date';
      }
      if (cvv) {
        if (typeof cvv !== 'string') throw `Error: CVV must be a string!`;
        cvv = cvv.trim();
        cvv = validateCvv(cvv, 'cvv');
      }
      if (zipcode) {
        if (typeof zipcode !== 'string') throw 'Zipcode should be of type string';
        zipcode = zipcode.trim();
        zipcode = validateZipCode(zipcode, 'zipcode');
      }
      if (country) {
        country = helpers.checkString(country, 'country');
        country = helpers.checkSpecialCharsAndNum(country, 'country');
      }
      if (nickName) {
        nickName = helpers.checkString(nickName, 'nickName');
      }
      // if (isDefault !== undefined && typeof isDefault !== 'boolean') {
      //   throw 'isDefault must be a boolean';
      // }
     console.log('HERE 3' + JSON.stringify(req.body));
      const updatedCard = await userData.updateCardDetails(req.params.userId, req.params.id, cardHolderName, expirationDate, cvv, nickName, zipcode, country);
      console.log('After DB call' + JSON.stringify(req.body));
      return res.status(200).json({
        status: 'success',
        message: 'Card details updated successfully',
        updatedCard
      });

    } catch (e) {
      console.log('Inside Catch block' + JSON.stringify(req.body));
      return res.status(400).json(errorMsg(e));
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.userId = helpers.checkId(req.params.userId, 'userId URL Param');
      req.params.id = helpers.checkId(req.params.id, 'cardId URL Param');

      const deleteCard = await userData.deleteCard(req.params.userId, req.params.id);
      return res.status(200).json({ status: "success", dish: deleteCard });
    } catch (e) {
      return res.status(400).json(errorMsg(e));
    }
  });


  


export default router;
