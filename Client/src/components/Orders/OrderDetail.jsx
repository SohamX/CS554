import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useApi } from '../../contexts/ApiContext.jsx';
import { Card, CardContent, Typography, Button, Box, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, TextField, Rating } from '@mui/material';
import { AuthContext } from '../../contexts/AccountContext.jsx';
import { checkDishDesc } from '../../helpers/validationHelper.js';
import { getCoordinatesFromAddress } from '../../helpers/constants.js';

function OrderDetail(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiCall } = useApi();
    const [order, setOrder] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [userId, setUserId] = useState(currentUser._id || '');
    const [role, setRole] = useState(currentUser.role || '');
    const [reviewText, setReviewText] = useState('');
    const [ratingValue, setRatingValue] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
    const [cookAddress, setCookAddress] = useState('');


    const onReviewTextChange = (e) => {
        let value = e.target.value;
        // value = checkDishDesc(value, 'Review');
        setReviewText(value);
    };

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
    
    const cookCord = async() => {
        if(order && role){
            if(order.status !== 'completed'){
                if(role === 'user'){
                    try{
                        const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cooks/coordinates/${order.cookId}`);
                        if(response.error){
                            throw response;
                        }
                        const location = response.location;
                        const fullAddress = location.address + ', ' + location.city + ', ' + location.state + ', ' + location.zip + ', ' + location.country;
                        if((response.location.coordinates.latitude ===0 && response.location.coordinates.longitude === 0)|| (response.location.coordinates.latitude === '' && response.location.coordinates.longitude === '')){
                            const coordinates = await getCoordinatesFromAddress(fullAddress);
                            if(coordinates){
                                setCoordinates(coordinates);
                            }
                        }else{
                            setCoordinates(response.location.coordinates);
                        }
                        setCookAddress(fullAddress);
                    } catch (error) {
                        alert(error);
                    }
                }
            }
        }
    }

    const handleSubmitReview = async (e) => {
        try {
            e.preventDefault();
            setError(false);
            setIsSubmitting(true);

            let reviewVal;

            let errors = [];

            if (reviewText && reviewText != "") {
                try {
                    reviewVal = checkDishDesc(reviewText, 'Review');
                } catch (err) {
                    errors.push(err);
                }
            }

            if (errors.length > 0) {
                setError(true);
                setErrorMsg(errors.join('\n'));
                return;
            }

            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/orders/user/review/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: ratingValue,
                    review: reviewVal,
                }),
            });
            if (response.error) {
                throw response;
            }

            alert('Review submitted successfully!');
            setOrder(response.order);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        setUserId(currentUser._id);
        setRole(currentUser.role);
    }, [currentUser]);

    useEffect(() => {
        getOrder();
    }, [id]);

    useEffect(()=>{
        cookCord();
    },[order])

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
        rating,
        review,
    } = order;

    if (order) {

        return (
            <div>
                <h2>Order</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 5, padding: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            {role === 'cook' ? 'User:' : 'Cook:'} <strong>{role === 'cook' ? username : cookName}</strong>
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

                        {role === 'user' && status !== 'completed' && cookAddress && (
                            <Card sx={{ m: 3, width: '90%' }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        Cook's Address:
                                    </Typography>
                                    <Typography variant="body1">
                                        {coordinates.latitude !== 0 && coordinates.longitude !== 0 && (
                                            <iframe
                                            width="80%"
                                            height="200"
                                            style={{ border: 0, borderRadius: '8px' }}
                                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GMAP_API_KEY}&q=${coordinates.latitude},${coordinates.longitude}`}
                                            allowFullScreen
                                            ></iframe>
                                        )}
                                    </Typography>
                                    <Typography variant="body1">
                                        {cookAddress}
                                    </Typography>            
                                </CardContent>
                            </Card>
                        )}

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



                        {status === 'completed' && rating === '-' && role !== 'cook' && (
                            <Box sx={{ m: 4, width: '90%' }}>
                                {error && <Typography
                                    variant="body1"
                                    align="center"
                                    gutterBottom
                                    className='errorMessage'
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    {errorMsg}
                                </Typography>}
                                <Typography variant="h5" gutterBottom>
                                    Your feedback matters!
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Rate your order and share your thoughts to help us make every meal even better. Your cook would appreciate it!
                                </Typography>
                                <Rating
                                    value={ratingValue}
                                    onChange={(event, newValue) => setRatingValue(newValue)}
                                    precision={0.5}
                                />
                                <TextField
                                    id="review"
                                    label="Write your review"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    value={reviewText}
                                    onChange={onReviewTextChange}
                                    inputProps={{ maxLength: 1000 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2, width: '30%' }}
                                    onClick={handleSubmitReview}
                                    disabled={isSubmitting || !ratingValue}
                                >
                                    Submit
                                </Button>
                            </Box>
                        )}

                        {rating !== '-' && (
                            <Card sx={{ m: 3, width: '90%' }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Feedback
                                    </Typography>
                                    <Typography variant="body1">Rating: {rating}/5</Typography>
                                    <Typography variant="body1">Review: {review}</Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Card>
                </Box>
            </div>
        );
    }
}

export default OrderDetail;
