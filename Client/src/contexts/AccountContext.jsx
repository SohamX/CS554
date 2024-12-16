import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useApi } from './ApiContext';

export const AuthContext = React.createContext();

export const AuthProvider = ({children, navigate}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const { apiCall } = useApi();

    const auth = getAuth();
    useEffect(() => {
        let myListener = onAuthStateChanged(auth, async (user) => {
          if(user && user.displayName){
            setLoadingUser(true);
            try {
              const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ gmail: user.email }),
              });
              if(response.error){
                throw response;
              }
              setCurrentUser(response.data);
              console.log('onAuthStateChanged', response);
            } catch (error) {
                console.log('user', user);
                console.error('Error getting user data:', error.error);
                if (error.error==='No user or cook found with that gmail'){
                  alert('We need some more information to create your account. Please fill out the form on the next page.');
                  navigate('/additional/info', {
                    state: { message: 'Hello from MyComponent!', firstName: user.displayName.split(' ')[0], lastName: user.displayName.split(' ')[1], gmail: user.email},
                  });
                }
                else{
                  alert(error);
                }
            } finally{
              setLoadingUser(false); 
            }
          }
          else{
            setCurrentUser(null);
            setLoadingUser(false);
          }     
        });
        return () => {
          if (myListener) myListener();
        };
    }, []);

  if (loadingUser) {
    return (
        <Backdrop
            style={{ opacity: 1, visibility: 'visible'}}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
  }

  return (
    <AuthContext.Provider value={{currentUser, setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
};