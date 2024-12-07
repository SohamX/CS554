import { Router } from 'express';
const router = Router();
import helpers from '../helpers/pranHelpers.js';
import { validateDishesList, validateId, validateCost, validateCloudUrl, checkisValidBoolean, validateOrderStatus, errorMsg } from '../helpers/validationHelper.js';
import { orderData } from '../data/index.js';

router
    .route('/')
    .post(async (req, res) => {
        const orderFormData = req.body;
        let {
            cookId,
            studentId,
            dishes,
            paymentMethod,
            totalCost,
            isMealReq,
            invoiceLink } = orderFormData;

        try {
            if (!cookId || !studentId || !dishes) {//|| !paymentMethod || !invoiceLink
                throw "All fields need to be supplied";
            }
            cookId = validateId(cookId, 'cookId');
            studentId = validateId(studentId, 'studentId');
            await validateDishesList(dishes, true);
            //TO DO validate payment method
            totalCost = validateCost(parseFloat(totalCost), 'totalCost');
            isMealReq = checkisValidBoolean(Boolean(isMealReq), 'isMealReq');
            //invoiceLink = validateCloudUrl(invoiceLink, 'invoiceLink');

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }


        try {
            const orderAdded = await orderData.addOrder(cookId,
                studentId,
                dishes,
                //paymentMethod,
                totalCost,
                isMealReq
                // ,
                // invoiceLink
            );
            if (orderAdded) {
                res.status(200).json({ status: "success", order: orderAdded });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
    })

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const order = await orderData.getOrderById(req.params.id);
            res.status(200).json({ status: "success", order: order });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })
    .put(async (req, res) => {
    })
    .patch(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        const orderFormData = req.body;
        let {
            status } = orderFormData;

        try {
            status = validateOrderStatus(status);
        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }

        try {
            const orderUpdated = await orderData.updateOrder(req.params.id,
                status);
            if (orderUpdated) {
                res.status(200).json({ status: "success", order: orderUpdated });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
    })

export default router;