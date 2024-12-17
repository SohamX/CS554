import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AccountContext.jsx';
//import { Typography, Button, Box, Card, CardContent, TextField, Container, Grid2, Avatar, Select, Popper, Paper, IconButton } from '@mui/material';
import styles from '../Student/MealReq.module.css'

function History() {
  const { currentUser } = useContext(AuthContext);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
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
              
              
              <div className={styles.buttonContainer}>
          <button className={styles.buttonPrimary} >Add to Cart</button>
          
          <button className={styles.buttonSecondary}>Checkout</button>
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