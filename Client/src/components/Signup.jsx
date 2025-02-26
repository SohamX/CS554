import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../contexts/AccountContext';
import SocialSignIn from './SocialSignIn';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, passwordOne, passwordTwo } = e.target.elements;
        firstName.value = firstName.value.trim();
        lastName.value = lastName.value.trim();
        email.value = email.value.trim();
        passwordOne.value = passwordOne.value.trim();
        passwordTwo.value = passwordTwo.value.trim();
        if(firstName.value === '' || lastName.value === '' || email.value === '' || passwordOne.value === '' || passwordTwo.value === '') {
            alert('Please fill out all fields');
            return false;
        }
        if(firstName.value.length < 2){
            alert('First name must be at least 2 characters long');
            return false;
        }
        if(lastName.value.length < 2){
            alert('Last name must be at least 2 characters long');
            return false;
        }
        if(!email.value.includes('@') || !email.value.includes('.')){
            alert('Please enter a valid email address');
            return false;
        }
        email.value = email.value.toLowerCase();
        if(passwordOne.value.length < 6){
            alert('Password must be at least 6 characters long');
            return false;
        }
        if (passwordOne.value !== passwordTwo.value) {
            setPwMatch('Passwords do not match');
            return false;
        }

        try {
            await doCreateUserWithEmailAndPassword(
                email.value,
                passwordOne.value,
                firstName.value + ' ' + lastName.value
            );
            navigate('/additional/info', {
                state: { message: 'Hello from MyComponent!', firstName: firstName.value, lastName: lastName.value, gmail: email.value},
            });
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser) {
        return <Navigate to='/home' />;
    }

    return (
        <Container maxWidth="sm" style={{marginTop: "1%"}}>
            <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                {pwMatch && <Alert severity="error">{pwMatch}</Alert>}
                <form onSubmit={handleSignUp}>
                    <div style={{ display: "flex", direction: "row", justifyContent: "space-between"}}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="firstName"
                            name="firstName"
                            type="text"
                            required
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="lastName"
                            name="lastName"
                            type="text"
                            required
                        />
                    </div>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        name="passwordOne"
                        type="password"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm Password"
                        name="passwordTwo"
                        type="password"
                        required
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Sign Up
                    </Button>
                </form>
                <Box sx={{ mt: 2 }}>
                    <SocialSignIn />
                </Box>
            </Box>
        </Container>
    );
}

export default SignUp;