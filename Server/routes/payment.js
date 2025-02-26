import { Router } from 'express';

const router = Router();
import { errorMsg } from '../helpers/validationHelper.js';
import { paymentData, orderData, userData, mealReqData, cookData, dishData } from '../data/index.js';
import client from '../config/redisClient.js';


router
    .route('/placeOrder')
    .post(async (req, res) => {
        try {
            const { cookId, userId, username, items, totalCostBeforeTax, tax, totalCost, paymentMethod, isMealReq, mealReqId } = req.body;
            //console.log('req.body: ' + JSON.stringify(req.body));

            if (!cookId || !userId || !username || !items || !items.dishes || items.dishes.length === 0 || !totalCostBeforeTax || !tax || !totalCost || !paymentMethod || isMealReq === undefined) {
                return res.status(400).json({ error: 'Invalid request data.' });
            }
            if (isMealReq && !mealReqId) {
                return res.status(400).json({ error: 'Invalid request data.' });
            }
            try {
                const cookDetails = await cookData.getCookByID(cookId)
                if (!cookDetails.availability) {
                        return res.status(400).json({error: "Cook Unavailable"});
                }
            } catch (e) {
                return res.status(400).json({error: (e)});
            }
            // try {
            const dishes = await dishData.getAllDishesByCookId(cookId)
            for (let dish of dishes) {
                for (let item of items.dishes) {
                    if(dish._id.toString() == item.dishId && !dish.isAvailable) {
                        return res.status(400).json({error: "Dish Unavailable"});
                    }
                }
            }
            // } catch (e) {
            //     res.status(400).json({error: (e)});
            //     return;
            // }
            console.log('mealReqId: ' + mealReqId);
            try {
                // Process payment
                const paymentResult = await paymentData.processPayment(totalCost);

                if (paymentResult.error) {
                    return res.status(400).json({ error: 'Payment failed.' });
                }
                //console.log('totalCost ' + totalCost);

                if (isMealReq) {
                    //TO DO update the mealReq obj - seletectedByUser true
                    let updateMealReqStatus = await mealReqData.acceptMealRequest(mealReqId, cookId);
                }

                if(!isMealReq){
                    for(const dish of items.dishes){
                        let dishId = dish.dishId;
                        const dishDetails = await dishData.getDishById(dishId);
                        await client.lPush(`historyList:${userId}`,JSON.stringify(dishDetails));
                    }
                }

                let paymentDetails = await userData.getPaymentMethodByUserIdCardId(userId, paymentMethod);
                const orderAdded = await orderData.addOrder(
                    cookId,
                    userId,
                    username,
                    items,
                    paymentMethod,
                    parseFloat(totalCostBeforeTax),
                    parseFloat(tax),
                    parseFloat(totalCost),
                    isMealReq
                    // ,
                    // invoiceLink
                );
                if (!orderAdded) {
                    res.status(400).json({ error: "Error creating an order." });
                }

                //Add to cooks earnings
                await cookData.updateCooksEarnings(cookId, parseFloat(totalCost));

                //remove from cart                
                let emptyCart = await userData.emptyCart(userId);
                const orderDetails = await orderData.getOrderById(orderAdded.insertedId.toString());
                //console.log('orderDetails: ' + JSON.stringify(orderDetails));
                res.status(200).json({ message: 'Checkout successful!', orderDetails });
            } catch (error) {
                console.error(errorMsg(error));
                res.status(500).json({ error: `Checkout failed. Please try again.` });
            }
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }

    })

router
    .route('/')
    .post(async (req, res) => {
        const paymentFormData = req.body;
        let {
            amount,
            currency,
            paymentMethodType

        } = paymentFormData;

        try {
            if (!amount || !currency || !paymentMethodType) {
                throw "All fields need to be supplied";
            }
            //validate input

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }


        try {
            const paymentIntent = await paymentData.createPaymentIntent(amount,
                currency,
                paymentMethodType
            );
            if (paymentIntent) {
                res.status(200).json({ status: "success", paymentDetails: paymentIntent });
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
    .route('/confirm/:id')
    .post(async (req, res) => {
        try {
            //validate input
            //req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const paymentIntent = await paymentData.confirmPaymentIntent(req.params.id);
            if (paymentIntent) {
                res.status(200).json({ status: "success", paymentDetails: paymentIntent });
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
    .route('/cancel/:id')
    .post(async (req, res) => {
        try {
            //validate input
            //req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }

        try {
            const paymentIntent = await paymentData.cancelPaymentIntent(req.params.id);
            if (paymentIntent) {
                res.status(200).json({ status: "success", paymentDetails: paymentIntent });
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
            //validate input
            //req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }

        try {
            const paymentIntent = await paymentData.retrievePaymentIntent(req.params.id);
            if (paymentIntent) {
                res.status(200).json({ status: "success", paymentDetails: paymentIntent });
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
    .route('/customer')
    .get(async (req, res) => {
        try {
            console.log('HERE');
            const { email } = req.body;
            console.log('email:' + email);
            const customer = await paymentData.getCustomer(email);
            if (customer) {
                res.status(200).json({ status: "success", customerDetails: customer });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
    })
    .post(async (req, res) => {
        try {
            const { email } = req.body;
            const customer = await paymentData.createCustomer(email);
            if (customer) {
                res.status(200).json({ status: "success", customerDetails: customer });
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
    .route('/customer/:email')
    .get(async (req, res) => {
        try {
            console.log('HERE');
            const email = req.params.email;
            console.log('email:' + email);
            const customer = await paymentData.getCustomer(email);
            if (customer) {
                res.status(200).json({ status: "success", customerDetails: customer });
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