import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../contexts/AccountContext';
import SocialSignIn from './SocialSignIn';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const handleSignUp = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, passwordOne, passwordTwo } = e.target.elements;
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