import React, { useState, useContext } from 'react';
import './../css/Login.css';
import {Navigate, Link} from 'react-router-dom';
import {AuthContext} from '../contexts/AccountContext';
import {useApi} from '../contexts/ApiContext';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../firebase/FirebaseFunctions';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import SocialSignIn from './SocialSignIn.jsx';
import SignUp from './Signup.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {currentUser} = useContext(AuthContext);
  const [error, setError] = useState('');
  // const { apiCall, loading, error } = useApi();

  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      if(error.message.trim() === "Firebase: Error (auth/invalid-credential)."){
        setError('No user found with that email');
      }
      else{
        setError(error.message);
      }
    }
  };

  const passwordReset = async (event) => {
    event.preventDefault();
    if (email) {
      try {
        await doPasswordReset(email);
        alert('Password reset email was sent');
      } catch (error) {
        setError(error.message);
      }
    } else {
      alert('Please enter an email address before clicking the forgot password link');
    }
  };
  if (currentUser) {
    if (currentUser.role === 'user') {
      return <Navigate to='/student' />;
    } else if (currentUser.role === 'cook') {
      return <Navigate to='/cook' />;
    }
    else {
      return <Navigate to='/additional/info' />;
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('Username:', username);
  //   console.log('Password:', password);
  //   try{
  //       const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ username, password }),
  //       });
  //       if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       console.log('Success: ', data);
  //   } catch (error){
  //     console.log(error);
  //   }
  // };

  return (
    <Container maxWidth="sm" style={{marginTop: "5%", marginBottom: "5%"}}>
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={passwordReset}
            sx={{ mt: 2 }}
          >
            Forgot Password
          </Button>
          <Link to="/signup">
            <Button
              fullWidth
              variant="text"
              color="secondary"
              sx={{ mt: 2 }}
            >
              Don't have an account? Sign Up
            </Button>
          </Link>
        </form>
        <Box sx={{ mt: 2 }}>
          <SocialSignIn />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;