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
        status:"pending",
        budget: budget,
        requiredBy: new Date(requiredBy),
        createdAt : new Date(),
        responses : []
      };
    
      
      const insertInfo = await mealReqsCollection.insertOne(newMealReq);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add meal request';
      }
      
      return { mealRequestCreated: true, requestId: insertInfo.insertedId };

    
    
}

export const updateExpiredMealRequests = async () => {
  const currentDate = new Date();

  await mealReqsCollection.updateMany(
    { 
      requiredBy: { $lt: currentDate }, 
      status: "pending"                
    },
    { 
      $set: { status: "noResponse" }  
    }
  );
};

export const updateCompletedMealRequests = async () => {
  const currentDate = new Date();

  await mealReqsCollection.updateMany(
    { 
      requiredBy: { $lt: currentDate }, 
      status: "accepted"                
    },
    { 
      $set: { status: "completed" }   
    }
  );
};

export const getPendingMealReqsByUser = async (userId) => {
  
  userId = helpers.checkId(userId, 'userId');
  
  await updateExpiredMealRequests();
  const pendingMealReqs = await mealReqsCollection.find({
      userId: userId,
      status: 'pending'
  }).toArray();

  
  if (!pendingMealReqs || pendingMealReqs.length === 0) {
      throw `No pending meal requests found for user with ID '${userId}'`;
  }

  
  return pendingMealReqs;
};


export const getAcceptedMealReqsByUser = async (userId) => {
  
  userId = helpers.checkId(userId, 'userId');
  
  await updateCompletedMealRequests();
  const acceptedMealReqs = await mealReqsCollection
    .find({
      userId: userId,
      status: 'accepted',
    })
    .toArray();

  if (!acceptedMealReqs || acceptedMealReqs.length === 0) {
    throw `No accepted meal requests found for user with ID '${userId}'`;
  }

  
  const enrichedMealReqs = acceptedMealReqs.map((mealReq) => {
    const acceptedResponse = mealReq.responses.find(
      (response) => response.selectedByUser === true
    );
    return {
      ...mealReq,
      acceptedCookId: acceptedResponse.cookId
    };
  });

  return enrichedMealReqs;
};

export const getResponsesForMealReq = async (mealReqId) => {
  
  mealReqId = helpers.checkId(mealReqId, 'mealReqId');

  
  const mealRequest = await mealReqsCollection.findOne({ _id: new ObjectId(mealReqId) });

  
  if (!mealRequest) {
      throw `No meal request found with ID '${mealReqId}'`;
  }

  
  return mealRequest.responses;
};

export const acceptMealRequest = async (mealReqId, cookId) => {
  mealReqId = helpers.checkId(mealReqId, 'mealReqId');
  cookId = helpers.checkId(cookId, 'cookId');

  const updateInfo = await mealReqsCollection.updateOne(
      { _id: new ObjectId(mealReqId) },
      {
        $set: { 
            status: "accepted",
            "responses.$[cook].selectedByUser": true
        }
    },
      { arrayFilters: [{ "cook.cookId": new ObjectId(cookId) }] }
  );

  if (!updateInfo.modifiedCount) {
      throw `Error: Could not accept the meal request for cook with ID '${cookId}'`;
  }

  return { statusUpdated: true, mealReqId, cookId };
};

export const addResponseToMealReq = async (mealReqId, cookId) => {
  
  mealReqId = helpers.checkId(mealReqId, 'mealReqId');
  cookId = helpers.checkId(cookId, 'cookId');
  // message = helpers.checkString(message, 'message');
  // priceOffer = parseFloat(priceOffer);

  // if (isNaN(priceOffer) || priceOffer <= 0) {
  //   throw 'Price offer must be a positive number';
  // }

  
  const newResponse = {
    cookId: new ObjectId(cookId),
    responseDate: new Date(), 
    selectedByUser: false 
  };

  
  const updateResult = await mealReqsCollection.updateOne(
    { _id: new ObjectId(mealReqId) },
    {
      $push: { responses: newResponse }
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw 'Could not add response to the meal request';
  }

  return { responseAdded: true };
};


export const getAcceptedMealReqsByCook = async (cookId) => {
  
  cookId = helpers.checkId(cookId, 'cookId');

  await updateCompletedMealRequests();
  const acceptedMealReqs = await mealReqsCollection
    .find({
      status: "accepted",
      "responses": { $elemMatch: { cookId: new ObjectId(cookId), selectedByUser: true } }
    })
    .toArray();

  if (acceptedMealReqs.length === 0) {
    throw `No accepted meal requests found for cook with ID ${cookId}`;
  }

  return acceptedMealReqs;
};

export const getPendingMealReqsByCook = async (cookId) => {
  
  cookId = helpers.checkId(cookId, 'cookId');

  await updateExpiredMealRequests();
  const pendingMealReqs = await mealReqsCollection
    .find({
      status: "pending",
      "responses.cookId": new ObjectId(cookId)
    })
    .toArray();

  if (pendingMealReqs.length === 0) {
    throw `No pending meal requests found with cookId ${cookId}`;
  }

  return pendingMealReqs;
};

export const getPendingMealReqsWithoutCook = async (cookId) => {
  
  if (!cookId) throw new Error("Cook ID is required.");
  if (typeof cookId !== "string") throw new Error("Cook ID must be a string.");
  cookId = new ObjectId(cookId);

  await updateExpiredMealRequests();
  const pendingMealReqs = await mealReqsCollection
    .find({
      status: "pending",
      "responses.cookId": { $ne: cookId } 
    })
    .toArray();

  if (pendingMealReqs.length === 0) {
    throw `No pending meal requests found where cookId ${cookId} is not present.`;
  }

  return pendingMealReqs;
};

export const getNoResponseMealReqsByCook = async (cookId) => {
  
  cookId = helpers.checkId(cookId, 'cookId');

  await updateExpiredMealRequests();
  const noResponseMealReqs = await mealReqsCollection
    .find({
      status: "noResponse",
      "responses.cookId": new ObjectId(cookId) 
    })
    .toArray();

  if (noResponseMealReqs.length === 0) {
    throw `No "noResponse" meal requests found where cookId ${cookId} is present in responses.`;
  }

  return noResponseMealReqs;
};

