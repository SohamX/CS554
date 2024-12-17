// PLEASE DONT COMMENT OR REMOVE OTHERS HELPERS FILES,YOU CAN USE THIS OR CREATE YOUR OWN HELPERS FILE IN THIS FOLDER

import {ObjectId} from 'mongodb';

const exportedMethods = {
  isValidDate(dateString) {
  
    var regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    
    var dateParts = dateString.split('/');
    var month = parseInt(dateParts[0], 10);
    var day = parseInt(dateParts[1], 10);
    var year = parseInt(dateParts[2], 10);
    var date = new Date(year, month - 1, day);
    if(day===29 && month===2){
      return false;
    }
    var currentdate = new Date();

    if(date > currentdate)
    {
    
       return false;
    }
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
  },
  isValidFutureDate(dateString){
    var regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    
    var dateParts = dateString.split('/');
    var month = parseInt(dateParts[0], 10);
    var day = parseInt(dateParts[1], 10);
    var year = parseInt(dateParts[2], 10);
    var date = new Date(year, month-1, day);
    if(day===29 && month===2){
      return false;
    }
    var currentdate  = new Date()
    currentdate.setHours(0,0,0,0);
    //const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentdate.getDate() + 10);
  
    if(date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day && date > currentdate && date<=maxDate)
    {
    
      return true;
    }
    return false;
  },

  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (varName !== 'bio' && (strVal.length < 2 || strVal.length > 25)) throw `${varName} must be a non-empty string and length should be min 2 and max 25`;
    if (varName === 'bio' && (strVal.length < 2 || strVal.length > 200)) throw `${varName} must be a non-empty string and length should be min 2 and max 200`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },
  checkSpecialCharsAndNum(strVal,varName){
    if(/[@!#$%^&*()_+{}\[\]:;"'<>,.?~]/.test(strVal)){
      throw `${varName} contains special characters`
    }
    if(/\d/.test(strVal)){
      throw `${varName} contains digits`
    }
    return strVal;
  },
  isValidExpirationDate(expirationDate) {           //CARD expiration date Checker
    // Regular expression for MM/YY format
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!regex.test(expirationDate)) {
        return false; // Invalid format
    }

    // Extract month and year
    const [month, year] = expirationDate.split("/").map(Number);

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the year

    // Check if the date is in the future
    if (year > currentYear || (year === currentYear && month >= currentMonth)) {
        return true;
    }

    return false; // Date is in the past
},

  checkStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an a//We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are stringsrray of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  latitudeAndLongitude(num, varName) {
    if (num === undefined || num === null)
        throw `Error: ${varName || 'Provided parameter'} is null or undefined`;
    if (typeof num != 'number')
        throw `Error: ${varName || 'Provided parameter'} is not a number`;
    if (Number.isNaN(num))
        throw `Error: ${varName || 'Provided parameter'} is NaN`;
    let test = num.toString();
    let testArr = test.split('.');
    if (!testArr.length === 2)
        throw `Error: ${testArr.length} ${varName || 'Provided parameter'} must be a valid decimal`;
    if (varName === 'Latitude') {
      if (num > 90 || num < -90) throw `Error: ${varName || 'Provided parameter'} is out of range, the valid range is -90.000000 to 90.000000`
    } else if (varName === 'Longitude') {
      if (num > 180 || num < -180) throw `Error: ${varName || 'Provided parameter'} is out of range, the valid range is -180.000000 to 180.000000`
    }
    return num;
  },

  validateFloats(num, varName) {
    num = num.trim()
    let str = num.split('.');
    if (str.length > 2) throw `Error: Invalid ${varName}`
    if (str.length == 2 && (str[1].length > 2)) throw `Error: ${varName} should be upto 2 decimals` 

    const validNumberRegex = /^\d+(\.\d{1,2})?$/;
    if (!validNumberRegex.test(num)) throw `Error: Invalid ${varName}`
      
    let floatNum = parseFloat(num);
    return floatNum
  },

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const toRad = (value) => {
      return (value * Math.PI) / 180;
    };
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c/1000; // distance in KMs
  },

  beforeParseFloat(str) {
    return  /^-?\d+(\.\d+)?$/.test(str);
  }
};

export default exportedMethods;
