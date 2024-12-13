import { validateCuisineType, validateCost, checkisValidImageArray, validateId, validateUniqueDishesPerCook, checkDishDesc } from '../helpers/validationHelper.js';
import dotenv from "dotenv";
dotenv.config();
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { userData, cookData } from '../data/index.js';

export const createPaymentIntent = async (
    amount,
    currency,
    paymentMethodType

) => {
    //validate input
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents (e.g., $10 = 1000 cents)
            currency: currency, // E.g., 'usd'
            payment_method_types: [paymentMethodType], // Allowable payment methods
            //confirm: true
        });

        return {
            paymentIntent: paymentIntent,
        };
    } catch (error) {
        throw { error: error.message };
    }
}

export const retrievePaymentIntent = async (
    id

) => {
    //validate input
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);

        return {
            paymentIntent: paymentIntent,
        };
    } catch (error) {
        throw { error: error.message };
    }
}

export const confirmPaymentIntent = async (
    id
) => {
    //validate input
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(id, {
            payment_method: 'pm_card_visa',
        });

        return {
            paymentIntent: paymentIntent,
        };
    } catch (error) {
        throw { error: error.message };
    }
}

export const cancelPaymentIntent = async (
    id

) => {
    //validate input
    try {
        const paymentIntent = await stripe.paymentIntents.cancel(id);

        return {
            paymentIntent: paymentIntent,
        };
    } catch (error) {
        throw { error: error.message };
    }
}

export const processPayment = async (
    amount
) => {
    try {
        //New customer will be created on Stripe once they place their first order
        //check if customer already present on stripe
        // const user = await userData.getUserById(userId);
        // const existUserCust = await getCustomer(user.gmail);
        // const userCust = (existUserCust === null) ? await createCustomer(user.gmail) : existUserCust;
        // //check if cook already present on stripe
        // const cook = await cookData.getCookByID(cookId);
        // const existCookCust = await getCustomer(cook.gmail);
        // const cookCust = (existCookCust === null) ? await createCustomer(user.gmail) : existCookCust;

        amount = amount * 100;
        const currency = 'usd';
        //createIntent
        const paymentIntent = await createPaymentIntent(amount,
            currency,
            'card'
        );
        console.log(paymentIntent);
        if (paymentIntent) {
            //confirmIntent
            const confirmPayIntent = await confirmPaymentIntent(paymentIntent.paymentIntent.id);
            if (confirmPayIntent) {
                return { status: "success", paymentDetails: confirmPayIntent };
            }
            else {
                return { error: "Internal Server Error" };
            }
        }
        else {
            return { error: "Internal Server Error" };
        }
    } catch (e) {
        throw e;
    }

}

export const createCustomer = async (
    email
) => {
    try {
        const customer = await stripe.customers.create({
            name: email,
            email: email,
        });

        console.log("Created customer:", customer.id);
        return {
            customer: customer,
        };
    } catch (e) {
        throw e;
    }
}

export const retrieveCustomer = async (
    email
) => {
    try {
        const customer = await stripe.customers.retrieve({
            email: email,
        });

        console.log("Created customer:", customer.id);
        return {
            customer: customer,
        };
    } catch (e) {
        throw e;
    }
}

export const getCustomer = async (
    email
) => {
    try {
        const customer = await stripe.customers.list({
            email: email,
            limit: 1,
        });
        return {
            customer: customer.data[0],
        };
    } catch (e) {
        return null;
    }
}

