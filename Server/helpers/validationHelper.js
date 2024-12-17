import { ObjectId } from "mongodb";
import { dishes } from '../config/mongoCollections.js';
import { cuisineType, S3UrlPattern, imageMagicUrlPattern, orderStatus, cardNumberPattern, cvvPattern, zipCodePattern } from './constants.js';
import { dishData } from '../data/index.js';

const validateCuisineType = (cuisineName) => {
    if (cuisineType.get(cuisineName) === undefined)
        throw new Error('Invalid cuisine type passed.');
    return cuisineName;
}

const validateOrderStatus = (status) => {
    if (orderStatus.get(status) === undefined)
        throw new Error('Invalid status type passed.');
    return status;
}

const validateCost = (cost, variable) => {
    if (typeof cost !== 'number' || isNaN(cost)) throw `${cost || 'provided variable'} for cost is not a number.`;
    if (cost <= 0) throw `Input '${variable || 'provided'}' of value ${cost || 'provided variable'} is not greater than zero.`;
    if (!(Number.isInteger(cost)) && cost.toString().split('.')[1].length > 2) throw `Input '${variable || 'provided'}' of value '${cost || 'provided variable'}' is not a valid input. It allows only 2 decimal points`;
    return cost;
};

const validateCloudUrl = (url, type) => {
    let regex = type == 'S3' ? S3UrlPattern : imageMagicUrlPattern;
    if (!(regex.test(url))) throw `'${type || 'provided'}' url is not valid.`;
    return url;
};

const checkisValidArray = (arr, variable) => {
    if (typeof arr !== 'object' || !(arr instanceof Array)) throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is not an array.`;
    if (arr.length == 0) throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is an empty array. It should contain at LEAST one element that's a valid string.`;
    return arr;
};

const checkisValidImageArray = (arr, variable) => {
    arr = checkisValidArray(arr, variable);
    for (let i in arr) {
        arr[i] = validateCloudUrl(arr[i], `${variable || 'provided'} array at index ${i}`);
    }
    return arr;
};

const checkisValidDishesArray = (arr, variable) => {
    arr = checkisValidArray(arr, variable);
    for (let i in arr) {
        arr[i] = validateCloudUrl(arr[i], `${variable || 'provided'} array at index ${i}`);
    }
    return arr;
};

const checkUndefinedOrNull = (obj, variable) => {
    if (obj === undefined || obj === null) throw `All fields need to have valid values. Input for '${variable || 'provided variable'}' param is undefined or null.`;
};

const checkisValidString = (str, variable) => {
    //check input type is string
    if (typeof str !== 'string') throw `Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is not a string.`;
    //empty string or has only spaces
    if ((str.replaceAll(/\s/g, '').length) === 0) throw `Input '${variable || 'provided'}' string of value '${str}' has just spaces or is an empty string.`;
    return str.trim();
};

const checkDishDesc = (str, variable) => {
    checkUndefinedOrNull(str, variable);
    str = checkisValidString(str, variable);
    str = str.trim();
    if (str.length < 2 || str.length > 150) throw `${variable} must be a non-empty string and length should be min 2 and max 150`;
    if (!isNaN(str))
        throw `Error: ${str} is not a valid value for ${variable} as it only contains digits`;
    return str;
};

const validateId = (id, variable) => {
    checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    return id;
};

const validateUniqueDishesPerCook = async (cookId, name) => {
    //get all dishes by cookId
    const dishCollection = await dishes();
    const existingDishesByCookId = await dishCollection.find({ cookId: ObjectId.createFromHexString(cookId) }).toArray();
    if (existingDishesByCookId && existingDishesByCookId.length > 0) {
        for (const i in existingDishesByCookId) {
            let currDish = existingDishesByCookId[i];
            if (currDish && currDish.name === name) {
                throw `A dish with the same name exist. Cannot create duplicate dishes.`;
            }
        }
    }
}

const checkisInteger = (int, variable) => {
    //int = int.trim();
    if (!(Number.isInteger(int)) || int <= 0) throw `Input '${variable || 'provided'}' of value ${int || 'provided variable'} is not a positive whole number.`;
    return int;
};

const validateDishesList = async (dishes, fromRoute) => {

    if (dishes && dishes.length > 0) {
        for (const i in dishes) {
            let currDish = dishes[i];
            currDish.dishId = validateId(currDish.dishId, 'dishId');
            if (fromRoute)
                currDish.quantity = parseInt(currDish.quantity);
            currDish.quantity = checkisInteger(currDish.quantity, 'quantity');
            await dishData.getDishById(currDish.dishId);
        }
    }
}
let checkisValidBoolean = (bool, variable) => {
    if (typeof bool !== 'boolean') throw `Input '${variable || 'provided'}' of value ${bool || 'provided'} is not a boolean.`;
    return bool;
};

const errorMsg = (e) => {
    return { error: e.message ? e.message : e }
}

const validateCardNumber = (cardNumber, variable) => {
    if (!(cardNumberPattern.test(cardNumber))) throw `Please enter valid card number.`;
    return cardNumber;
};

const validateCvv = (cvv, variable) => {
    if (!(cvvPattern.test(cvv))) throw `Please enter valid cvv.`;
    return cvv;
};

const validateZipCode = (zipcode, variable) => {
    if (!(zipCodePattern.test(zipcode))) throw `Please enter valid zipcode.`;
    return zipcode;
};

export {
    validateCuisineType, validateCost, checkisValidImageArray, validateId, checkisValidBoolean, validateOrderStatus, checkisValidString,
    validateUniqueDishesPerCook, checkisValidDishesArray, validateDishesList, validateCloudUrl, checkDishDesc, errorMsg, validateCardNumber,
    validateCvv, validateZipCode
}