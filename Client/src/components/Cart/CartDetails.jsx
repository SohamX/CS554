import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';


function CartDetails() {
    const { apiCall } = useApi();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    let str = JSON.stringify(currentUser, null, 2);
    let studentId;
    try {
        const currentUserObj = JSON.parse(str);
        console.log('currentUserObj: ' + currentUserObj);
        const userId = currentUserObj._id;
        studentId = userId;

        console.log("User ID:", studentId);
    } catch (error) {
        console.error("Failed to parse JSON:", error.message);
        console.error("Student Id not found!");
    }
    const [showAddForm, setShowAddForm] = useState(false);
    const [cartItems, setCartItems] = useState(null);
    const getCartItemList = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/${studentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }

            console.log("Cart Items successfully fetched:", response.cart);
            setCartItems(response.cart);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getCartItemList();
    }, [studentId])

    const handleCheckout = () => {
        if (!cartItems || !cartItems.dishes || !cartItems.dishes.length || !(cartItems.dishes.length > 0)) {
            alert('Your cart is empty. Please add items to proceed.');
            return;
        }
        navigate('/student/checkout', { state: { cartItems, studentId, isMealReq: false } });
    };


    if (cartItems) {

        return (
            <div>
                <h2>Cart Items</h2>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mr: 1, width: '150px' }}
                    onClick={handleCheckout}
                >
                    Checkout
                </Button>

                <br />
                <br />
                <Box
                    sx={{
                        mx: 'auto',
                        width: '65%',
                        mt: 3,
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <TableContainer component={Card}
                        sx={{
                            boxShadow: 3,
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems && cartItems.dishes.map((cartItem) => (
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
                                            {/* <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleOpenEditModal(cartItem)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleOpenDeleteModal(cartItem)}
                                            >
                                                Delete
                                            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                {/* {showEditModal && (
                    <EditDish
                        isOpen={showEditModal}
                        dish={editDish}
                        handleClose={handleCloseModals}
                        refreshDishes={getCartItemList}
                        attr={attr}
                    />
                )}

                {showDeleteModal && (
                    <DeleteDish
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteDish={deleteDish}
                        refreshDishes={getCartItemList}
                        isById={isById}
                        attr={attr}
                    />
                )} */}
            </div>
        );
    }

}


export default CartDetails;
