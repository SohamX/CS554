import { dishes } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers/pranHelpers.js';
import helper from '../helpers/helpers.js';
import { validateCuisineType, validateCost, checkisValidImageArray, validateId, validateUniqueDishesPerCook } from '../helpers/validationHelper.js';


export const getDishById = async (id) => {
    id = validateId(id, 'id');
    const dishCollection = await dishes();
    const existingDish = await dishCollection.findOne({ _id: ObjectId.createFromHexString(id) })
    if (existingDish === null) throw `No dish with id '${id}'.`;
    return existingDish;
};

export const getAllDishesByCookId = async (cookId) => {
    cookId = validateId(cookId, 'userId');
    const dishCollection = await dishes();
    const dishesByCookId = await dishCollection.find({ _id: ObjectId.createFromHexString(cookId) }).toArray();
    if (dishesByCookId === null) throw `No dishes with for cook '${cookId}'.`;
    return dishesByCookId;
};

export const addDish = async (
    cookId,
    name,
    description,
    cuisineType,
    cost,
    images
) => {
    const dishCollection = await dishes();
    if (!cookId || !name || !description || !cuisineType || !cost || !images) {
        throw "All fields need to be supplied";
    }
    cookId = validateId(cookId, 'cookId');
    name = helpers.checkString(name, 'dish name');
    description = helpers.checkString(description, 'description');
    cuisineType = helpers.checkString(cuisineType, 'cuisineType');
    cuisineType = validateCuisineType(cuisineType);
    //validate cost
    cost = validateCost(cost, 'cost');
    images = checkisValidImageArray(images, 'images');

    //check if dish already present for this cook
    validateUniqueDishesPerCook(cookId, name);

    let newDish = {
        cookId: cookId,
        name: name,
        description: description,
        cuisineType: cuisineType,
        cost: cost,
        images: images,
        rating: '-',
        createdAt: new Date().toUTCString(),
        isAvailable: true
    };

    const insertInfo = await dishCollection.insertOne(newDish);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add Dish';

    return insertInfo.acknowledged;

}

export const updateDish = async (
    id,
    cookId,
    name,
    description,
    cuisineType,
    cost,
    images,
    isAvailable
) => {
    id = validateId(id, 'id');
    cookId = validateId(cookId, 'cookId');

    //get existing dish   
    let existingDish = await getDishById(id);
    if (name) {
        name = helpers.checkString(name, 'dish name');
        existingDish.name = name;
        //check if dish already present for this cook
        validateUniqueDishesPerCook(cookId, name);
    }

    if (description) {
        description = helpers.checkString(description, 'description');
        existingDish.description = description;
    }

    if (cuisineType) {
        cuisineType = helpers.checkString(cuisineType, 'cuisineType');
        cuisineType = validateCuisineType(cuisineType);
        existingDish.cuisineType = cuisineType;
    }
    if (cost) {
        //validate cost
        cost = validateCost(cost, 'cost');
        existingDish.cost = cost;
    }

    if (images) {
        images = checkisValidImageArray(images, 'images');
        existingDish.images = images;
    }
    if (isAvailable) {
        existingDish.isAvailable = isAvailable;
    }

    let updateDish = await dishCollection.findOneAndReplace(
        { _id: ObjectId.createFromHexString(id) },
        existingDish,
        { returnDocument: 'after' });

    if (!updateDish) {
        throw 'could not update dish successfully';
    }
    return updateDish;

}

export const deleteDish = async (
    id
) => {
    id = validateId(id, 'id');
    const dishCollection = await dishes();
    const deletionInfo = await dishCollection.findOneAndDelete({
        _id: ObjectId.createFromHexString(id)
    });

    if (!deletionInfo) {
        throw `Could not delete dish with id of ${id}`;
    }
    let resObj = {
        "_id": id,
        "deleted": true
    }
    return resObj;
}