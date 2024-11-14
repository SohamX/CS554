import { orders } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers/pranHelpers.js';
import { validateCost, validateId, validateUniqueDishesPerCook } from '../helpers/validationHelper.js';

export const addOrder = async (
    cookId,
    studentId,
    dishes,
    paymentMethod,
    totalCost
) => {
    const orderCollection = await orders();
    if (!cookId || !studentId || !dishes || !paymentMethod) {
        throw "All fields need to be supplied";
    }
    cookId = validateId(cookId, 'cookId');
    studentId = validateId(studentId, 'studentId');
    let newOrder = {
        cookId: cookId,
        studentId: studentId,
        status: "placed",
        dishes: dishes,
        paymentMethod: paymentMethod,
        totalCost: totalCost,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
    };

    const insertInfo = await orderCollection.insertOne(newOrder);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add Order';

    return insertInfo.acknowledged;

};

export const updateOrder = async (
    id,
    status
) => {

};

//Is this requried??
// export const deleteOrder = async (
//     id
// ) => { };