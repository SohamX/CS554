import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch,ButtonGroup  } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';


function CartDetails() {
    const { apiCall } = useApi();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { cartItems, cook, total, addToCart, removeFromCart, decFromCart } = useContext(CartContext);
    const [studentId, setUserId] = useState('');    
    
    useEffect(() => {
        setUserId(currentUser._id);
    }, [currentUser]);
    //const [showAddForm, setShowAddForm] = useState(false);
    //const [cartItems, setCartItems] = useState(null);
    // const getCartItemList = async () => {
    //     try {
    //         const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/${studentId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //         if (response.error) {
    //             throw response;
    //         }

    //         console.log("Cart Items successfully fetched:", response.cart);
    //         setCartItems(response.cart);
    //     } catch (error) {
    //         alert(error);
    //     }
    // };

    // useEffect(() => {
    //     getCartItemList();
    // }, [studentId])

    const checkCooksAvailability = async () => {
        try {
            const cookDetails = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cooks/${cook.cookId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (cookDetails.error) {
                console.log(cookDetails.error)
                throw `Error while verifying cook of the dishes`
            }
            if (!cookDetails.cook.availability) {
                throw `Sorry! Cannot proceed with checkout as the cook is currently unavailable, try after sometime or try dishes by other cooks!`
            }
            return true
        } catch (error) {
            alert(error)
            // navigate('/student/cart')
        }
    }

    const handleCheckout = async() => {
        if (!cartItems || !cartItems.length || !(cartItems.length > 0)) {
            alert('Your cart is empty. Please add items to proceed.');
            return;
        }
        if (cook.cookId.trim() !== "") {
            const check = await checkCooksAvailability()
            if (!check) return
        }
        const cart = {
            cookId: cook.cookId,
            cookName: cook.cookName,
            dishes: cartItems,
            totalCost: total,
        }
        navigate('/student/checkout', { state: { cart, studentId, isMealReq: false } });
    };

    const handleAdd=async(dishId)=>{
        try {
           await addToCart(dishId,1)
            // const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/add/${dishId}/to/${studentId}`, {
            //     method: 'POST',
            // });
            // setCartItems(response.addedItem);
        } catch (error) {
            alert(error.error);
        }
    }

    const handleDec=async(dishId)=>{
        try {
            decFromCart(dishId);
            // const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/dec/${dishId}/to/${studentId}`, {
            //     method: 'POST',
            // });
            // setCartItems(response.decItem);
        } catch (error) {
            console.error("API call failed:", error);
        }
    }

    const handleRem=async(dishId)=>{
        try {
            removeFromCart(dishId);
            // const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/rem/${dishId}/to/${studentId}`, {
            //     method: 'POST',
            // });
            // setCartItems(response.remItem); 
        } catch (error) {
            console.error("API call failed:", error);
        }
    }

 
        return (
            <div>
                <h2>Cart Items</h2>
                <Box
                    sx={{
                        mx: 'auto',
                        width: '65%',
                        mt: 3,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: 2,
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <Typography>Note: Our cooks are students too, so considering their academic responsibilities, we do not offer delivery services. Once you will be able to chat with the cook, you can discuss the pick-up location and time.</Typography>
                </Box>
                <br />
                {cook?.cookId.trim() !== "" && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, mr: 1, width: '150px' }}
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                )}
                <Box
                    sx={{
                        mx: 'auto',
                        width: '65%',
                        mt: 3,
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexDirection: 'column',
                    }}
                >
                    {cook?.cookId.trim() !== "" && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Cook: {cook.cookName}
                        </Typography>
                    )}
                    <TableContainer component={Card}
                        sx={{
                            boxShadow: 3,
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        {cartItems && cartItems.length>0 ? (
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        
                                        <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>SubTotal</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((cartItem) => (
                                        <TableRow key={cartItem.dishId}>
                                            <TableCell>
                                                <Typography
                                                    variant='h6'
                                                    component='h3'
                                                >
                                                    {cartItem.dishName}
                                                </Typography>

                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='body1'>
                                                    {cartItem.quantity}
                                                </Typography>
                                            </TableCell>

                                            {/* SubTotal */}
                                            <TableCell>
                                                <Typography variant='body1'>
                                                    ${cartItem.subTotal?.toFixed(2)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <ButtonGroup variant="outlined" size="small">
                                                    <Button
                                                        color="primary"
                                                        onClick={()=>handleAdd(cartItem.dishId)}
                                                    >
                                                        +
                                                    </Button>
                                                    <Button
                                                        color="secondary"
                                                        onClick={()=>handleDec(cartItem.dishId)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        onClick={()=>handleRem(cartItem.dishId)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </ButtonGroup>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Your cart is empty.
                            </Typography>
                        )}
                    </TableContainer>
                </Box>
                { total > 0 && (
                    <Box
                        sx={{
                            mx: 'auto',
                            width: '65%',
                            mt: 3,
                            p: 2,
                            textAlign: 'center',
                            boxShadow: 2,
                            borderRadius: 2,
                            backgroundColor: '#f9f9f9',
                            mb: 3,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Total: ${total.toFixed(2)}
                        </Typography>
                    </Box>
                )}
            </div>
        );
}


export default CartDetails;
