import React, { useContext, useState } from 'react';

import ReactModal from 'react-modal';

import { Button, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';
import helpers from '../../helpers/pranHelpers.js';
import { cuisineTypeEnum } from '../../helpers/constants.js';
import { validateCost, checkDishDesc } from '../../helpers/validationHelper.js';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function EditDish(props) {
    const navigate = useNavigate();
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const attr = props.attr;
    if (attr == 'dish') {

        const [dish, setDish] = useState(props.dish);
        console.log('dish.cuisineType: ' + dish.cuisineType);
        const [cookId, setCookId] = useState(dish.cookId || '');
        const [name, setName] = useState(dish.name || '');
        const [description, setDescription] = useState(dish.description || '');
        const [cuisineType, setCuisineType] = useState(dish.cuisineType || '');
        const [cost, setCost] = useState(dish.cost || '');
        // const [isAvailable, setIsAvailable] = useState(dish.isAvailable || false);
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const [dataModified, setDataMofidied] = useState(false);

        // const handleToggleChange = (event) => {
        //     setIsAvailable(event.target.checked);
        //     console.log(`Dish is now ${event.target.checked ? "Available" : "Unavailable"}`);
        // };

        const handleCuisineTypeChange = (event) => {
            if (dish.cuisineType != event.target.value.trim()) {
                setDataMofidied(true);
            }
            setCuisineType(event.target.value);
        };

        const handleNameChange = (event) => {
            if (dish.name != event.target.value.trim()) {
                setDataMofidied(true);
            }
            setName(event.target.value);
        };

        const handleDescChange = (event) => {
            if (dish.description != event.target.value.trim()) {
                setDataMofidied(true);
            }
            setDescription(event.target.value);
        };

        const handleCostChange = (e) => {
            let value = e.target.value.trim();
            console.log('value: ' + value);
            if (cost != value) {
                setDataMofidied(true);
            }
            value = value.replace(/[^0-9.]/g, '');
            if (/^\d*\.?\d{0,2}$/.test(value)) {
                setCost(value);
            }
        };

        const handleBlur = () => {
            if (cost) {
                const formattedValue = parseFloat(cost).toFixed(2);
                setCost(formattedValue);
            }
        };

        const handleCloseEditModal = () => {
            setShowEditModal(false);
            setDish(null);

            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel='Edit Dish'
                    style={customStyles}
                >
                    <Typography variant="h5" gutterBottom>
                        Edit
                    </Typography>
                    {error && <Typography
                        variant="body1"
                        align="center"
                        gutterBottom
                        className='errorMessage'
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        {errorMsg}
                    </Typography>}
                    <form

                        className='form'
                        id='add-dish'
                        onSubmit={async (e) => {
                            try {
                                e.preventDefault();
                                setDataMofidied(false);
                                setError(false);
                                setErrorMsg('');
                                let nameF = document.getElementById('name');
                                let descriptionF = document.getElementById('description');
                                let costF = document.getElementById('cost');
                                console.log('costF: ' + costF.value);
                                let nameVal = name;
                                let descriptionVal = description;
                                let costVal = cost;
                                let errors = [];

                                let id = props.dish._id;
                                // try {
                                //     id = validateId(id);
                                // } catch (err) {
                                //     errors.push(err);
                                // }

                                if (nameF) {
                                    try {
                                        if (name != nameF.value.trim()) {
                                            setDataMofidied(true);
                                        }
                                        nameVal = helpers.checkString(nameF.value, 'Dish Name');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (descriptionF) {
                                    try {
                                        if (description !== descriptionF.value.trim()) {
                                            setDataMofidied(true);
                                        }
                                        descriptionVal = checkDishDesc(descriptionF.value, 'Description');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (costF) {
                                    try {
                                        costVal = validateCost(parseFloat(costF.value), 'Cost');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (!dataModified) {
                                    errors.push(`No modifications made to the data to update.`);
                                }
                                if (errors.length > 0) {
                                    setError(true);
                                    setErrorMsg(errors.join('\n'));
                                    return;
                                }

                                const updateDish = async () => {
                                    try {
                                        const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/${id}`, {
                                            method: 'PATCH',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                cookId: cookId,
                                                name: nameVal,
                                                description: descriptionVal,
                                                cuisineType: cuisineType,
                                                cost: costVal
                                            }),
                                        });
                                        if (response.error) {
                                            console.log('error: ' + response.error);
                                            throw response.error;
                                        }

                                        console.log("Dish successfully updated:", response.dish);
                                    } catch (error) {
                                        alert(error);
                                    }
                                };

                                await updateDish();

                                setShowEditModal(false);

                                alert('Dish Updated');
                                props.refreshDishes();
                                props.handleClose();
                            } catch (e) {
                                setError(true);
                                const errorMessage = e.message ? e.message : e;
                                setErrorMsg("Error editing dish:" + errorMessage);
                            }

                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                id="name"
                                label="Name"
                                name="name"
                                defaultValue={name}
                                variant="outlined"
                                fullWidth
                                required
                                onChange={handleNameChange}
                            />
                            <TextField
                                id="description"
                                label="Description"
                                name="description"
                                defaultValue={description}
                                variant="outlined"
                                fullWidth
                                required
                                multiline
                                onChange={handleDescChange}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="cuisineType-label">Cuisine Type *</InputLabel>
                                <Select
                                    labelId="cuisineType-label"
                                    id="cuisineType"
                                    label="CuisineType"
                                    value={cuisineType}
                                    onChange={handleCuisineTypeChange}
                                >
                                    {Object.entries(cuisineTypeEnum).map(([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                id="cost"
                                label="Cost"
                                name="cost"
                                type="text"
                                variant="outlined"
                                fullWidth
                                required
                                defaultValue={cost}
                                onChange={handleCostChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    inputMode: 'decimal'
                                }}
                            />
                            {/* <FormControlLabel
                                control={
                                    <Switch
                                        checked={isAvailable}
                                        onChange={handleToggleChange}
                                        color="primary"
                                    />
                                }
                                label={isAvailable ? "Available" : "Unavailable"}
                            /> */}

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="string"
                                    onClick={handleCloseEditModal}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </ReactModal>
            </div>
        );
    }


}

export default EditDish;