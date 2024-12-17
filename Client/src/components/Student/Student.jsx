import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import { Typography, Button, Box, Card, CardContent, TextField, Container, Grid2, Avatar, Select, Popper, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearIcon from '@mui/icons-material/Clear';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { CartContext } from "../../contexts/CartContext";

  //LIST OF CUISINES
  const cuisinesList = [
    { name: 'AMERICAN', icon: '🍔' },
    { name: 'MEXICAN', icon: '🌮' },
    { name: 'ITALIAN', icon: '🍝' },
    { name: 'FRENCH', icon: '🥖' },
    { name: 'GREEK', icon: '🥙' },
    { name: 'DUTCH', icon: '🥞' },
    { name: 'POLISH', icon: '🥟' },
    { name: 'HUNGARIAN', icon: '🍲' },
    { name: 'INDIAN', icon: '🍛' },
    { name: 'CHINESE', icon: '🥡' },
    { name: 'JAPANESE', icon: '🍣' },
    { name: 'KOREAN', icon: '🍜' },
    { name: 'VIETNAMESE', icon: '🍜' },
    { name: 'THAI', icon: '🍲' },
    { name: 'MONGOLIAN', icon: '🍲' },
    { name: 'OTHER', icon: '🍽️' },
    { name: 'ALL', icon: '🍽️' }
  ]
import styles from './MealReq.module.css'

const student = () => {
  const { apiCall, loading, error } = useApi();
  const { currentUser } = useContext(AuthContext);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [dishes, setDishes] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [loading1, setLoading] = useState(true);
  const [searchName, setName] = useState('')
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [priceAnchorEl, setPriceAnchorEl] = useState(null);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState(undefined);
  const [maxPrice, setMaxPrice] = useState(undefined);
  const [AddedtoCart, setAddedtoCart] = useState({});
  const [Errors,setErrors]= useState({});
  const [wasItSearchQuery, setAnswer] = useState(false)

  const handleAdd = async (dishId) => {
    try {
      // const  { data: { status } } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/cart/add/${dishId}/to/${currentUser._id}`);
      // console.log(status);
      await addToCart(dishId);
    } catch (err) {
      console.log(err)
      setErrors((prevState) => ({
        ...prevState,
        [dishId]: true,
      }));    
    }
  };

  const clearFields = async () => {
    document.getElementById('nameValue').value = ''
    // document.getElementById('locationValue').value = ''
    // document.getElementById('minPriceValue').value = ''
    // document.getElementById('maxPriceValue').value = ''
    setDishes(null)
    setLocation('')
    setMinPrice(null)
    setMaxPrice(null)
    setLocationAnchorEl(null)
    setPriceAnchorEl(null)
    setName('')
  }

  // useEffect(()=> {
  async function getData() {
    let dishName = document.getElementById('nameValue').value
    let cuisineName = searchName
    // let locationName = document.getElementById('locationValue').value
    // let minPrice = document.getElementById('minPriceValue').value
    // let maxPrice = document.getElementById('maxPriceValue').value
    let locationName = location

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
    if (params !== '' && !locationName) params = params + `&latitude=${currentUser.location.coordinates.latitude}&longitude=${currentUser.location.coordinates.longitude}`
    else if (params === '' && !locationName) params = params + `?latitude=${currentUser.location.coordinates.latitude}&longitude=${currentUser.location.coordinates.longitude}`

    try {
      let resp = await axios.get(`${import.meta.env.VITE_SERVER_URL}/search${params}`);
      setDishes(resp.data.dishes);
      setLoading(false);
      setAnswer(true)
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
        const { data: { dishes } } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/search/home?latitude=${currentUser.location.coordinates.latitude}&longitude=${currentUser.location.coordinates.longitude}&userId=${currentUser._id}`);
        setDishes(dishes);
        setLoading(false);
        setAnswer(false)
      } catch (e) {
        console.log(e);
        alert(e)
        // navigate('/404page');
      }
    }
    fetchData();
  }, [currentUser]);

  const handleLocationClick = (event) => {
    setLocationAnchorEl(locationAnchorEl ? null : event.currentTarget);
    setPriceAnchorEl(null);
  };

  const handlePriceClick = (event) => {
    setPriceAnchorEl(priceAnchorEl ? null : event.currentTarget);
    setLocationAnchorEl(null);
  };
  
  const locationOpen = Boolean(locationAnchorEl);
  const priceOpen = Boolean(priceAnchorEl);

  return (
    <>
      <Container maxWidth="md" style={{ marginTop: "-5px", marginBottom: "4%" }}>
        <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Box mb={4} style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'space-around',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <Box style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'space-around',
              justifyContent: 'space-between'
            }}>
              <TextField
                id="nameValue"
                margin="normal"
                defaultValue={null}
                placeholder='Search For The Food That You Like...!'
                style={{width: '79%', marginLeft: '1%'}}
              />
              {/* <Select
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
              </Select> */}
              {/* <TextField
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
              /> */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '20%', justifyContent: 'space-evenly' }}>
                <IconButton onClick={handleLocationClick} style={{ width: 'auto' }}>
                  <LocationOnIcon />
                </IconButton>
                <Popper open={locationOpen} anchorEl={locationAnchorEl} placement="bottom-start" style={{ width: '50vw' }}
                  modifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'viewport',
                      },
                    },
                ]}>
                  <Paper sx={{ p: 2 }}>
                    <TextField
                      id="locationValue"
                      margin="normal"
                      value={location}
                      placeholder='Location...'
                      style={{ width: '100%' }}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Paper>
                </Popper>
                <IconButton onClick={handlePriceClick} style={{ width: 'auto' }}>
                  <AttachMoneyIcon />
                </IconButton>
                <Popper open={priceOpen} anchorEl={priceAnchorEl} placement="bottom-start" style={{ width: '40vw' }}
                  modifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'viewport',
                      },
                    },
                ]}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TextField
                      id="minPriceValue"
                      margin="normal"
                      value={minPrice}
                      placeholder='Min price...'
                      type="number"
                      step="0.01"
                      style={{ width: "45%" }}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <TextField
                      id="maxPriceValue"
                      margin="normal"
                      value={maxPrice}
                      placeholder='Max price...'
                      type="number"
                      step="0.01"
                      style={{ width: "45%" }}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </Paper>
                </Popper>
                <IconButton onClick={getData} style={{ width: 'auto' }}>
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={clearFields} style={{ width: 'auto' }}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
            {/* <Grid2 container spacing={2} sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              {cuisinesList.map((cuisine) => (
                <Grid2 item xs={6} sm={4} md={3} key={cuisine.name}>
                  <Box onClick={() => setName(cuisine.name)} sx={{ textAlign: 'center', cursor: 'pointer', width: "auto" }}>
                    <Avatar sx={{ width: 56, height: 56, margin: '0 auto' }}>{cuisine.icon}</Avatar>
                    <Typography variant="body1">{cuisine.name}</Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2> */}
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  width: '0px',
                  background: 'transparent'
                },
              }}
            >
              {cuisinesList.map((cuisine) => (
                <Box
                  key={cuisine.name}
                  onClick={() => setName((prev)=> prev === cuisine.name ? '' : cuisine.name)}
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    width: 'auto',
                    flex: '0 0 auto',
                    padding: '0 10px',
                  }}
                >
                  {cuisine.name === searchName ? (
                    <CheckCircleIcon sx={{ width: 56, height: 46, margin: '0 auto', color: 'green' }} />
                  ) : (
                    <Avatar sx={{ width: 56, height: 56, margin: '0 auto' }}>{cuisine.icon}</Avatar>
                  )}
                  <Typography variant="body1">{cuisine.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          {/* <Box mb={4}>
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
          </Box> */}
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
          <button className={styles.buttonPrimary} onClick={()=>handleAdd(mealReq._id)}>Add to Cart</button>
          
          <button className={styles.buttonSecondary}>Checkout</button>
             </div>
             {cartItems[mealReq._id] && (
                <p style={{ color: 'green' }}>Successfully Added to your cart</p>
              )}
              {Errors[mealReq._id] && (
                <p style={{ color: 'red' }}>You can't add dishes from different cooks</p>
              )}
            </div>
          </div>
        ))
      ) 
      } {
        wasItSearchQuery && dishes && dishes.length == 0 && <div>
          Sorry, we can't find the dishes you are looking for!
        </div>
      } {
        !wasItSearchQuery && (!dishes || dishes.length == 0) && <></>
      }
    </>
  )

}

export default student;