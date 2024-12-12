import React, { useContext, useEffect, useState } from 'react';
// import AddDish from './AddDish.jsx';
// import EditDish from './EditDish.jsx';
// import DeleteDish from './DeleteDish.jsx';
// import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';


function CartDetails() {
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);
    let str = JSON.stringify(currentUser, null, 2);
    let studentId;
    try {
        const currentUserObj = JSON.parse(str);
        console.log('currentUserObj: ' + currentUserObj);
        const userId = currentUserObj._id;
        studentId = userId;

        console.log("User ID:", userId);
    } catch (error) {
        console.error("Failed to parse JSON:", error.message);
        console.error("Student Id not found!");
    }
    const [showAddForm, setShowAddForm] = useState(false);
    // const [showEditModal, setShowEditModal] = useState(false);
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [editDish, setEditDish] = useState(null);
    // const [deleteDish, setDeleteDish] = useState(null);
    const [cartItems, setCartItems] = useState(null);
    // const isById = false;
    // const attr = 'cart';
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

            console.log("Dishes successfully fetched:", response.cart);
            setCartItems(response.cart);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getCartItemList();
    }, [])

    // const handleToggleChange = async (event, id) => {
    //     const isAvail = event.target.checked;
    //     console.log('event.target.checked: ' + event.target.checked);
    //     //const updateDish = async () => {
    //     try {
    //         const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/${id}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 cookId: studentId,
    //                 isAvailable: isAvail
    //             }),
    //         });
    //         if (response.error) {
    //             throw response;
    //         }

    //         console.log("Dish successfully updated:", response.dish);
    //         await getCartItemList();
    //     } catch (error) {
    //         alert(error);
    //     }
    //     // };
    //     // await updateDish();

    //     console.log(`Dish is now ${isAvail ? "Available" : "Unavailable"}`);
    // };
    // const handleOpenEditModal = (dish) => {
    //     setShowEditModal(true);
    //     setEditDish(dish);
    // };

    // const handleOpenDeleteModal = (dish) => {
    //     setShowDeleteModal(true);
    //     setDeleteDish(dish);
    // };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    // const handleCloseModals = () => {
    //     setShowEditModal(false);
    //     setShowDeleteModal(false);
    // };

    if (cartItems) {

        return (
            <div>
                <h2>Cart Items</h2>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mr: 1, width: '150px' }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    Checkout
                </Button>
                {showAddForm && (
                    <AddDish type='dish' cookId={studentId} refreshDishes={getCartItemList} closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />
                <Box
                    sx={{
                        mx: 'auto',
                        width: '75%',
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
                                {cartItems.map((cartItem) => (
                                    <TableRow key={cartItem._id}>
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
