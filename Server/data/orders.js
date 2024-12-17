import { orders } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers/pranHelpers.js';
import { validateDishesList, validateId, validateCost, validateCloudUrl, checkisValidBoolean, validateOrderStatus } from '../helpers/validationHelper.js';
import { getDishById } from './dishes.js';
import { userData } from '../data/index.js';

export const getOrderById = async (id) => {
    id = validateId(id, 'id');
    const orderCollection = await orders();
    const existingOrder = await orderCollection.findOne({ _id: ObjectId.createFromHexString(id) })
    if (existingOrder === null) throw `No order with id '${id}'.`;
    return existingOrder;
};

export const getAllOrderByCookId = async (cookId) => {
    cookId = validateId(cookId, 'cookId');
    const orderCollection = await orders();
    const allOrderByCookId = await orderCollection.find({ cookId: ObjectId.createFromHexString(cookId) }).toArray();
    // if (allOrderByCookId === null) throw `No order with cookId '${id}'.`;
    return allOrderByCookId;
};

export const getAllOrderByUserId = async (userId) => {
    userId = validateId(userId, 'userId');
    const orderCollection = await orders();
    const allOrderByUserId = await orderCollection.find({ userId: ObjectId.createFromHexString(userId) }).toArray();
    //if (allOrderByUserId === null) throw `No order with student '${id}'.`;
    return allOrderByUserId;
};

export const addOrder = async (
    cookId,
    userId,
    username,
    dishes,
    paymentMethod,
    totalCostBeforeTax,
    tax,
    totalCost,
    isMealReq
    // ,
    // invoiceLink
) => {
    const orderCollection = await orders();
    if (!cookId || !userId || !dishes || !paymentMethod) { //  || !invoiceLink
        throw "All fields need to be supplied";
    }
    cookId = validateId(cookId, 'cookId');
    userId = validateId(userId, 'userId');
    await validateDishesList(dishes, false);
    //TO DO validate payment method
    paymentMethod = validateId(paymentMethod, 'paymentMethod');
    //get getPaymentMethodByUserIdCardId
    let paymentDetails = await userData.getPaymentMethodByUserIdCardId(userId, paymentMethod);
    totalCostBeforeTax = validateCost(totalCostBeforeTax, 'totalCostBeforeTax');
    tax = validateCost(tax, 'tax');
    totalCost = validateCost(totalCost, 'totalCost');
    isMealReq = checkisValidBoolean(isMealReq, 'isMealReq');
    //invoiceLink = validateCloudUrl(invoiceLink, 'invoiceLink');
    let newOrder = {
        cookId: ObjectId.createFromHexString(cookId),
        userId: ObjectId.createFromHexString(userId),
        username: username,
        status: "placed",
        dishes: dishes,
        paymentMethod: paymentDetails,//ObjectId.createFromHexString(paymentMethod),
        isMealReq: isMealReq,
        totalCostBeforeTax: totalCostBeforeTax,
        tax: tax,
        totalCost: totalCost,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        rating: '-',
        review: ''
        //,
        //invoiceLink: invoiceLink
    };

    const insertInfo = await orderCollection.insertOne(newOrder);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add Order';

    return insertInfo;

};

export const updateOrder = async (
    id,
    status
) => {
    id = validateId(id, 'id');
    status = validateOrderStatus(status);
    let existingOrder = await getOrderById(id);
    if (existingOrder.status !== status) {
        const orderCollection = await orders();
        existingOrder.status = status;
        let updateOrder = await orderCollection.findOneAndReplace(
            { _id: ObjectId.createFromHexString(id) },
            existingOrder,
            { returnDocument: 'after' });

        if (!updateOrder) {
            throw 'could not update order successfully';
        }
        return updateOrder;
    }
    return existingOrder;
};

export const updateOrderReview = async (
    id,
    rating,
    review
) => {
    id = validateId(id, 'id');
    rating = parseFloat(rating);
    if (review != "") {
        review = checkDishDesc(review, 'review');
    }

    let existingOrder = await getOrderById(id);
    existingOrder.rating = parseFloat(rating);
    existingOrder.review = review;
    const orderCollection = await orders();

    let updateOrder = await orderCollection.findOneAndReplace(
        { _id: ObjectId.createFromHexString(id) },
        existingOrder,
        { returnDocument: 'after' });

    if (!updateOrder) {
        throw 'could not update order successfully';
    }
    return updateOrder;

};

//Is this requried??
// export const deleteOrder = async (
//     id
// ) => { };