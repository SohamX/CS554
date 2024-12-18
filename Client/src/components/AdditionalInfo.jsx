import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { Container, TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import { AuthContext } from '../contexts/AccountContext';
import { getLocation, getCoordinatesFromAddress, getDistance } from '../helpers/constants.js';

const AdditionalInfo = () => {
    const [role, setRole] = useState('student');
    const { message = "", firstName = "", lastName = "", gmail = ""} = useLocation().state || {};
    const statesFF = [
        "Alabama - AL", "Alaska - AK", "Arizona - AZ", "Arkansas - AR", "California - CA",
        "Colorado - CO", "Connecticut - CT", "Delaware - DE", "Florida - FL", "Georgia - GA",
        "Hawaii - HI", "Idaho - ID", "Illinois - IL", "Indiana - IN", "Iowa - IA",
        "Kansas - KS", "Kentucky - KY", "Louisiana - LA", "Maine - ME", "Maryland - MD",
        "Massachusetts - MA", "Michigan - MI", "Minnesota - MN", "Mississippi - MS",
        "Missouri - MO", "Montana - MT", "Nebraska - NE", "Nevada - NV", "New Hampshire - NH",
        "New Jersey - NJ", "New Mexico - NM", "New York - NY", "North Carolina - NC",
        "North Dakota - ND", "Ohio - OH", "Oklahoma - OK", "Oregon - OR", "Pennsylvania - PA",
        "Rhode Island - RI", "South Carolina - SC", "South Dakota - SD", "Tennessee - TN",
        "Texas - TX", "Utah - UT", "Vermont - VT", "Virginia - VA", "Washington - WA",
        "West Virginia - WV", "Wisconsin - WI", "Wyoming - WY"
    ]
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [formData, setFormData] = useState({
        firstName: firstName,
        lastName: lastName,
        username: '',
        gmail: gmail,
        mobileNumber: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        bio: '',
    });
    const navigate = useNavigate();
    const { apiCall, loading, error } = useApi();
    const { setCurrentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!message) {
            navigate('/');
        }
    }, [message]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobileNumber') {
            const formattedValue = formatMobileNumber(value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: formattedValue,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const formatMobileNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join('-');
        }
        return value;
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = role === 'student' ? `${import.meta.env.VITE_SERVER_URL}/users/register` : `${import.meta.env.VITE_SERVER_URL}/cooks/register`;
        try {
            if(!location.latitude || !location.longitude){
                throw {error: 'Please enable location services to continue'};
            }
            // verification of address
            let fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}`;
            const addressLocation = await getCoordinatesFromAddress(fullAddress);
            if(!addressLocation){
                throw {error: 'Invalid address'};
            }
            const distance = getDistance(location.latitude, location.longitude, addressLocation.latitude, addressLocation.longitude);
            if(distance > 50){
                const proceed = window.confirm(
                    "Your address is far from current location. If this is intentional note that all the dishes and cooks will be displayed based on your address, not the actual location. Do you want to proceed?"
                );
                if (!proceed) {
                    return;
                }
                else{
                    setLocation(addressLocation);
                }
            }
            // over
            let body = {...formData, ...location};
            const response = await apiCall(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if(response.error){
                throw response;
            }
            if(role === 'student'){
                const data = await response.user;
                console.log('Success:', data);
                setCurrentUser(data);
            } else {
                const data = await response.cook;
                console.log('Success:', data);
                setCurrentUser(data);
            }
            navigate(role === 'student' ? '/student' : '/cook');
        } catch (error) {
            console.error('Error:', error);
            alert(error.error);
        }
    };

    

    return (
        <Container maxWidth="sm" style={{marginTop: "3%", marginBottom: "4%"}}>
            <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Additional Information
                </Typography>
                <FormControl component="fieldset">
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup row value={role} onChange={handleRoleChange}>
                    <FormControlLabel value="student" control={<Radio />} label="Student" />
                    <FormControlLabel value="cook" control={<Radio />} label="Cook" />
                </RadioGroup>
                </FormControl>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                    {/* <TextField
                        fullWidth
                        margin="normal"
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    /> */}
                    <FormControl fullWidth margin="normal" required>
                        <Select
                            // label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select State
                            </MenuItem>
                            {statesFF.map((state) => (
                                <MenuItem key={state} value={state}>
                                    {state}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    />
                    {role === 'cook' && (
                        <TextField
                        fullWidth
                        margin="normal"
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        />
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default AdditionalInfo;