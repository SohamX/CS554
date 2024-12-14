import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AccountContext';
import styles from '../../Student/MealReqs/MealReq.module.css';

function PendingMR() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [showsData, setShowsData] = useState([]);
  
  const navigate = useNavigate();

  const [requestSent, setRequestSent] = useState({});
  

  // Function to handle button click and send Axios request
  const handleSend = async (mealReqId) => {
    try {
      const  { data: { status } } = await axios.post(`http://localhost:3000/mealReqs/${currentUser._id}/pending/${mealReqId}`);
      console.log(status);
      setRequestSent((prevState) => ({
        ...prevState,
        [mealReqId]: 'Request sent',
      }));
      
      
    } catch (err) {
      setError('Error fetching data!');
      
    }
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { pendingMealReqs } } = await axios.get(`http://localhost:3000/mealReqs/${currentUser._id}/pendingMr`);
        setShowsData(pendingMealReqs);
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
        <Link to={`/mealReqs/cooks/awaiting`}>
          <button className={styles.button} style={{ width: '549px' }}>
            Awaiting Meal Requests
          </button>
        </Link>
        <br />
        <Link to={`/mealReqs/cooks/accepted`}>
          <button className={styles.button} style={{ width: '549px' }}>
            My Accepted Meal Requests
          </button>
        </Link>
        <br />
      </div>
      <br />
      <h2>Pending Meal Requests</h2>
      {showsData && showsData.length > 0 ? (
        showsData.map((mealReq) => (
          <div className={styles.card} key={mealReq._id}>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>
               
                  {mealReq.description}
               
              </h3>
              <p className={styles.cardText}>
                <span className={styles.cardSubtitle}>Created By :</span> {mealReq.username}
              </p>
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
              
              <br />
              {requestSent[mealReq._id] ? (
                <p style={{ color: 'green' }}>{requestSent[mealReq._id]}</p>
              ) : (
                <button onClick={() => handleSend(mealReq._id)}>Send Request</button>
              )}
              <br />
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noMealRequests}>
          <h3>No Pending Meal Requests Found Check back later</h3>
          
        </div>
      )}
      <br />
      <br />
    </div>
  );
}

export default PendingMR;
