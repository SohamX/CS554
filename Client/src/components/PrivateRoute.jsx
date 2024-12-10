import {Navigate, Outlet} from 'react-router-dom';
import React, {useContext} from 'react';
import {AuthContext} from '../contexts/AccountContext';

const PrivateRoute = ({ requiredRole }) => {
  const {currentUser} = useContext(AuthContext);

  if (currentUser) {
    if (requiredRole && currentUser.role !== requiredRole) {
      return <Navigate to="/" replace={true} />;
    }
    return <Outlet />;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default PrivateRoute;