import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useApi } from '../../contexts/ApiContext.jsx';
import { Card, CardContent, CardHeader, Typography, Button, Box, Grid, FormControlLabel, Switch, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';
import { AuthContext } from '../../contexts/AccountContext.jsx';


function OrderDetail(props) {
    const { id } = useParams();
    const { apiCall } = useApi();
    const [order, setOrder] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [role, setRole] = useState(currentUser.role || '');

    const isById = true;
    const attr = 'order';
    //const [loading, setLoading] = useState(true);
    const getOrder = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/orders/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }

            console.log("Order successfully fetched:", response.order);
            setOrder(response.order);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getOrder();
    }, [id])
    if (!order) {
        return (
            <Box sx={{ mx: 'auto', width: '80%', mt: 5, textAlign: 'center' }}>
                <Typography variant="h4" color="error" gutterBottom>
                    No Order Details Found
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                >
                    Go to Home
                </Button>
            </Box>
        );
    }

    const {
        dishes: { cookName, dishes },
        paymentMethod,
        username,
        status,
        totalCostBeforeTax,
        tax,
        isMealReq,
        totalCost,
        createdAt,
    } = order;

    if (order) {

        return (
            <div>
                <h2>Order</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {role === 'cook' ? 'User:' : 'Cook:'}  <strong>{role === 'cook' ? username : cookName}</strong>
                        </Typography>
                        <Card sx={{ m: 3, width: '90%' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Order Status: <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
                                </Typography>
                                <Typography variant="h6">
                                    Order Placed On: <strong>{new Date(createdAt).toLocaleString()}</strong>
                                </Typography>
                            </CardContent>
                        </Card>

                        <Typography variant="h5" gutterBottom>
                            {role === 'cook' ? 'Order Summary' : 'Your Order'} {order.isMealReq ? '(Meal Request)' : ''}
                        </Typography>
                        <TableContainer component={Paper} sx={{ m: 3, width: '90%' }}>
                            <Table sx={{ width: '90%' }} aria-label="order details table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{isMealReq ? 'No. of People' : 'Quantity'}</TableCell>
                                        <TableCell>{isMealReq ? 'Meal Request Description' : 'Dish Name'}</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dishes?.map((dish) => (
                                        <TableRow key={dish.dishId}>
                                            <TableCell>{dish.quantity}</TableCell>
                                            <TableCell>{dish.dishName}</TableCell>
                                            <TableCell>${dish.subTotal.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h5" gutterBottom>
                            Payment Details
                        </Typography>
                        <Card sx={{ m: 3, width: '90%' }}>
                            <CardContent>
                                <Typography>
                                    Payment Method: <strong>{paymentMethod?.type.toUpperCase()} ({paymentMethod?.provider})</strong>
                                </Typography>
                                <Typography>
                                    Card Ending In: <strong>**** {paymentMethod?.last4Digits}</strong>
                                </Typography>
                            </CardContent>
                        </Card>

                        <Typography variant="h5" sx={{ mt: 2 }}>
                            Subtotal: <strong>${totalCostBeforeTax.toFixed(2)}</strong>
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                            Taxes and Fees: <strong>${tax.toFixed(2)}</strong>
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                            Total Cost: <strong>${totalCost.toFixed(2)}</strong>
                        </Typography>
                    </Card>
                </Box>
            </div>
        );
    }
}

export default OrderDetail;
