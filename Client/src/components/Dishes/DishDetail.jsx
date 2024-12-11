import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditDish from './EditDish.jsx';
import DeleteDish from './DeleteDish.jsx';
import { useApi } from '../../contexts/ApiContext';
import { Card, CardContent, CardHeader, Typography, Button, Box, Grid, FormControlLabel, Switch } from '@mui/material';


function DishDetail(props) {
    const { id } = useParams();
    const { apiCall } = useApi();
    const [dish, setDish] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editDish, setEditDish] = useState(null);
    const [deleteDish, setDeleteDish] = useState(null);
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


    if (dish) {

        return (
            <div>
                <h2>Dish</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
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
                        </CardContent>
                    </Card>
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
                    </Box>

                    {showEditModal && (
                        <EditDish
                            isOpen={showEditModal}
                            dish={editDish}
                            handleClose={handleCloseModals}
                            refreshDishes={getDish}
                            attr={attr}
                        />
                    )}

                    {showDeleteModal && (
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
