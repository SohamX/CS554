import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditDish from './EditDish.jsx';
import DeleteDish from './DeleteDish.jsx';
import { useApi } from '../../contexts/ApiContext';
import { Card, CardContent, CardHeader, Typography, Button, Box, Grid, FormControlLabel, Switch } from '@mui/material';
import { AuthContext } from '../../contexts/AccountContext.jsx';


function DishDetail(props) {
    const { id } = useParams();
    const { apiCall } = useApi();
    const [dish, setDish] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editDish, setEditDish] = useState(null);
    const [deleteDish, setDeleteDish] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [count, setCount] = useState(0)
    const [itemId, setItemId] = useState(null)
    const isById = true;
    const attr = 'dish';
    //const [loading, setLoading] = useState(true);
    const getDish = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }

            console.log("Dish successfully added:", response.dish);
            setDish(response.dish);
            if (currentUser.role === 'user') {
                let cartItems = currentUser.cart
                for (let i = 0; i < cartItems.length; i++) {
                    if (cartItems[i].dishId === response.dish._id) {
                        setCount(cartItems[i].quantity)
                        setItemId(cartItems[i]._id)
                    }
                }
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getDish();
    }, [id])

    const handleToggleChange = async (event, id) => {
        const isAvail = event.target.checked;
        console.log('event.target.checked: ' + event.target.checked);
        //const updateDish = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cookId: dish.cookId,
                    isAvailable: isAvail
                }),
            });
            if (response.error) {
                throw response;
            }

            console.log("Dish successfully updated:", response.dish);
            await getDish();
        } catch (error) {
            alert(error);
        }
        // };
        // await updateDish();

        console.log(`Dish is now ${isAvail ? "Available" : "Unavailable"}`);
    };
    const handleOpenEditModal = (dish) => {
        setShowEditModal(true);
        setEditDish(dish);
    };

    const handleOpenDeleteModal = (dish) => {
        setShowDeleteModal(true);
        setDeleteDish(dish);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    const addToCart = async (dish) => {
        try {
            if (count == 0) {
                const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/add/${id}/to/${currentUser._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.addedItem) {
                    let cartItems = response.addedItem.cart
                    for (let i = 0; i < cartItems.length; i++) {
                        if (cartItems[i].dishId === dish._id) {
                            setCount(cartItems[i].quantity)
                            setItemId(cartItems[i]._id)
                        }
                    }
                    // setItemCount(response.addedItem.cart._id)
                }
                if (response.error) {
                    throw response;
                }
            } else {
                const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/update/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.updatedCartTotal) {
                    let cartItems = response.updatedCartTotal.cart
                    for (let i = 0; i < cartItems.length; i++) {
                        if (cartItems[i].dishId === dish._id) {
                            setCount(cartItems[i].quantity)
                            setItemId(cartItems[i]._id)
                        }
                    }
                    // setItemCount(response.addedItem.cart._id)
                }
                if (response.error) {
                    throw response;
                }
            }
        } catch (error) {
            alert(error);
        }
    }

    const removeFromCart = async (dish) => {
        try {
            if (count == 0) {
                return
            } else if (itemId) {
                const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/delete/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.error) {
                    throw response;
                }
                if (response.status === 'success') {
                    setCount(0)
                    setItemId(null)
                }
            }
        } catch (error) {
            alert(error);
        }
    }

    if (dish) {

        return (
            <div>
                <h2>Dish</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
                    {dish.imageUrl&&<img
                        src={dish.imageUrl}
                        alt={dish.name}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                        }}
                    />}
                        <CardHeader title={dish.name} />
                        <CardContent>
                            <Typography variant="body1" >
                                <strong>Description:</strong> {dish.description}
                            </Typography>
                            <Typography variant="body1" >
                                <strong>Cuisine Type:</strong> {dish.cuisineType}
                            </Typography>

                            <Typography variant="body1" >
                                <strong>Cost:</strong> {dish.cost}
                            </Typography>
                            {currentUser.role==='user'&&(<Typography variant="body1" >
                                <strong>Made by :</strong> {dish.cookName}
                            </Typography>)}
                            {currentUser.role === 'cook' && (<FormControlLabel
                                control={
                                    <Switch
                                        checked={dish.isAvailable}
                                        onChange={(event) => handleToggleChange(event, dish._id)}
                                        color="primary"
                                    />
                                }
                                label={dish.isAvailable ? "Available" : "Unavailable"}
                            />)}
                        </CardContent>
                    </Card>
                    {currentUser.role === 'cook' && (
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleOpenEditModal(dish)}
                            >
                                Edit Dish
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleOpenDeleteModal(dish)}
                            >
                                Delete
                            </Button>
                        </Box>)
                    }
                    {currentUser.role === 'user' && (
                        <Box display="flex" gap={2}>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => addToCart(dish)}
                            >
                                Add To Cart
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => removeFromCart(dish)}
                            >
                                Remove From Cart
                            </Button>
                        </Box>
                    )
                    }
                    {currentUser.role === 'user' && (
                        <Typography variant="body1" >
                            <strong>{count}</strong> in the cart
                        </Typography>
                    )}
                    {currentUser.role === 'cook' && showEditModal && (
                        <EditDish
                            isOpen={showEditModal}
                            dish={editDish}
                            handleClose={handleCloseModals}
                            refreshDishes={getDish}
                            attr={attr}
                        />
                    )}

                    {currentUser.role === 'cook' && showDeleteModal && (
                        <DeleteDish
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deleteDish={deleteDish}
                            isById={isById}
                            attr={attr}
                        />
                    )}
                </Box>
            </div>
        );
    }
}

export default DishDetail;
