import { Router } from 'express';

const router = Router();
import helpers from '../helpers/pranHelpers.js';
import { validateCuisineType, validateCost, checkisValidImageArray, validateId, validateUniqueDishesPerCook, checkDishDesc, checkisValidBoolean, errorMsg } from '../helpers/validationHelper.js';
import { paymentData, orderData, userData } from '../data/index.js';


router
    .route('/placeOrder')
    .post(async (req, res) => {
        try {
            const { cookId, userId, items, totalCostBeforeTax, tax, totalCost, paymentMethod, isMealReq } = req.body;

            if (!cookId || !userId || !items || !items.dishes || items.dishes.length === 0 || !totalCostBeforeTax || !tax || !totalCost || !paymentMethod || isMealReq === undefined) {
                return res.status(400).json({ error: 'Invalid request data.' });
            }

            try {
                // Process payment
                const paymentResult = await paymentData.processPayment(totalCost);

                if (paymentResult.error) {
                    return res.status(400).json({ error: 'Payment failed.' });
                }
                console.log('totalCost ' + totalCost);

                if (isMealReq) {
                    //TO DO update the mealReq obj - seletectedByUser true
                }

                let paymentDetails = await userData.getPaymentMethodByUserIdCardId(userId, paymentMethod);
                const orderAdded = await orderData.addOrder(
                    cookId,
                    userId,
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

                //remove from cart
                //TO DO
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