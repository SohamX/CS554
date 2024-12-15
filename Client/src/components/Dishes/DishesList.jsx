import React, { useContext, useEffect, useState } from 'react';
import AddDish from './AddDish.jsx';
import EditDish from './EditDish.jsx';
import DeleteDish from './DeleteDish.jsx';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';


function DishesList() {
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);
    let str = JSON.stringify(currentUser, null, 2);
    const [cookId, setCookId] = useState(currentUser._id || '');

    useEffect(() => {
        setCookId(currentUser._id);
    }, [currentUser]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editDish, setEditDish] = useState(null);
    const [deleteDish, setDeleteDish] = useState(null);
    const [dishes, setDishes] = useState(null);
    const isById = false;
    const attr = 'dish';
    const getDishesList = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/cook/${cookId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }

            console.log("Dishes successfully fetched:", response.dishes);
            setDishes(response.dishes);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getDishesList();
    }, [cookId])

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
        setEditDish(dish);
    };

    const handleOpenDeleteModal = (dish) => {
        setShowDeleteModal(true);
        setDeleteDish(dish);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (dishes) {

        return (
            <div>
                <h2>Dishes</h2>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mr: 1 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    Add Dish
                </Button>
                {showAddForm && (
                    <AddDish type='dish' cookId={cookId} refreshDishes={getDishesList} closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />
                <Box
                    sx={{
                        mx: 'auto',
                        width: '100%',
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
                                {dishes.map((dish) => (
                                    <TableRow key={dish._id}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <img
                                                    src={dish.imageUrl}
                                                    alt={dish.name}
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                    }}
                                                />
                                                <Link to={{
                                                    pathname: `/cook/dishes/${dish._id}`,
                                                    state: { refreshDishes: getDishesList }
                                                }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                        variant='h6'
                                                        component='h3'
                                                    >
                                                        {dish.name}
                                                    </Typography>
                                                </Link>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={dish.isAvailable}
                                                        onChange={(event) => handleToggleChange(event, dish._id)}
                                                        color="primary"
                                                    />
                                                }
                                                label={dish.isAvailable ? "Available" : "Unavailable"}
                                            />
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleOpenEditModal(dish)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleOpenDeleteModal(dish)}
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
                    <EditDish
                        isOpen={showEditModal}
                        dish={editDish}
                        handleClose={handleCloseModals}
                        refreshDishes={getDishesList}
                        attr={attr}
                    />
                )}

                {showDeleteModal && (
                    <DeleteDish
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteDish={deleteDish}
                        refreshDishes={getDishesList}
                        isById={isById}
                        attr={attr}
                    />
                )}
            </div>
        );
    }
    // else if (loading) {
    //     return (<div>
    //         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    //             <Typography>Loading</Typography>
    //         </Box>
    //     </div>);
    // }
    // else if (error) {
    //     return (<div>
    //         <Box display="flex" justifyContent="center" mt={5}>
    //             <Typography color="error">Error: {error.message}</Typography>
    //         </Box>
    //     </div>
    //     );
    // }
}


export default DishesList;
