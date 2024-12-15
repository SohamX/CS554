import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper } from '@mui/material';

function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderDetails = location.state?.orderDetails;
    const [isMealReq, setIsMealReq] = useState(location.state?.isMealReq || false);

    if (!orderDetails) {
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
        status,
        totalCostBeforeTax,
        tax,
        totalCost,
        createdAt,
    } = orderDetails;

    return (
        <Box sx={{ mx: 'auto', width: '80%', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Order Confirmation
            </Typography>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">
                        Order Status: <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
                    </Typography>
                    <Typography variant="h6">
                        Order Placed On: <strong>{new Date(createdAt).toLocaleString()}</strong>
                    </Typography>
                    <Typography variant="h6">
                        Cook: <strong>{cookName}</strong>
                    </Typography>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>
                Order Summary {isMealReq ? '(Meal Request)' : ''}
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table sx={{ minWidth: '100%' }} aria-label="order details table">
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
            <Card sx={{ mb: 3 }}>
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

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate('/')}
            >
                Back to Home
            </Button>
        </Box>
    );
}

export default OrderConfirmation;
