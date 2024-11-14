import { ObjectId } from "mongodb";
import { dishes } from '../config/mongoCollections.js';
import { cuisineType, S3UrlPattern, imageMagicUrlPattern } from './constants.js';

const validateCuisineType = (cuisineName) => {
    if (cuisineType.get(cuisineName) === undefined)
        throw new Error('Invalid cuisine type passed.');
    return cuisineName;
}

const validateCost = (cost, variable) => {
    if (typeof cost !== 'number' || isNaN(cost)) throw `${cost || 'provided variable'} for cost is not a number.`;
    if (cost <= 0) throw `Input '${variable || 'provided'}' of value ${cost || 'provided variable'} is not greater than zero.`;
    if (!(Number.isInteger(cost)) && num.toString().split('.')[1].length > 2) throw `Input '${variable || 'provided'}' of value '${cost || 'provided variable'}' is not a valid input. It allows only 2 decimal points`;
};

const validateImageUrl = (url, type) => {
    let regex = type == 'S3' ? S3UrlPattern : imageMagicUrlPattern;
    if (!(regex.test(url))) throw `'${type || 'provided'}' image url is not valid.`;
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
        arr[i] = validateImageUrl(arr[i], `${variable || 'provided'} array at index ${i}`);
    }
    return arr;
};

const checkisValidDishesArray = (arr, variable) => {
    arr = checkisValidArray(arr, variable);
    for (let i in arr) {
        arr[i] = validateImageUrl(arr[i], `${variable || 'provided'} array at index ${i}`);
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

const validateId = (id, variable) => {
    checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    return id;
};

const validateUniqueDishesPerCook = async (cookId, name) => {
    //get all dishes by cookId
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

export {
    validateCuisineType, validateCost, checkisValidImageArray, validateId,
    validateUniqueDishesPerCook, checkisValidDishesArray
}