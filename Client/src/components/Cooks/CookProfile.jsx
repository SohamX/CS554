import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import { Container, Typography, TextField, Button, Box, Grid, Avatar, FormControlLabel, Switch } from "@mui/material";
import { getLocation, getCoordinatesFromAddress, getDistance } from '../../helpers/constants.js';

const CookProfile = () => {
    const { apiCall, loading, error } = useApi();
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [editPersonalInfo, setEditPersonalInfo] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        gmail: '',
        mobileNumber: '',
        bio: '',
      });
    const [address, setAddress] = useState({
        address: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
    });
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [userId, setUserId] = useState(null);
    const [isAvailable, setAvailability] = useState(false);
    //Mohini add states and variables below here

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

    const handlePISubmit = async () => {
        let bodied = {}
        if(personalInfo.username === "" || !personalInfo.username){
            alert("Username cannot be empty");
            return;
        }
        if(currentUser.username !== personalInfo.username){
            bodied.username = personalInfo.username;
        }
        if(personalInfo.mobileNumber === "" || !personalInfo.mobileNumber){
            alert("Mobile number cannot be empty");
            return;
        }
        if (!/^\d{3}-\d{3}-\d{4}$/.test(personalInfo.mobileNumber)) {
            alert("Phone number must be in the format XXX-XXX-XXXX");
            return;
        }
        if(currentUser.mobileNumber !== personalInfo.mobileNumber){
            bodied.mobileNumber = personalInfo.mobileNumber;
        }
        if(personalInfo.bio === "" || !personalInfo.bio){
            alert("Bio cannot be empty");
            return;
        }
        if(currentUser.bio !== personalInfo.bio){
            bodied.bio = personalInfo.bio;
        }
        if(Object.keys(bodied).length === 0){
            setEditPersonalInfo(!editPersonalInfo);
            alert("No changes detected");
            return;
        }
        try {
            console.log(bodied);
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cooks/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...bodied,
                }),
            });
            if (response.error) {
                throw response;
            }
            setCurrentUser(response.cook);
            setEditPersonalInfo(!editPersonalInfo);
            alert("Personal info updated successfully!");
        } catch (error) {
            console.error("Failed to update personal info:", error);
            alert(Object.keys(error.error).length ? error.error : error.message ? error.message : "An error occurred");
        }
    };

    const handleADDSubmit = async () => {
        let bodied = {}
        if(address.address === "" || !address.address){
            alert("Address cannot be empty");
            return;
        }
        if(currentUser.location.address !== address.address){
            bodied.address = address.address;
        }
        if(address.city === "" || !address.city){
            alert("City cannot be empty");
            return;
        }
        if(currentUser.location.city !== address.city){
            bodied.city = address.city;
        }
        if(address.state === "" || !address.state){
            alert("State cannot be empty");
            return;
        }
        if(currentUser.location.state !== address.state){
            bodied.state = address.state;
        }
        if(address.zipcode === "" || !address.zipcode){
            alert("Zipcode cannot be empty");
            return;
        }
        if (!/^\d{5}$/.test(address.zipcode)) {
            alert("Zipcode must be 5 digits long");
            return;
        }
        if(currentUser.location.zipcode !== address.zipcode){
            bodied.zipcode = address.zipcode;
        }
        if(address.country === "" || !address.country){
            alert("Country cannot be empty");
            return;
        }
        if(currentUser.location.country !== address.country){
            bodied.country = address.country;
        }
        try {
            const position = await getLocation();
            if(location.latitude !== position.latitude || location.longitude !== position.longitude){
                bodied.latitude = position.latitude;
                bodied.longitude = position.longitude;
            }
        } catch (error) {
            console.error("Error getting location:", error);
        }
        if(Object.keys(bodied).length === 0){
            setEditAddress(!editAddress);
            alert("No changes detected");
            return;
        }
        let fullAddress = `${address.address}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`;
        const addlocation = await getCoordinatesFromAddress(fullAddress);
        if(!addlocation){
            alert("Invalid address");
            return;
        }
        const { latitude: addLat, longitude: addLng } = addlocation;
        let distance = 0;
        if(bodied.latitude && bodied.longitude){
            distance = getDistance(bodied.latitude, bodied.longitude, addLat, addLng);
        }
        else{
            distance = getDistance(location.latitude, location.longitude, addLat, addLng);
        }
        if (distance > 50) {
            const proceed = window.confirm(
                "Your address is far from current location. If this is intentional note that all the dishes and cooks will be displayed based on your address, not the actual location. Do you want to proceed?"
            );
            if (!proceed) {
                return;
            }
            else{
                bodied.latitude = addLat;
                bodied.longitude = addLng;
            }
        }
        
        try {
            console.log(bodied);
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cooks/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...bodied,
                }),
            });
            if (response.error) {
                throw response;
            }
            setCurrentUser(response.cook);
            setEditAddress(!editAddress);
            alert("Address updated successfully!");
        } catch (error) {
            console.error("Failed to update address:", error);
            alert(Object.keys(error.error).length ? error.error : error.message ? error.message : "An error occurred");
        }
    };

    const handleToggleChange = async(id) => {
        const isAvail = !isAvailable;
        console.log('event.target.checked: ', isAvail);
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cooks/availability/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isAvailable: isAvail
                }),
            });
            if (response.error) {
                throw response;
            }
            console.log("Dish successfully updated:", response.availability.availability);
            setAvailability(response.availability.availability)
        } catch (error) {
            alert(error);
        }
        console.log(`Dish is now ${isAvail ? "Available" : "Unavailable"}`);
    }

    useEffect(() => {
        setUserId(currentUser._id);
        setPersonalInfo({
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            username: currentUser?.username || '',
            gmail: currentUser?.gmail || '',
            mobileNumber: currentUser?.mobileNumber || '',
            bio: currentUser?.bio || '',
        });
        setAddress({
            address: currentUser?.location?.address || '',
            city: currentUser?.location?.city || '',
            state: currentUser?.location?.state || '',
            zipcode: currentUser?.location?.zipcode || '',
            country: currentUser?.location?.country || '',
        });
        setLocation({
            latitude: currentUser.location.coordinates?.latitude || null,
            longitude: currentUser.location.coordinates?.longitude || null,
        })
        setAvailability(currentUser.availability || false)
    }, [currentUser]);
    //Mohini add functions below here

    return (
        <Container maxWidth="sm" style={{ marginTop: "3%", marginBottom: "4%" }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Cook Profile
            </Typography>
            <Grid item>
                <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
                    {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                </Avatar>
                 <FormControlLabel
                    control={
                        <Switch
                            checked={isAvailable}
                            onChange={() => handleToggleChange(currentUser._id)}
                            color="primary"
                        />
                    }
                    label={isAvailable ? "Available" : "Unavailable"}
                />
            </Grid>
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
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Bio"
                        name="bio"
                        value={personalInfo.bio}
                        onChange={handlePersonalInfoChange}
                        disabled={!editPersonalInfo}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => editPersonalInfo ? handlePISubmit() : setEditPersonalInfo(!editPersonalInfo)}
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
                        onClick={() => editAddress ? handleADDSubmit() : setEditAddress(!editAddress)}
                        sx={{ mt: 2 }}
                    >
                        {editAddress ? "Save" : "Edit"}
                    </Button>
                </form>
            </Box>
            <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Payment Info</Typography>
                <p>Payment information will be displayed here.</p>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Edit
                </Button>
            </Box>
            {/* <Box mb={6} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5">Favourites</Typography>
                <p>Favourite items will be displayed here.</p>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Edit
                </Button>
            </Box> */}
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

export default CookProfile;