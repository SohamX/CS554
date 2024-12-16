import { dishes,cooks } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers/pranHelpers.js';
import { validateCuisineType, validateCost, checkisValidImageArray, validateId, validateUniqueDishesPerCook, checkDishDesc } from '../helpers/validationHelper.js';

const cookCollection = await cooks();
export const getDishById = async (id) => {
    id = validateId(id, 'id');
    const dishCollection = await dishes();
    const existingDish = await dishCollection.findOne({ _id: ObjectId.createFromHexString(id) })
    if (existingDish === null) throw `No dish with id '${id}'.`;
    const cook = await cookCollection.findOne({_id:existingDish.cookId})
    existingDish.cookName = cook.username;
    return existingDish;
};

export const getAvailableDishes = async (id) => {
    const dishCollection = await dishes();

    //get all available cooks
    const availableCooks = await cookCollection.find().toArray();

    //get all the dishes that are available
    const existingDishes = await dishCollection.find({ isAvailable: true}).toArray();

    let returnDishes = [];
    
    // filter dishes only whose cooks are available
    for(const dish of existingDishes){
        for(const cook of availableCooks){
            if(dish.cookId.toString() === cook._id.toString() && cook.availability) {
                dish.cookName = cook.username
                returnDishes.push(dish)
                console.log(dish.name)
            }
        }
    }

    return returnDishes;
};

export const getAllDishesByCookId = async (cookId) => {
    cookId = validateId(cookId, 'userId');
    const dishCollection = await dishes();
    const dishesByCookId = await dishCollection.find({ cookId: ObjectId.createFromHexString(cookId) }).toArray();
    if (dishesByCookId === null) throw `No dishes with for cook '${cookId}'.`;
    return dishesByCookId;
};

export const addDish = async (
    cookId,
    name,
    description,
    cuisineType,
    cost,
    imageName
    // ,
    // images
) => {
    const dishCollection = await dishes();
    if (!cookId || !name || !description || !cuisineType || !cost) {// || !images
        throw "All fields need to be supplied";
    }
    cookId = validateId(cookId, 'cookId');
    name = helpers.checkString(name, 'dish name');
    description = checkDishDesc(description, 'description');
    cuisineType = helpers.checkString(cuisineType, 'cuisineType');
    cuisineType = validateCuisineType(cuisineType);
    //validate cost
    cost = validateCost(cost, 'cost');
    //images = checkisValidImageArray(images, 'images');

    //check if dish already present for this cook
    await validateUniqueDishesPerCook(cookId, name);

    let newDish = {
        cookId: ObjectId.createFromHexString(cookId),
        name: name,
        description: description,
        cuisineType: cuisineType,
        cost: cost,
        //images: images,
        rating: '-',
        createdAt: new Date().toUTCString(),
        isAvailable: true,
        imageName: imageName
    };

    const insertInfo = await dishCollection.insertOne(newDish);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add Dish';

    let cooksDetails = await cookCollection.findOne({ _id: new ObjectId(cookId) });
    if (!cooksDetails) {
      throw `Could not find cook to add dish to their profile`;
    }
    cooksDetails.dishes.push(new ObjectId(insertInfo.insertedId))

    const insertDishToCooksPage = await cookCollection.updateOne({ _id: new ObjectId(cookId) }, { $set: cooksDetails })
    if (!insertDishToCooksPage.acknowledged) throw `Could not add dish to cooks details`

    return insertInfo;
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
    const dishCollection = await dishes();
    id = validateId(id, 'id');
    cookId = validateId(cookId, 'cookId');

    //get existing dish   
    let existingDish = await getDishById(id);
    if (name && existingDish.name != name.trim()) {
        name = helpers.checkString(name, 'dish name');
        existingDish.name = name;
        //check if dish already present for this cook
        await validateUniqueDishesPerCook(cookId, name);
    }

    if (description) {
        description = checkDishDesc(description, 'description');
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
    if (isAvailable != null) {
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
    const dish = await getDishById(id);
    const deletionInfo = await dishCollection.findOneAndDelete({
        _id: ObjectId.createFromHexString(id)
    });

    if (!deletionInfo) {
        throw `Could not delete dish with id of ${id}`;
    } else {
        const removeDishFromCooksPage = await cookCollection.updateMany({}, { $pull: { dishes: new ObjectId(id) } })
        if (!removeDishFromCooksPage.acknowledged) throw `Could not delete dish from cooks details`
    }
    let resObj = {
        "_id": id,
        "deleted": true,
        "imageName": dish.imageName
    }
    return resObj;
}

export const searchQuery = async (
  dish,
  cuisine,
  location,
  minPrice,
  maxPrice
) => {
  const dishCollection = await dishes();
  if (cuisine.trim() !== "") {
    cuisine = helpers.checkString(cuisine, "cuisine");
    cuisine = validateCuisineType(cuisine);
  }

  if (minPrice) {
    if (typeof minPrice != "number") throw `Error: min price is not a number`;
    if (Number.isNaN(minPrice)) throw `Error: min price is not a number`;
  }

  if (maxPrice) {
    if (typeof maxPrice != "number") throw `Error: max price is not a number`;
    if (Number.isNaN(maxPrice)) throw `Error: max price is not a number`;
  }

  if (minPrice && maxPrice && minPrice > maxPrice) throw `Error: Min price cannot be greater than Max price`

  //location validation to be implemented

  let query = {};
  if (cuisine.trim() !== "")
    query["cuisineType"] = { $regex: cuisine, $options: "i" };
  if (dish.trim() !== "") query["name"] = { $regex: dish, $options: "i" };
  if (minPrice) {
    query["cost"] = {};
    query["cost"].$gte = minPrice;
  }
  if (maxPrice) {
    query["cost"] = query["cost"] || {}; 
    query["cost"].$lte = maxPrice;
  }
  let results;
  results = await dishCollection.find(query).toArray();
  return results;
};
