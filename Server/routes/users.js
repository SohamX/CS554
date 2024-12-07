import { Router } from "express";
import {userData} from '../data/index.js';
import helpers from '../helpers/pranHelpers.js'

const router = Router();


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
      country } = req.body;
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

        if(typeof mobileNumber!=="string"){
          throw 'mobileNumber should be of type string'
        }
        
        mobileNumber = mobileNumber.trim();
        if(!/^\d{3}-\d{3}-\d{4}$/.test(mobileNumber)) throw 'Please enter valid mobileNumber in 000-000-0000 format'

        country = helpers.checkString(country,'country');
        country = helpers.checkSpecialCharsAndNum(country,'country');
      }catch (e) {
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
        country);
    if (succ.signupCompleted) {
      res.status(200).json({ status: "success" });
    }
    else {
      res.status(500).json({ error: "Internal Server Error" });
    }

    } catch (error) {
      res.status(400).json({ error: error });
      return;
    }
  });


export default router;
