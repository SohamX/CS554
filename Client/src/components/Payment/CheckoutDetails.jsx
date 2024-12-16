import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Card, CardContent, Box, RadioGroup, FormControlLabel, Radio, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { useApi } from '../../contexts/ApiContext.jsx';
import AddCard from './AddCard.jsx';
import { taxPercent } from '../../helpers/constants.js';
import { AuthContext } from '../../contexts/AccountContext.jsx';
import { CartContext } from '../../contexts/CartContext.jsx';


function CheckoutDetails() {
    const location = useLocation();
    const { apiCall } = useApi();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { cartItems, cook, total, setCartItems, setCook, setTotal } = useContext(CartContext);
    // const [cartItems, setCartItems] = useState(location.state?.cartItems || {});
    const [userId, setUserId] = useState(location.state?.studentId || '');
    const [isMealReq, setIsMealReq] = useState(location.state?.isMealReq || false);
    const [mealReqId, setMealReqId] = useState(location.state?.mealReqId || '');
    const [username, setUsername] = useState(currentUser.username);
    const [cookId, setCookId] = useState();
    const [totalCostBeforeTax, setTotalCostBeforeTax] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [tax, setTax] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        // Calculate the total cost
        if (cartItems && cartItems.length && cartItems.length > 0) {
            setCookId(cook.cookId);
            //const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            let totB4Tax = total.toFixed(2);
            let calcTax = (totB4Tax * taxPercent).toFixed(2);
            let finalTotal = (parseFloat(totB4Tax) + parseFloat(calcTax)).toFixed(2);
            setTotalCostBeforeTax(totB4Tax);
            setTax(calcTax);
            setTotalCost(finalTotal);
        }
    }, [cartItems, cook, total]);

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
            let obj = {
                dishes: cartItems,
                cookId: cookId,
                cookName: cook.cookName,
                totalCost: totalCost
            }

            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/payment/placeOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cookId: cookId,//'6758d17e11319fce50ef3d88',
                    userId: userId,
                    username: username,
                    items: obj,
                    totalCostBeforeTax: totalCostBeforeTax,
                    tax: tax,
                    totalCost: totalCost,
                    paymentMethod: selectedPaymentMethod,
                    isMealReq: isMealReq,
                    mealReqId: mealReqId
                }),
            });

            if (response.error) {
                throw new Error(response.error || 'Failed to place the order.');
            } else {
                alert('Order placed successfully!');
                setCartItems([]);
                setCook({ cookId: '', cookName: '' });
                setTotal(0);
                //console.log('orderDetails: ' + JSON.stringify(response));
                navigate('/student/orderConfirmation', { state: { orderDetails: response.orderDetails, isMealReq } });
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
        <Box sx={{ mx: 'auto', width: '80%', mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom>
                Order Summary
            </Typography>
            <Card sx={{ m: 3 }}>
                <CardContent>
                    <Typography variant="h6">Cook: {cook.cookName}</Typography>
                    {/* {cartItems && cartItems.dishes.map((item) => (
                        <Box key={item._id} sx={{
                            display: "flex",
                            width: '80%',
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2
                        }}>
                            <Typography>{item.quantity}</Typography>
                            <Typography variant="h6">{item.dishName}</Typography>
                            <Typography>${item.subTotal}</Typography>
                        </Box>
                    ))} */}

                    <TableContainer component={Box} sx={{ width: '90%', maxHeight: 400, overflowY: 'auto', m: 2 }}>
                        <Table sx={{ minWidth: '100%' }} aria-label="cart items table">
                            <TableHead>
                                <TableRow>

                                    <TableCell>{isMealReq ? 'No. of People' : 'Quantity'}</TableCell>
                                    <TableCell>{isMealReq ? 'Meal Request Description' : 'Dish Name'}</TableCell>
                                    <TableCell>Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.dishId}>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.dishName}</TableCell>
                                        <TableCell>${item.subTotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                        label={`${card.type.toUpperCase()} ${card.provider} (**** **** **** ${card.last4Digits})`}
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
