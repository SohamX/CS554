import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
export const AuthContext = React.createContext();
import { useApi } from './ApiContext';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();
    const { apiCall, loading, error } = useApi();

    const auth = getAuth();
    useEffect(() => {
        let myListener = onAuthStateChanged(auth, async (user) => {
          if(user){
            try {
              const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ gmail: user.email }),
              });
              setCurrentUser(response.data);
              console.log('onAuthStateChanged', response.data);
              setLoadingUser(false);
            } catch (error) {
                console.error('Error getting user data:', error);
                if (error.error==='No user or cook found with that gmail'){
                  alert('User not found, please sign up first');
                  setLoadingUser(false); 
                  navigate('/additional/info', {
                    state: { message: 'Hello from MyComponent!', firstName: user.displayName.split(' ')[0], lastName: user.displayName.split(' ')[1], gmail: user.email},
                  });
                }
                else{
                  alert(error);
                }
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
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  );
};