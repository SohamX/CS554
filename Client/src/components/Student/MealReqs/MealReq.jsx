import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MealReq() {
  const [loading, setLoading] = useState(true);
  const [showsData, setShowsData] = useState(null);
  let { mealReqId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('on load useEffect');
    console.log(mealReqId);
    async function fetchData() {
      try {
        const { data: { responses } } = await axios.get(`http://localhost:3000/mealReqs/pending/${mealReqId}/responses`);
        setShowsData(responses);
        setLoading(false);
        
        console.log(responses);
      } catch (e) {
        console.log(e);
        navigate('/404page');
      }
    }
    fetchData();
  }, [mealReqId]);

  // Inline styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonDelete: {
      backgroundColor: '#f44336',
    },
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '15px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardBody: {
      padding: '10px',
    },
    cardTitle: {
      margin: '0 0 10px 0',
      color: '#333',
    },
    cardText: {
      color: '#666',
      marginBottom: '10px',
    },
    cardSubtitle: {
      fontWeight: 'bold',
      marginRight: '5px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      marginLeft: '100px',
    },
    buttonAccept: {
      backgroundColor: '#4CAF50', // Green color
      color: 'white',
      padding: '5px 10px', // Smaller size
      fontSize: '0.8em',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
       width: '120px'
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div style={styles.container}>
        <div style={styles.buttonGroup}>
          <Link to={`/mealReqs/add`}>
            <button style={styles.button}>
              Add Meal Request
            </button>
          </Link>
          {showsData && (
            <Link to={`/mealReqs/users/pending`}>
              <button style={styles.button}>
                Pending Meal Requests
              </button>
            </Link>
          )}
        </div>
        <h1 style={{ fontSize: "1em" }}>Responses from Cooks</h1>
        {showsData && <h2>{showsData.description}</h2>}
        
        
        <div>
          {showsData && showsData.length > 0 ? (
            showsData.map((mealReq) => (
              <div style={styles.card} key={mealReq.cookId}>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>
                    <Link to={``}>
                      {mealReq.cookName}
                    </Link> is interested 
                  </h3>
                  <p style={styles.cardText}>
                    <span style={styles.cardSubtitle}>Responded at</span> {new Date(mealReq.responseDate).toLocaleDateString()}
                  </p>
                  <br />
                  <button
                     style={styles.buttonAccept}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h3>No responses available at the moment.</h3>
          )}
        </div>
      </div>
    );
  }
}

export default MealReq;
