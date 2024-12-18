import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AccountContext.jsx';
import { CartContext } from '../../contexts/CartContext.jsx';
//import { Typography, Button, Box, Card, CardContent, TextField, Container, Grid2, Avatar, Select, Popper, Paper, IconButton } from '@mui/material';
import styles from '../Student/MealReq.module.css'

function History() {
  const { currentUser } = useContext(AuthContext);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  const handleIncrement = (dishId) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 1) + 1, // Default to 1 if no value exists
    }));
  };

  const handleDecrement = (dishId) => {
    setQuantities((prev) => {
      const currentQuantity = prev[dishId] || 1;
      if (currentQuantity <= 1) return prev; // Prevent decrement below 1
      return {
        ...prev,
        [dishId]: currentQuantity - 1,
      };
    });
  };

  const handleAdd = async (dishId,quantity) => {
    try {
      // const  { data: { status } } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/cart/add/${dishId}/to/${currentUser._id}`);
      // console.log(status);
      await addToCart(dishId,quantity);
      alert(`${quantity} Servings added  to your cart`)
    } catch (err) {
      alert(err.error);
   //   alert("You cannot add items from different cooks to the cart at the same time");
      // setErrors((prevState) => ({
      //   ...prevState,
      //   [dishId]: true,
      // }));    
    }
  };
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
    async function fetchData() {
      try {
        const { data: { dishes } } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/dishes/history/${currentUser._id}`);
        setDishes(dishes);
        setLoading(false);
        
      } catch (e) {
        console.log(e);
        alert(e)
        // navigate('/404page');
      }
    }
    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  return (
    <>
    <h2>Your Recently Ordered Dishes</h2>
    <br />
    {dishes && dishes.length > 0 && (
        dishes.map((mealReq) => (
          <div className={styles.card} key={mealReq._id}>
            <div className={styles.cardBody}>
            <img style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                        }}
              src={mealReq.imageUrl} 
              alt={mealReq.name} 
              // className={styles.cardImage} // Add styles for the image
            />
              <h3 className={styles.cardTitle}>
                <Link to={`/student/dishes/${mealReq._id}`}>
                  {mealReq.name}
                </Link>
              </h3>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Cuisine Type:</span> {mealReq.cuisineType}
              </p>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Cost :</span> {'$'+ mealReq.cost}
              </p>
              <p className={styles.cardText}>
          <span className={styles.cardSubtitle}>Made By :</span> <Link to={`/student/cook/${mealReq.cookId}`}>{mealReq.cookName}</Link>
             </p>
              
              <div className={styles.buttonContainer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={styles.buttonSecondary}
              onClick={() => handleDecrement(mealReq._id)}
              style={{ padding: '4px 8px' }}
            >
              -
            </button>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {quantities[mealReq._id] || 1}
            </span>
            <button
              className={styles.buttonSecondary}
              onClick={() => handleIncrement(mealReq._id)}
              style={{ padding: '4px 8px' }}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button Below Quantity */}
          <button
            className={styles.buttonPrimary}
            onClick={() => handleAdd(mealReq._id, quantities[mealReq._id] || 1)}
            style={{ padding: '8px 16px', fontSize: '1rem' }}
          >
            Add to Cart
          </button>
        </div>
             {/* {cartItems[mealReq._id] && (
                <p style={{ color: 'green' }}>Successfully Added to your cart</p>
              )}
              {Errors[mealReq._id] && (
                <p style={{ color: 'red' }}>You can't add dishes from different cooks</p>
              )} */}
            </div>
          </div>
        ))
      ) 
    } {
        dishes && dishes.length == 0 && <div>
          🌮 "No recent orders? That’s like a taco without salsa!"
        </div>
      } 
    </>
  )
}

export default History