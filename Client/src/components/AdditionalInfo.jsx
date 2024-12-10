import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { Container, TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { AuthContext } from '../contexts/AccountContext';

const AdditionalInfo = () => {
    const [role, setRole] = useState('student');
    const { message, firstName, lastName, gmail } = useLocation().state;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        gmail: '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = role === 'student' ? '/users/register' : '/cooks/register';
        try {
        const response = await apiCall(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.data.json();
        console.log('Success:', data);
        setCurrentUser(data);
        navigate(role === 'student' ? '/students' : '/cooks');
        } catch (error) {
        console.error('Error:', error);
        alert(error);
        }
    };

    if (message!=="Hello from MyComponent!"){
        navigate('/');
    }

    return (
        <Container maxWidth="sm">
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
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        defaultValue={firstName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        defaultValue={lastName}
                        onChange={handleChange}
                        required
                    />
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
                        label="Gmail"
                        name="gmail"
                        value={formData.gmail}
                        defaultValue={gmail}
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
                    <TextField
                        fullWidth
                        margin="normal"
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
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