import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Card, CardContent, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useApi } from '../../contexts/ApiContext.jsx';
import AddCard from './AddCard.jsx';


function CheckoutDetails() {
    const location = useLocation();
    const { apiCall } = useApi();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
    const [userId, setUserId] = useState(location.state?.studentId || '');
    const [totalCostBeforeTax, setTotalCostBeforeTax] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [tax, setTax] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        // Calculate the total cost
        if (cartItems.length > 0) {
            const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            let totB4Tax = total.toFixed(2);
            let calcTax = (totB4Tax * 0.06).toFixed(2);
            let finalTotal = (parseFloat(totB4Tax) + parseFloat(calcTax)).toFixed(2);
            setTotalCostBeforeTax(totB4Tax);
            setTax(calcTax);
            setTotalCost(finalTotal);
        }
    }, [cartItems]);

    const getPaymentMethodsList = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/paymentCard/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                if (response.error === 'No payment method added for User.') {
                    throw `No payment method found for your account. Please add a payment method to proceed.`;
                } else {
                    throw response;
                }
            }
            console.log("Payment methods successfully fetched:", response.paymentMethodList);
            setPaymentMethods(response.paymentMethodList);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getPaymentMethodsList();
    }, [])

    const handlePlaceOrder = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        try {
            // Call the API to place the order
            console.log("selectedPaymentMethod: " + selectedPaymentMethod);
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/payment/placeOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cookId: '6758d17e11319fce50ef3d88',
                    userId: userId,
                    items: cartItems,
                    totalCost: totalCost,
                    paymentMethod: selectedPaymentMethod,
                }),
            });

            if (response.error) {
                throw new Error(response.error || 'Failed to place the order.');
            } else {
                alert('Order placed successfully!');
                //navigate('/orderConfirmation', { state: { orderDetails: response.orderAdded } });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place the order. Please try again.');
        }
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };
    const handleOnClickAddPayment = () => {
        setShowAddForm(!showAddForm);
        setSelectedPaymentMethod('');
    };

    return (
        <Box sx={{ mx: 'auto', width: '70%', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Order Summary
            </Typography>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* <Typography variant="h6">{item.cookName}</Typography> */}
                    {cartItems.map((item) => (
                        <Box key={item._id} sx={{
                            display: "flex",
                            width: '80%',
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2
                        }}>
                            <Typography>{item.quantity}</Typography>
                            <Typography variant="h6">{item.dishName}</Typography>
                            <Typography>${item.subtotal}</Typography>
                        </Box>
                    ))}
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        SubTotal: ${totalCostBeforeTax}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Taxes and other fees: ${tax}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Total: ${totalCost}
                    </Typography>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>
                Payment Method
            </Typography>
            <RadioGroup
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
                {paymentMethods.map((card) => (
                    <FormControlLabel
                        key={card._id}
                        value={card._id}
                        control={<Radio />}
                        label={`${card.type} ${card.provider} (**** **** **** ${card.last4Digits})${card.isDefault ? ' - Default' : ''}`}
                    />
                ))}
            </RadioGroup>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1, mr: 1 }}
                onClick={handleOnClickAddPayment}
            >
                Add Payment Method
            </Button>
            {showAddForm && (
                <AddCard userId={userId} paymentMethods={paymentMethods} refreshPaymentMethods={getPaymentMethodsList} closeAddFormState={closeAddFormState} />
            )}
            {/* <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1, mr: 1, width: '150px' }}
                onClick={handleAddPaymentMethod}
            >
                Add Payment Method
            </Button> */}
            {/* <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
            >
                <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                <FormControlLabel value="cash_on_delivery" control={<Radio />} label="Cash on Delivery" />
            </RadioGroup> */}

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handlePlaceOrder}
            >
                Place Order
            </Button>
        </Box>
    );
}

export default CheckoutDetails;
