import {mealReqs,users,cooks} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers/pranHelpers.js';
const mealReqsCollection = await mealReqs();
const userCollection = await users();
export const createMealreq = async (
    userId,
    noOfPeople,
    description,
    cuisineType,
    budget,
    requiredBy
  ) => {
    if (
        !userId ||
        !noOfPeople ||
        !description ||
        !cuisineType ||
        !budget ||
        !requiredBy
      ) {
        throw "All fields need to be supplied";
      }
      userId = helpers.checkId(userId, 'userId');
      description = helpers.checkString(description, 'description');
      description = helpers.checkSpecialCharsAndNum(description, 'description');
      cuisineType = helpers.checkString(cuisineType, 'cuisineType');
      cuisineType = helpers.checkSpecialCharsAndNum(cuisineType, 'cuisineType');
      noOfPeople = parseInt(noOfPeople, 10);
    if (isNaN(noOfPeople) || noOfPeople <= 4 || !Number.isInteger(noOfPeople)) {
    throw 'noOfPeople should be positive number and  minimum 5';
    }
    
    budget = parseInt(budget, 10);
    if (isNaN(budget) || budget <= 0 || !Number.isInteger(budget)) {
    throw 'Budget should be a positive number';
    }
    if (typeof requiredBy !== 'string') throw `Error: requiredBy date must be a string!`;
    requiredBy = requiredBy.trim();
    if(!helpers.isValidFutureDate(requiredBy)){
        throw 'Required By should be a valid future date in MM/DD/YYYY format and should not exceed 10 days from today'
    }

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
    throw `Error: Student does not exist`;
    }
    let newMealReq = {
        userId: userId,
        noOfPeople: noOfPeople,
        description: description,
        cuisineType: cuisineType,
        status:"open",
        budget: budget,
        requiredBy: new Date(requiredBy),
        createdAt : new Date(),
        responses : []
      };
    
      
      const insertInfo = await mealReqsCollection.insertOne(newMealReq);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add meal request';
      }
      await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: {
            mealRequested: new ObjectId(insertInfo.insertedId)
          }
        }
      );
      return { mealRequestCreated: true, requestId: insertInfo.insertedId };

    
    
}
