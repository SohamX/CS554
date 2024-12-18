import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ApiProvider } from './contexts/ApiContext';
import { AuthProvider } from './contexts/AccountContext';
import { CartProvider } from './contexts/CartContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
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
import PendingMR from './components/Student/MealReqs/PendingMR.jsx';
import AddMealReq from './components/Student/MealReqs/AddMealReq.jsx';
import MealReq from './components/Student/MealReqs/MealReq.jsx';
import AcceptedMR from './components/Student/MealReqs/AcceptedMR.jsx';
import CartDetails from './components/Cart/CartDetails.jsx';
import StudentProfile from './components/Student/StudentProfile.jsx';
import CookProfile from './components/Cooks/CookProfile.jsx';
import CheckoutDetails from './components/Payment/CheckoutDetails.jsx';
import AddCard from './components/Payment/AddCard.jsx';
import PendingMRCook from './components/Cooks/MealReqs/PendingMRCook.jsx';
import AwaitingMRCook from './components/Cooks/MealReqs/AwaitingMRCook.jsx';
import AcceptedMRCook from './components/Cooks/MealReqs/AcceptedMRCook.jsx';
import CardsList from './components/Payment/CardsList.jsx';
import OrderConfirmation from './components/Orders/OrderConfirmation.jsx';
import OrdersList from './components/Orders/OrdersList.jsx';
import OrderDetail from './components/Orders/OrderDetail.jsx';
import CookDetails from './components/Cooks/CookDetails.jsx';
import StudentDetails from './components/Student/StudentDetails.jsx';
import History from './components/Dishes/History.jsx';
import FloatingChatWidget from './components/Chat/ChatRoom.jsx';
import CooksForYou from './components/Student/CooksForYou.jsx';



const AuthProviderWithRouter = withRouter(AuthProvider);

