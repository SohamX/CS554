import React, { useContext, useState } from 'react';
import { Button, Typography, Box, TextField, Card, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext.jsx';
import { AuthContext } from '../../contexts/AccountContext.jsx';
import helpers from '../../helpers/pranHelpers.js';
import { cuisineTypeEnum } from '../../helpers/constants.js';
import { validateCost, checkDishDesc } from '../../helpers/validationHelper.js';

function AddDish(props) {
    const navigate = useNavigate();
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [cost, setCost] = useState('');
    const cookId = props.cookId;

    const handleCuisineTypeChange = (event) => {
        setCuisineType(event.target.value);
    };

    const handleCostChange = (e) => {
        let value = e.target.value;
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

    const onSubmitDish = async (e) => {
        try {
            e.preventDefault();
            let name = document.getElementById('name');
            let description = document.getElementById('description');
            let cost = document.getElementById('cost');
            let nameVal;
            let descriptionVal;
            let costVal;
            let errors = [];
            if (name) {
                try {
                    nameVal = helpers.checkString(name.value, 'Dish name');
                } catch (err) {
                    errors.push(err);
                }
            }
            if (description) {
                try {
                    descriptionVal = checkDishDesc(description.value, 'Description');
                } catch (err) {
                    errors.push(err);
                }
            }
            if (cost) {
                try {
                    costVal = validateCost(parseFloat(cost.value), 'Cost');
                    setCost(costVal);
                } catch (err) {
                    errors.push(err);
                }
            }

            if (errors.length > 0) {
                setError(true);
                setErrorMsg(errors.join('\n'));
                return;
            }
            const addDish = async () => {
                try {
                    const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/`, {
                        method: 'POST',
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
                        throw response;
                    }

                    console.log("Dish successfully added:", response.dish);
                } catch (error) {
                    alert(error);
                }
            };

            await addDish();
            // navigate('/cook/dishes');
            props.refreshDishes();
            document.getElementById('add-dish').reset();
            setLoading(false);
            alert('Dish Added');
            props.closeAddFormState();
        } catch (e) {
            setError(true);
            const errorMessage = e.message ? e.message : e;
            setErrorMsg("Error adding dish:" + errorMessage);
        }
    };


    console.log('Cuisine Types:', cuisineTypeEnum);


    let body = null;
    if (props.type === 'dish') {
        body = (

            <div className='card'>
                <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
                    <Card
                        sx={{
                            width: '100%',
                            maxWidth: 500,
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 3
                        }}
                    >
                        <form id="add-dish" onSubmit={onSubmitDish}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Add Dish
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

                            <Box display="flex" flexDirection="column" gap={3}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    autoFocus
                                />
                                <TextField
                                    id="description"
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    multiline
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="cuisineType-label">Cuisine Type *</InputLabel>
                                    <Select
                                        labelId="cuisineType-label"
                                        id="cuisineType"
                                        label="CuisineType"
                                        defaultValue=""
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
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={cost}
                                    onChange={handleCostChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        inputMode: 'decimal'
                                    }}
                                />
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={3}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ mr: 1 }}
                                >
                                    Add Dish
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="string"
                                    fullWidth
                                    sx={{ ml: 1 }}
                                    onClick={() => {
                                        document.getElementById('add-dish').reset();
                                        props.closeAddFormState();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Box>
            </div>
        );
    }
    return <div>{body}</div>;
}

export default AddDish;
