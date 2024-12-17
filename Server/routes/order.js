import { Router } from 'express';
const router = Router();
import helpers from '../helpers/pranHelpers.js';
import { validateDishesList, validateId, validateCost, checkDishDesc, checkisValidBoolean, validateOrderStatus, errorMsg, checkisValidString } from '../helpers/validationHelper.js';
import { cookData, orderData } from '../data/index.js';

router
    .route('/')
    .post(async (req, res) => {
        const orderFormData = req.body;
        let {
            cookId,
            userId,
            dishes,
            paymentMethod,
            totalCost,
            isMealReq,
            invoiceLink } = orderFormData;

        try {
            if (!cookId || !userId || !dishes) {//|| !paymentMethod || !invoiceLink
                throw "All fields need to be supplied";
            }
            cookId = validateId(cookId, 'cookId');
            userId = validateId(userId, 'userId');
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
                userId,
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

router
    .route('/cook/:cookId')
    .get(async (req, res) => {
        try {
            req.params.cookId = validateId(req.params.cookId, 'cookId URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const orders = await orderData.getAllOrderByCookId(req.params.cookId);
            res.status(200).json({ status: "success", orders: orders });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })

router
    .route('/user/:userId')
    .get(async (req, res) => {
        try {
            req.params.cookId = validateId(req.params.userId, 'userId URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const orders = await orderData.getAllOrderByUserId(req.params.userId);
            res.status(200).json({ status: "success", orders: orders });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })


router
    .route('/user/review/:id')
    .patch(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        const orderFormData = req.body;
        let {
            rating,
            review } = orderFormData;

        try {
            rating = parseFloat(rating);
            if (review) {
                review = checkDishDesc(review, 'review');
            } else {
                review = "";
            }

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }

        try {
            const orderUpdated = await orderData.updateOrderReview(req.params.id,
                rating,
                review);


            if (orderUpdated) {
                //update cook rating
                await cookData.updateCooksRating(orderUpdated.cookId.toString(), orderUpdated.userId.toString(), orderUpdated.rating, orderUpdated.review);;

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