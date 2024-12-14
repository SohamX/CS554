import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from "../../contexts/AccountContext";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

const StudentProfile = () => {
    const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext);
    const [editPersonalInfo, setEditPersonalInfo] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const navigate = useNavigate();
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
    //Mohini add states and variables below here
    const [personalInfo, setPersonalInfo] = useState({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        username: currentUser.username,
        gmail: currentUser.gmail,
        mobileNumber: currentUser.mobileNumber,
    });
    const [address, setAddress] = useState({
        address: currentUser.location.address,
        city: currentUser.location.city,
        state: currentUser.location.state,
        zipcode: currentUser.location.zipcode,
        country: currentUser.location.country,
    });

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    //Mohini add functions below here
    const handleViewPaymentDetails = () => {
        navigate('/student/cardDetails', { state: { userId } });
    };



    return (
        <Container maxWidth="sm" style={{ marginTop: "3%", marginBottom: "4%" }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Student Profile
            </Typography>
            <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Personal Information</Typography>
                <form>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        name="firstName"
                        value={personalInfo.firstName}
                        disabled
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="lastName"
                        value={personalInfo.lastName}
                        disabled
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="gmail"
                        value={personalInfo.gmail}
                        disabled
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        name="mobileNumber"
                        value={personalInfo.mobileNumber}
                        onChange={handlePersonalInfoChange}
                        disabled={!editPersonalInfo}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={personalInfo.username}
                        onChange={handlePersonalInfoChange}
                        disabled={!editPersonalInfo}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => setEditPersonalInfo(!editPersonalInfo)}
                        sx={{ mt: 2 }}
                    >
                        {editPersonalInfo ? "Save" : "Edit"}
                    </Button>
                </form>
            </Box>
            <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Saved Address</Typography>
                <form>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        name="address"
                        value={address.address}
                        onChange={handleAddressChange}
                        disabled={!editAddress}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="City"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        disabled={!editAddress}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="State"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        disabled={!editAddress}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Zipcode"
                        name="zipcode"
                        value={address.zipcode}
                        onChange={handleAddressChange}
                        disabled={!editAddress}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Country"
                        name="country"
                        value={address.country}
                        onChange={handleAddressChange}
                        disabled={!editAddress}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => setEditAddress(!editAddress)}
                        sx={{ mt: 2 }}
                    >
                        {editAddress ? "Save" : "Edit"}
                    </Button>
                </form>
            </Box>
            <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Payment Info</Typography>
                <p>Press the button below to view your payment details.</p>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleViewPaymentDetails}
                >
                    View
                </Button>
            </Box>
            <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Favourites</Typography>
                <p>Favourite items will be displayed here.</p>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Edit
                </Button>
            </Box>
            <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Past Orders</Typography>
                <p>Past orders will be displayed here.</p>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Edit
                </Button>
            </Box>
        </Container>
    );
};

export default StudentProfile;