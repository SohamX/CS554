import React, { useContext, useEffect, useState } from 'react';
import AddCard from './AddCard.jsx';
import EditCard from './EditCard.jsx';
import DeleteCard from './DeleteCard.jsx';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch } from '@mui/material';
import { useApi } from '../../contexts/ApiContext.jsx';
import { AuthContext } from '../../contexts/AccountContext.jsx';


function CardsList() {
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);
    let str = JSON.stringify(currentUser, null, 2);
    let userId;
    try {
        const currentUserObj = JSON.parse(str);
        console.log('currentUserObj: ' + currentUserObj);
        const studentId = currentUserObj._id;
        userId = studentId;

        console.log("User ID:", userId);
    } catch (error) {
        console.error("Failed to parse JSON:", error.message);
        console.error("User Id not found!");
    }
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editCard, setEditCard] = useState(null);
    const [deleteCard, setDeleteCard] = useState(null);
    const [Cards, setCards] = useState([]);
    const isById = false;
    const attr = 'card';
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
                    console.log(`No payment method found for your account. Please add a payment method.`);
                    setCards([]);
                    return;
                } else {
                    throw response;
                }
            }
            console.log("Payment methods successfully fetched:", response.paymentMethodList);
            setCards(response.paymentMethodList);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getPaymentMethodsList();
    }, [])

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
                    cookId: cookId,
                    isAvailable: isAvail
                }),
            });
            if (response.error) {
                throw response;
            }

            console.log("Dish successfully updated:", response.dish);
            await getDishesList();
        } catch (error) {
            alert(error);
        }
        // };
        // await updateDish();

        console.log(`Dish is now ${isAvail ? "Available" : "Unavailable"}`);
    };
    const handleOpenEditModal = (dish) => {
        setShowEditModal(true);
        setEditCard(dish);
    };

    const handleOpenDeleteModal = (dish) => {
        setShowDeleteModal(true);
        setDeleteCard(dish);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (Cards) {

        return (
            <div>
                <h2>Cards</h2>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mr: 1, width: '150px' }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    Add Card
                </Button>
                {showAddForm && (
                    <AddCard userId={userId} paymentMethods={Cards} refreshPaymentMethods={getPaymentMethodsList} closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />
                <Box
                    sx={{
                        mx: 'auto',
                        width: '80%',
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
                                    <TableCell sx={{ fontWeight: 'bold' }}>Card Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Cards.map((card) => (
                                    <TableRow key={card._id}>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                }}
                                                variant='h6'
                                                component='h3'
                                            >
                                                (**** **** **** {card.last4Digits})
                                            </Typography>
                                            <Typography>{card.type.toUpperCase()}</Typography>
                                            <Typography>{card.provider}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1, width: '100px', mr: 2 }}
                                                onClick={() => handleOpenEditModal(card)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 1, width: '100px' }}
                                                onClick={() => handleOpenDeleteModal(card)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                {showEditModal && (
                    <EditCard
                        isOpen={showEditModal}
                        userId={userId}
                        card={editCard}
                        handleClose={handleCloseModals}
                        refreshCards={getPaymentMethodsList}
                        attr={attr}
                    />
                )}

                {showDeleteModal && (
                    <DeleteCard
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        userId={userId}
                        deleteCard={deleteCard}
                        refreshCards={getPaymentMethodsList}
                        isById={isById}
                        attr={attr}
                    />
                )}
            </div>
        );
    }
}


export default CardsList;