function App() {

  return (
    <ApiProvider>
      <Router>
        <AuthProviderWithRouter>
          <CartProvider>
            <SocketProvider>
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
                      <Route path="/student/dishes/:id" element={<DishDetail />} />
                      <Route path="/student/cook/:id" element={<CookDetails />} />
                    </Route>
                    <Route path="/student/cart" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/cart" element={<CartDetails />} />
                    </Route>
                    <Route path="/student/checkout" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/checkout" element={<CheckoutDetails />} />
                    </Route>
                    <Route path="/student/addCard" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/addCard" element={<AddCard />} />
                    </Route>
                    <Route path="/student/cardDetails" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/cardDetails" element={<CardsList />} />
                    </Route>
                    <Route path="/student/orderConfirmation" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/orderConfirmation" element={<OrderConfirmation />} />
                    </Route>
                    <Route path="/student/orders" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/orders" element={<OrdersList />} />
                    </Route>
                    <Route path="/student/orders/:id" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/orders/:id" element={<OrderDetail />} />
                    </Route>
                    <Route path="/cook/orders" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/cook/orders" element={<OrdersList />} />
                    </Route>
                    <Route path="/cook/orders/:id" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/cook/orders/:id" element={<OrderDetail />} />
                    </Route>
                    <Route path="/cook/dishes" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/cook/dishes" element={<DishesList />} />
                    </Route>
                    <Route path="/cook/dishes/:id" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/cook/dishes/:id" element={<DishDetail />} />
                    </Route>
                    <Route path="/mealReqs/users/pending" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/mealReqs/users/pending" element={<PendingMR />} />
                    </Route>
                    <Route path="/mealReqs/cooks/pending" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/mealReqs/cooks/pending" element={<PendingMRCook />} />
                    </Route>
                    <Route path="/mealReqs/add" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/mealReqs/add" element={<AddMealReq />} />
                    </Route>
                    <Route path="/mealReqs/pending/:mealReqId/responses" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/mealReqs/pending/:mealReqId/responses" element={<MealReq />} />
                    </Route>
                    <Route path="/mealReqs/users/accepted" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/mealReqs/users/accepted" element={<AcceptedMR />} />
                    </Route>
                    <Route path="/mealReqs/cooks/awaiting" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/mealReqs/cooks/awaiting" element={<AwaitingMRCook />} />
                    </Route>
                    <Route path="/mealReqs/cooks/accepted" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/mealReqs/cooks/accepted" element={<AcceptedMRCook />} />
                    </Route>
                    <Route path="/cook" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/cook" element={<Cook />} />
                    </Route>
                    <Route path="/student/account" element={<PrivateRoute requiredRole="user" />} >
                      <Route path="/student/account" element={<StudentProfile />} />
                    </Route>
                    <Route path="/cook/account" element={<PrivateRoute requiredRole="cook" />} >
                      <Route path="/cook/account" element={<CookProfile />} />
                    </Route>
                    <Route path="/cook/student/:id" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook/student/:id" element={<StudentDetails />} />
                  </Route>
                  <Route path="/student/cart" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/cart" element={<CartDetails />} />
                  </Route>
                  <Route path="/student/history" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/history" element={<History />} />
                  </Route>
                  <Route path="/student/checkout" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/checkout" element={<CheckoutDetails />} />
                  </Route>
                  <Route path="/student/addCard" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/addCard" element={<AddCard />} />
                  </Route>
                  <Route path="/student/cardDetails" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/cardDetails" element={<CardsList />} />
                  </Route>
                  <Route path="/student/orderConfirmation" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/orderConfirmation" element={<OrderConfirmation />} />
                  </Route>
                  <Route path="/student/orders" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/orders" element={<OrdersList />} />
                  </Route>
                  <Route path="/student/orders/:id" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/orders/:id" element={<OrderDetail />} />
                  </Route>
                  <Route path="/cook/orders" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook/orders" element={<OrdersList />} />
                  </Route>
                  <Route path="/cook/orders/:id" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook/orders/:id" element={<OrderDetail />} />
                  </Route>
                  <Route path="/student/cooksForYou" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/cooksForYou" element={<CooksForYou />} />
                  </Route>
                  <Route path="/cook/dishes" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook/dishes" element={<DishesList />} />
                  </Route>
                  <Route path="/cook/dishes/:id" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook/dishes/:id" element={<DishDetail />} />
                  </Route>
                  <Route path="/mealReqs/users/pending" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/mealReqs/users/pending" element={<PendingMR />} />
                  </Route>
                  <Route path="/mealReqs/cooks/pending" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/mealReqs/cooks/pending" element={<PendingMRCook />} />
                  </Route>
                  <Route path="/mealReqs/add" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/mealReqs/add" element={<AddMealReq />} />
                  </Route>
                  <Route path="/mealReqs/pending/:mealReqId/responses" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/mealReqs/pending/:mealReqId/responses" element={<MealReq />} />
                  </Route>
                  <Route path="/mealReqs/users/accepted" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/mealReqs/users/accepted" element={<AcceptedMR />} />
                  </Route>
                  <Route path="/mealReqs/cooks/awaiting" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/mealReqs/cooks/awaiting" element={<AwaitingMRCook />} />
                  </Route>
                  <Route path="/mealReqs/cooks/accepted" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/mealReqs/cooks/accepted" element={<AcceptedMRCook />} />
                  </Route>
                  <Route path="/cook" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook" element={<Cook />} />
                  </Route>
                  <Route path="/student/account" element={<PrivateRoute requiredRole="user" />} >
                    <Route path="/student/account" element={<StudentProfile />} />
                  </Route>
                  <Route path="/cook/account" element={<PrivateRoute requiredRole="cook" />} >
                    <Route path="/cook/account" element={<CookProfile />} />
                  </Route>
                  <Route path="/cook/student/:id" element={<PrivateRoute requiredRole="cook" />} >
                  <Route path="/cook/student/:id" element={<StudentDetails />} />
                </Route>
                <Route path='/*' element={<PageNotFound />} />
                </Routes>
                </div>
              </div>
              <FloatingChatWidget />
            </SocketProvider>
          </CartProvider>
        </AuthProviderWithRouter>
      </Router>
    </ApiProvider>
  );
}

export default App;