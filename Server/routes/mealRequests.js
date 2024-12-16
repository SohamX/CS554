import { Router } from 'express';
const router = Router();
import {mealReqData} from '../data/index.js';
//import  { checkId, checkString, checkStringArray, checkEmail, checkRating, isValidDate, isTimeSlotValid } from '../helper.js';
import helpers from '../helpers/pranHelpers.js'
// router.route('/new').get(async (req, res) => {
// 
// });
router.route('/').post(async (req, res) => {
  const mealReqFormData = req.body;
  let {
  userId,
  noOfPeople ,
  description ,
  cuisineType,
  budget ,
  requiredBy} = mealReqFormData;
  
  try {
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
    throw 'Budget should be a positive number';}
    
    if (typeof requiredBy !== 'string') throw `Error: requiredBy date must be a string!`;
    requiredBy = requiredBy.trim();
    if(!helpers.isValidFutureDate(requiredBy)){
        throw 'Required By should be a valid future date in MM/DD/YYYY format and should not exceed 10 days from today'
    }
  } catch (e) {
    return res.status(400).json({error:e})
  }
  
 
  try {
   
    const succ = await mealReqData.createMealreq(userId,
        noOfPeople,
        description,
        cuisineType,
        budget,
        requiredBy);
    if (succ.mealRequestCreated) {
      res.status(200).json({ status: "success" });
    }
    else {
      res.status(500).json({ error: "Internal Server Error" });
    }

  } catch (e) {
    
    res.status(400).json({ error: e });
    return;

  }

});

router.route('/:userId/pending').get(async (req, res) => {
  try {
    req.params.userId =  helpers.checkId(req.params.userId, 'userId URL Param')
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    const pendingMealReqs = await mealReqData.getPendingMealReqsByUser(req.params.userId);
    res.json({ pendingMealReqs: pendingMealReqs });
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
});

router.route('/:userId/accepted').get(async (req, res) => {
    try {
        req.params.userId =  helpers.checkId(req.params.userId, 'userId URL Param');
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        const acceptedMealReqs = await mealReqData.getAcceptedMealReqsByUser(req.params.userId);
        res.json({ acceptedMealReqs: acceptedMealReqs });
    } catch (e) {
        res.status(404).json({ error: e });
        return;
    }
});

router.route('/pending/:mealReqId/responses').get(async (req, res) => {
    try {
     // req.params.userId =  helpers.checkId(req.params.userId, 'userId URL Param');
      req.params.mealReqId =  helpers.checkId(req.params.mealReqId, 'mealReqId URL Param');
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e });
      return;
    }
    try {
      const responses = await mealReqData.getResponsesForMealReq(req.params.mealReqId);
      res.status(200).json({ responses: responses });
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
      return;
    }
  });

router.route('/pending/:mealReqId/responses/:cookId').post(async (req, res) => {
  try {
    //req.params.userId =  checkId(req.params.userId, 'userId URL Param');
    req.params.mealReqId =  helpers.checkId(req.params.mealReqId, 'mealReqId URL Param');

    req.params.cookId =  helpers.checkId(req.params.cookId, 'cookId URL Param');
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    const status = await mealReqData.acceptMealRequest(req.params.mealReqId, req.params.cookId);
    res.status(200).json({ status: status });
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
});

router.route('/:cookId/pendingMr/').get(async (req, res) => {
    try {
      req.params.cookId =  helpers.checkId(req.params.cookId, 'cookId URL Param');
      
  
      
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }
    try {
      const pendingMealReqs = await mealReqData.getPendingMealReqsWithoutCook(req.params.cookId);
      res.status(200).json({ pendingMealReqs: pendingMealReqs });
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
      return;
    }
  });

router.route('/:cookId/acceptedMr/').get(async (req, res) => {
    try {
        req.params.cookId =  helpers.checkId(req.params.cookId, 'cookId URL Param');
        
    
        
      } catch (e) {
        res.status(400).json({ error: e });
        return;
      }
      try {
        const pendingMealReqs = await mealReqData.getAcceptedMealReqsByCook(req.params.cookId);
        res.status(200).json({ accpetedMealReqs: pendingMealReqs });
      } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
        return;
      }
});


router.route('/:cookId/pending/:mealReqId').post(async (req, res) => {
    try {
      req.params.cookId =  helpers.checkId(req.params.cookId, 'cookId URL Param');
      req.params.mealReqId =  helpers.checkId(req.params.mealReqId, 'mealReqId URL Param');
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }
    try {
      const status = await mealReqData.addResponseToMealReq(req.params.mealReqId, req.params.cookId);
      res.status(200).json({ status: status });
    } catch (e) {
      res.status(404).json({ error: e });
      return;
    }
  
})

router.route('/:cookId/awaiting/').get(async (req, res) => {
    try {
        req.params.cookId =  helpers.checkId(req.params.cookId, 'cookId URL Param');
        
    
        
      } catch (e) {
        res.status(400).json({ error: e });
        return;
      }
      try {
        const awaitingResponseMealReqs = await mealReqData.getPendingMealReqsByCook(req.params.cookId);
    res.status(200).json({ awaitingResponseMealReqs: awaitingResponseMealReqs });
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
});

router
  .route('/:mealReqId')
  .get(async (req, res) => {
    try {
      req.params.mealReqId = helpers.checkId(req.params.mealReqId, 'mealReqId URL Param');
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }

    try {
      const mealReqDetails = await mealReqData.getMealReqsById(req.params.mealReqId);
      res.status(200).json({ mealReqDetails: mealReqDetails });
      } catch (e) {
        res.status(404).json({ error: e });
        return;
      }
});

export default router


