import { orders } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers/pranHelpers.js';
import { validateDishesList, validateId, validateCost, validateCloudUrl, checkisValidBoolean, validateOrderStatus } from '../helpers/validationHelper.js';
import { getDishById } from './dishes.js';

export const getOrderById = async (id) => {
    id = validateId(id, 'id');
    const orderCollection = await orders();
    const existingOrder = await orderCollection.findOne({ _id: ObjectId.createFromHexString(id) })
    if (existingOrder === null) throw `No order with id '${id}'.`;
    return existingOrder;
};

export const addOrder = async (
    cookId,
    studentId,
    dishes,
    paymentMethod,
    totalCost,
    isMealReq,
    invoiceLink
) => {
    const orderCollection = await orders();
    if (!cookId || !studentId || !dishes || !paymentMethod || !invoiceLink) {
        throw "All fields need to be supplied";
    }
    cookId = validateId(cookId, 'cookId');
    studentId = validateId(studentId, 'studentId');
    validateDishesList(dishes);
    //TO DO validate payment method
    totalCost = validateCost(totalCost, 'totalCost');
    isMealReq = checkisValidBoolean(isMealReq, 'isMealReq');
    invoiceLink = validateCloudUrl(invoiceLink, 'invoiceLink');
    let newOrder = {
        cookId: cookId,
        studentId: studentId,
        status: "placed",
        dishes: dishes,
        //paymentMethod: paymentMethod,
        isMealReq: isMealReq,
        totalCost: totalCost,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        rating: '-',
        review: '',
        invoiceLink: invoiceLink
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
    id = validateId(id, 'id');
    status = validateOrderStatus(status);
    let existingOrder = await getDishById(id);
    if (existingOrder.status !== status) {
        const orderCollection = await orders();
        existingOrder.status == status;
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

//Is this requried??
// export const deleteOrder = async (
//     id
// ) => { };