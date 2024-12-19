import React, { useContext, useEffect, useState } from 'react';
import AddCard from './AddCard.jsx';
import EditCard from './EditCard.jsx';
import DeleteCard from './DeleteCard.jsx';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch, Grid2, CardContent } from '@mui/material';
import { useApi } from '../../contexts/ApiContext.jsx';
import { AuthContext } from '../../contexts/AccountContext.jsx';
import VisaLogo from '../../assets/Visa.png';
import MasterCardLogo from '../../assets/Mastercard.svg';
import AmericanExpressLogo from '../../assets/American_Express.png';


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

    const getCardLogo = (provider) => {
        switch (provider.toLowerCase()) {
            case 'visa':
                return VisaLogo;
            case 'mastercard':
                return MasterCardLogo;
            case 'american express':
                return AmericanExpressLogo;
            default:
                return '';
        }
    }

    if (Cards) {

        return (
            <div>
                <h2>Your Card:</h2>
                {Cards.length === 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, mr: 1, width: '150px' }}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        Add Card
                    </Button>
                )}
                {showAddForm && (
                    <AddCard userId={userId} paymentMethods={Cards} refreshPaymentMethods={getPaymentMethodsList} closeAddFormState={closeAddFormState} />
                )}
                <Box
                    sx={{
                        mx: 'auto',
                        width: '50%',
                        mt: 3,
                        p: 3,
                    }}
                >
                    <Grid2 container spacing={3}>
                        {Cards.map((card) => (
                            <Grid2 item xs={12} md={6} lg={4} key={card._id}>
                                <Card sx={{ boxShadow: 3, p: 2, borderRadius: 2 }}>
                                    <CardContent sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        textAlign: 'center',
                                        flexDirection: 'column',
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <img src={getCardLogo(card.provider)} alt={card.provider} style={{ width: 50, marginRight: 10 }} />
                                            <Typography variant='h6' component='h3'>
                                                (**** **** **** {card.last4Digits})
                                            </Typography>
                                        </Box>
                                        <Typography>{card.type.toUpperCase()}</Typography>
                                        <Typography>Card Provider: {card.provider}</Typography>
                                        <Typography>Card Holder Name: {card.cardHolderName}</Typography>
                                        <Typography>Nickname: {card.nickName}</Typography>
                                        <Typography>Expiration: {card.expirationDate}</Typography>
                                        <Typography>Billing Zipcode: {card.zipcode}</Typography>
                                        <Typography>Country: {card.country}</Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 1, width: '100px' }}
                                                onClick={() => handleOpenDeleteModal(card)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                    {/* <TableContainer component={Card}
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
                                    <TableCell sx={{ fontWeight: 'bold' }}>Remove Card</TableCell>
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
                                            {/* <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1, width: '100px', mr: 2 }}
                                                onClick={() => handleOpenEditModal(card)}
                                            >
                                                Edit
                                            </Button> */}
                                            {/*<Button
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
                    </TableContainer> */}
                </Box>
                {/* {showEditModal && (
                    <EditCard
                        isOpen={showEditModal}
                        userId={userId}
                        card={editCard}
                        handleClose={handleCloseModals}
                        refreshCards={getPaymentMethodsList}
                        attr={attr}
                    />
                )} */}

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
                    {Cards.length !== 0 ? (
                        <Typography>
                            Note: You can only have one card at a time. If you add a new card or edit the old card, please delete the old card.
                        </Typography>
                    ) : (
                        <Typography>
                            Note: You can only have one card at a time. Please add a card to make payments.
                        </Typography>
                    )}
                </Box>
            </div>
        );
    }
}


export default CardsList;
