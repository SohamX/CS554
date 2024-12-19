import React from 'react'
//import '../MealReqs.css'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AccountContext';
import { useContext } from 'react';
import helpers from './helpers'
//import helpers from '../../../helpers'
//import helpers from '../../../../../Server/helpers/pranHelpers'
import axios from 'axios';
import styles from '../MealReq.module.css'

function AddMealReq(props) {
  const { currentUser } = useContext(AuthContext);
  const [errors,setErrors] = useState([]);


  
  const navigate = useNavigate();

  const onSubmitMealReq = async(e) => {
    e.preventDefault();
    let newErrors = [];
    let noOfPeople = document.getElementById('peopleCount').value;

    let description = document.getElementById('description').value;
    let cuisineType = document.getElementById('cuisineType').value;
    let budget = document.getElementById('budget').value;
    let requiredBy = document.getElementById('authorDob').value;

    try {
        noOfPeople = parseInt(noOfPeople, 10);
        if (isNaN(noOfPeople) || noOfPeople <= 4 || noOfPeople > 30 || !Number.isInteger(noOfPeople)) {
        throw 'noOfPeople should be positive number and  minimum 5 and maximum 30';
        }
    } catch (e) {
      console.log(e);
      newErrors.push(e);
    }

    try {
        description = helpers.checkString(description, 'description');
        description = helpers.checkSpecialCharsAndNum(description, 'description');
    } catch (e) {
      newErrors.push(e);
    }

    
      try {
        cuisineType = helpers.checkString(cuisineType, 'cuisineType');
        cuisineType = helpers.checkSpecialCharsAndNum(cuisineType, 'cuisineType');
      } catch (e) {
        newErrors.push(e);
      }

      try {
        budget = parseInt(budget, 10);
        if (isNaN(budget) || budget <= 0 || !Number.isInteger(budget)) {    
          throw 'Budget should be a positive number';
        } 
        else if (budget > 1000) {
          throw 'Budget cannot be greater than 1000';
        }
      } catch (e) {
        newErrors.push(e);
      }
      

    
    const [year, month, day] = requiredBy.split('-');
    requiredBy = `${month}/${day}/${year}`;
    if(!helpers.isValidFutureDate(requiredBy)){
      newErrors.push('Required By should be a valid future date in MM/DD/YYYY format and should not exceed 10 days from today');
    }
    setErrors(newErrors);
    if(newErrors.length>0){
        
        return;
    }
    try {
        // Send data to the backend
        const response = await axios.post('http://localhost:3000/mealReqs',{userId : currentUser._id,
            noOfPeople ,
            description ,
            cuisineType,
            budget ,
            requiredBy},{
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": "application/json",
              
            },
          });
        console.log('Response from backend:', response.data);
  
        // Reset form and notify user
        document.getElementById('add-author').reset();
        alert('Meal Request Added Successfully!');
        navigate(`/mealReqs/users/pending`);
      } catch (error) {
        console.error('Error while sending meal request:', error);
        setErrors([...newErrors, 'Failed to add meal request. Please try again later.']);
      }
    
    
    
  };
  return (
    <div className={styles.card}>
      <form className={styles.form} id='add-author' onSubmit={onSubmitMealReq}>
        <h2 className={styles.scriptFont}>Add a Meal Request</h2>
        <div className={styles.formGroup}>
          <label>
            People Count:
            <br />
            <input className={styles.input} id='peopleCount' required autoFocus={true} />
          </label>
        </div>
        <br />
        <div className={styles.formGroup}>
          <label>
            Description:
            <br />
            <input className={styles.input} id='description' required autoFocus={true} />
          </label>
        </div>
        <br />
        <div className={styles.formGroup}>
      <label style={{ width: '100%' }}>
        Cuisine Type:
        <br />
        <select className={styles.input} id='cuisineType' required>
          <option value='' disabled selected>
            Select Cuisine
          </option>
          <option value='AMERICAN'>AMERICAN</option>
          <option value='MEXICAN'>MEXICAN</option>
          <option value='ITALIAN'>ITALIAN</option>
          <option value='INDIAN'>INDIAN</option>
          <option value='THAI'>THAI</option>
          <option value='CHINESE'>CHINESE</option>
          <option value='FRENCH'>FRENCH</option>
          <option value='POLISH'>POLISH</option>
          <option value='HUNGARIAN'>HUNGARIAN</option>
          <option value='JAPANESE'>JAPANESE</option>
          <option value='KOREAN'>KOREAN</option>
          <option value='MONGOLIAN'>MONGOLIAN</option>
          <option value='DUTCH'>DUTCH</option>
          <option value='GREEK'>GREEK</option>
          <option value='VIETNAMESE'>VIETNAMESE</option>
          <option value='OTHER'>OTHER</option>
        </select>
      </label>
    </div>
        <br />
        <div className={styles.formGroup}>
          <label>
            Budget:
            <br />
            <input className={styles.input} id='budget' required autoFocus={true} />
          </label>
        </div>
        <br />
        <div className={styles.formGroup}>
          <label>
            Required By:
            <br />
            <input
              className={styles.input}
              id="authorDob"
              required
              type="date"
              min={new Date().toISOString().split('T')[0]}
            />
          </label>
        </div>
        <br />
        <br />
        <div className={styles.container}>
          <button className={styles.button} type='submit'>
            Add Meal Request
          </button>
          <button
            type='button'
            className={`${styles.button} ${styles.buttonDelete}`}
            onClick={() => {
              document.getElementById('add-author').reset();
              navigate(`/mealReqs/users/pending`);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      {errors.length > 0 && (
        <ul className={styles.listStyling}>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddMealReq