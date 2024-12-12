import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Card, CardContent, CardMedia } from '@mui/material';
import backgroundImage from './../../assets/Background_1.png';
import { Link } from 'react-router-dom';
import { TextField, Container, Grid2 } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";

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
  }, [currentUser]);

  return (
    <>
      <div style={{ width: '100%', alignContent: 'center' }}>
        <div>
          <label>
            Search For The Food That You Like...!
          </label>
          <br />
          <input
            id="nameValue"
            defaultValue={null}
            placeholder='Food name...'
          />
          <select
            id="cuisineValue"
            value={searchName || ''}
            className='form-control'
            onChange={(e) => {
              setName(e.target.value)
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
          </select>
          <input
            id="locationValue"
            defaultValue={null}
            placeholder='Location...'
          />
          <br />
          <input
            id="minPriceValue"
            defaultValue={null}
            placeholder='Min price...'
            type="number" step="0.01"
          />
          <input
            id="maxPriceValue"
            defaultValue={null}
            placeholder='Max price...'
            type="number" step="0.01"
          />
          <button className='button' onClick={clearFields} style={{width: '15%', height:'2%'}}>
            Clear
          </button>
        </div>
        <div style={{ width: '100%' }}>
          <br/>
          <button className='button' onClick={getData} style={{width: '20%'}}>
            Search
          </button>
        </div>
      </div>
      {dishes && dishes.length > 0 && (<div style={{ width: '100%', alignContent: 'center' }}>
        <Grid2 container spacing={2}>
          {dishes.map((dish) => (
            <Link to={`/student/dishes/${dish._id}`}>
              <Grid2 dish key={dish._id}>
                <Card>
                  {/* <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.title}
                /> */}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dish.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CUISINE: {dish.cuisineType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      COST: {dish.cost} $
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Link>
          ))}
        </Grid2>
        <br />
      </div>
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