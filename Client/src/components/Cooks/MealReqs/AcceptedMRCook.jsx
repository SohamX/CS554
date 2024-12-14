import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AccountContext';
import styles from '../../Student/MealReqs/MealReq.module.css';

function AcceptedMRCook() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [showsData, setShowsData] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { acceptedMealReqs } } = await axios.get(`http://localhost:3000/mealReqs/${currentUser._id}/accceptedMr/`);
        console.log(acceptedMealReqs);
        setShowsData(acceptedMealReqs);
        setLoading(false);
      } catch (e) {
        console.log(e);
        navigate('/404page');
      }
    }
    fetchData();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        <Link to={`/mealReqs/cooks/pending`}>
          <button className={styles.button} style={{ width: '549px' }}>
            Pending Meal Requests
          </button>
        </Link>
        <br />
        <Link to={`/mealReqs/cooks/awaiting`}>
          <button className={styles.button} style={{ width: '549px' }}>
            Awaiting Meal Requests
          </button>
        </Link>
        <br />
      </div>
      <br />
      <h2>Accepted Meal Requests</h2>
      {showsData && showsData.length > 0 ? (
        showsData.map((mealReq) => (
          <div className={styles.card} key={mealReq._id}>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>
                
                  {mealReq.description}
               
              </h3>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Cuisine Type:</span> {mealReq.cuisineType}
              </p>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Created At:</span> {new Date(mealReq.createdAt).toLocaleDateString()}
              </p>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Required By:</span> {new Date(mealReq.requiredBy).toLocaleDateString()}
              </p>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Budget:</span> {'$' + mealReq.budget}
              </p>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>No of People:</span> {mealReq.noOfPeople}
              </p>
                <p className={styles.cardText}>
                    <span className={styles.cardSubtitle}>Created By:</span> {mealReq.username}
                </p>
                <p className={styles.cardText}>
                    <span className={styles.cardSubtitle} style={{ color: 'blue' }}>
                        Accepted
                    </span>
                </p>
              
              <br />
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noMealRequests}>
          <h3>Currently you dont have any accepted </h3>
          <p>Why don't you check and send one!</p>
        </div>
      )}
      <br />
      <br />
    </div>
  );
}

export default AcceptedMRCook;
