import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ApiProvider } from './contexts/ApiContext';
import { AuthProvider } from './contexts/AccountContext';
import withRouter from './contexts/withRouter.jsx';
import Login from './components/Login';
import Signup from './components/Signup';
import Student from './components/Student/Student.jsx';
import PageNotFound from './components/PageNotFound';
import PrivateRoute from './components/PrivateRoute';
import AdditionalInfo from './components/AdditionalInfo.jsx';
import Navigation from './components/Navigation.jsx';
import Cook from './components/Cooks/Cooks.jsx';
import DishesList from './components/Dishes/DishesList.jsx';
import DishDetail from './components/Dishes/DishDetail.jsx';

const AuthProviderWithRouter = withRouter(AuthProvider);

function App() {

  return (
    <ApiProvider>
      <Router>
        <AuthProviderWithRouter>
          <div className='App'>
            <header className='App-header'>
              <Navigation />
            </header>
            <div className='App-body'>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/additional/info" element={<AdditionalInfo />} />
                <Route path="/student" element={<PrivateRoute requiredRole="user" />} >
                  <Route path="/student" element={<Student />} />
                </Route>
                <Route path="/cook/dishes" element={<PrivateRoute requiredRole="cook" />} >
                  <Route path="/cook/dishes" element={<DishesList />} />
                </Route>
                <Route path="/cook/dishes/:id" element={<PrivateRoute requiredRole="cook" />} >
                  <Route path="/cook/dishes/:id" element={<DishDetail />} />
                </Route>
                <Route path="/cook" element={<PrivateRoute requiredRole="cook" />} >
                  <Route path="/cook" element={<Cook />} />
                </Route>

                <Route path='/*' element={<PageNotFound />} />
              </Routes>
            </div>
          </div>
        </AuthProviderWithRouter>
      </Router>
    </ApiProvider>
  );
}

export default App;