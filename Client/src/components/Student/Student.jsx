import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Card, CardContent, CardMedia } from '@mui/material';
import backgroundImage from './../../assets/Background_1.png';
import { Link } from 'react-router-dom';
import { TextField, Container, Grid2, Select } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import styles from './MealReq.module.css'

const student = () => {
  const { apiCall, loading, error } = useApi();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dishes, setDishes] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [loading1, setLoading] = useState(true);

  //LIST OF CUISINES
  const cuisinesList = [
    'AMERICAN',
    'MEXICAN',
    'ITALIAN',
    'FRENCH',
    'GREEK',
    'DUTCH',
    'POLISH',
    'HUNGARIAN',
    'INDIAN',
    'CHINESE',
    'JAPANESE',
    'KOREAN',
    'VIETNAMESE',
    'THAI',
    'MONGOLIAN',
    'OTHER',
    'ALL'
  ]

  //FIELDS TO SEARCH
  const [searchName, setName] = useState('')

  const clearFields = async () => {
    document.getElementById('nameValue').value = ''
    document.getElementById('cuisineValue').value = ''
    document.getElementById('locationValue').value = ''
    document.getElementById('minPriceValue').value = ''
    document.getElementById('maxPriceValue').value = ''
    setName('')
  }

  // useEffect(()=> {
  async function getData() {
    let dishName = document.getElementById('nameValue').value
    let cuisineName = document.getElementById('cuisineValue').value
    let locationName = document.getElementById('locationValue').value
    let minPrice = document.getElementById('minPriceValue').value
    let maxPrice = document.getElementById('maxPriceValue').value

    const validNumberRegex = /^\d+(\.\d{1,2})?$/;
    if (minPrice && !validNumberRegex.test(minPrice.trim())) {
      alert(`Error: Min Price should only consist of number and should be upto 2 decimal places`)
      setDishes(null)
      return
    }
    if (maxPrice && !validNumberRegex.test(maxPrice.trim())) {
      alert(`Error: Max Price should only consist of number and should be upto 2 decimal places`)
      setDishes(null)
      return
    }

    if (minPrice && maxPrice) {
      if (parseFloat(minPrice) > parseFloat(maxPrice)) {
        alert("Min price cannot be greater than Max price")
        setDishes(null)
        return
      }
    }
    let params = '';
    if (dishName) params = params + `?dish=${dishName}`
    if (params !== '' && cuisineName) params = params + `&cuisine=${cuisineName}`
    else if (params === '' && cuisineName) params = params + `?cuisine=${cuisineName}`
    if (params !== '' && locationName) params = params + `&location=${locationName}`
    else if (params === '' && locationName) params = params + `?location=${locationName}`
    if (params !== '' && minPrice) params = params + `&min=${minPrice}`
    else if (params === '' && minPrice) params = params + `?min=${minPrice}`
    if (params !== '' && maxPrice) params = params + `&max=${maxPrice}`
    else if (params === '' && maxPrice) params = params + `?max=${maxPrice}`

    try {
      console.log(`http://localhost:3000/searchQuery${params}`)
      let resp = await axios.get(`http://localhost:3000/searchQuery${params}`);
      setDishes(resp.data.dishes);
      setLoading(false);
      console.log(resp.data.dishes)
    } catch (e) {
      alert(e)
    }
  }

  // })

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
    async function fetchData() {
      try {
        const { data: { dishes } } = await axios.get(`http://localhost:3000/dishes/`);
        setDishes(dishes);
        setLoading(false);
      } catch (e) {
        console.log(e);
        navigate('/404page');
      }
    }
    fetchData();
  }, [currentUser]);

  return (
    <>
      <Container maxWidth="md" style={{ marginTop: "-5px", marginBottom: "4%" }}>
        <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search For The Food That You Like...!
          </Typography>
          <Box mb={4} style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'space-around',
            justifyContent: 'space-between'
          }}>
            <TextField
              id="nameValue"
              margin="normal"
              defaultValue={null}
              placeholder='Food name...'
              width={{width: 'auto'}}
            />
            <Select
              id="cuisineValue"
              margin="normal"
              value={searchName || ''}
              className='form-control'
              onChange={(e) => {
                setName(e.target.value)
              }}
              style={{
                width: '20%',
                height: '90%',
                top: '1rem',
              }}
            >
              <option value={''} disabled>Select Cuisine</option>
              {cuisinesList &&
                cuisinesList.map((cuisine) => {
                  return (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  );
                })}
            </Select>
            <TextField
              id="locationValue"
              margin="normal"
              defaultValue={null}
              placeholder='Location...'
              style={{width: 'auto'}}
            />
            <br />
            <TextField
              id="minPriceValue"
              margin="normal"
              defaultValue={null}
              placeholder='Min price...'
              type="number" step="0.01"
              style={{width: "20%"}}
            />
            <TextField
              id="maxPriceValue"
              margin="normal"
              defaultValue={null}
              placeholder='Max price...'
              type="number" step="0.01"
              style={{width: "20%"}}
            />
          </Box>
          <Box mb={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={clearFields}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={getData}
              sx={{ mt: 2 }}
            >
              Search
            </Button>
          </Box>
      </Box>
      </Container>
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
                <Link to={``}>
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
          <button className={styles.buttonPrimary}>Add to Cart</button>
          
          <button className={styles.buttonSecondary}>Checkout</button>
             </div>
            </div>
          </div>
        ))
      ) 
      } {
        dishes && dishes.length == 0 && <div>
          Sorry, we can't find the dishes you are looking for!
        </div>
      }
    </>
  )

}

export default student;