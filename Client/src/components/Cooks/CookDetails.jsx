import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,

    Box,
    Avatar,
    Chip,
    CardMedia,
    Button,
    Grid2
} from '@mui/material';
import { CartContext } from '../../contexts/CartContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
const CookDetails = () => {
    const { id } = useParams();
    const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext);
    const { cartItems, setCartItems, addToCart, removeFromCart, decFromCart } = useContext(CartContext);
    const [cook, setCookDetails] = useState(null)
    const [dishes, setDishes] = useState([])
    const [AddedtoCart, setCartMsg] = useState({})
    const [Errors, setErrors] = useState({});
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

    const getCookDetails = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cooks/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }
            setCookDetails(response.cook)
        } catch (error) {
            alert(error);
        }
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/cook/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }
            setDishes(response.dishes)
        } catch {
            alert(error);
        }
    }
    const handleAddToCart = async (dishId,quantity) => {
        try {
            await addToCart(dishId,quantity);
            alert(`${quantity} servings added  to your cart`)
            // const { data: { status } } = await axios.post(`http://localhost:3000/users/cart/add/${dish._id}/to/${currentUser._id}`);
            // alert(`${dish.name} added to cart successfully`)
        } catch (err) {
            console.log(err);
            alert(err.error);
            // alert(`Error while adding ${dish.name} to cart!`)
        }
    };
    useEffect(() => {
        getCookDetails();
    }, [id])

    if (cook) {
        return (
            <Card sx={{ maxWidth: 1000, margin: '20px auto', padding: '24px', boxShadow: 3 }}>
                <CardContent>
                    <Grid2 container spacing={2} alignItems="center">
                        <Grid2 item>
                            <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
                                {cook.firstName[0]}{cook.lastName[0]}
                            </Avatar>
                        </Grid2>
                        <Grid2 item>
                            <Typography variant="h4" gutterBottom>
                                {cook.firstName} {cook.lastName}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                @{cook.username}
                            </Typography>
                        </Grid2>
                    </Grid2>

                    <Typography variant="body1" sx={{ marginTop: '16px', textAlign: 'center' }}>
                        "{cook.bio}"
                    </Typography>

                    <Box sx={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Chip label={`Email: ${cook.gmail}`} />
                        <Chip label={`Mobile: ${cook.mobileNumber}`} />
                    </Box>

                    <Box sx={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                        <Box>
                            <LocationOnIcon color="primary" />
                            <Typography variant="body1" align="center">
                                {cook.location.address}, {cook.location.city}, {cook.location.state}, {cook.location.zipcode}, {cook.location.country}
                            </Typography>
                            {/* <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">
                            Coordinates: ({cook.location.coordinates.latitude}, {cook.location.coordinates.longitude})
                        </Typography>
                    </Box> */}

                            { cook.location.coordinates.latitude !== 0.0 && cook.location.coordinates.longitude !==0.0 &&
                                <iframe
                                    width="80%"
                                    height="200"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    src={`https://www.google.com/maps?q=${cook.location.coordinates.latitude},${cook.location.coordinates.longitude}&hl=es;z=14&output=embed`}
                                    allowFullScreen
                                ></iframe>}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box>
                                <Typography variant="body1">Ratings:</Typography>
                                {Array.from({ length: 5 }, (_, i) => {
                                    const ratingValue = cook.avgRating; // Example: 4.3

                                    // Determine star type
                                    if (i + 1 <= ratingValue) {
                                        // Full star
                                        return <StarIcon key={i} color="warning" />;
                                    } else if (i < ratingValue && i + 1 > ratingValue) {
                                        // Half star (ratingValue falls between i and i+1)
                                        return <StarHalfIcon key={i} color="warning" />;
                                    } else {
                                        // Empty star
                                        return <StarBorderIcon key={i} color="warning" />;
                                    }
                                })}
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                    Reviews
                                </Typography>
                                {cook.reviews.length === 0 ||
                                    cook.reviews.filter(review => typeof review.review === 'string' && review.review.trim() !== '').length === 0 ? (
                                    <Typography variant="body1">No reviews yet.</Typography>
                                ) : (
                                    <List sx={{ textAlign: 'center' }}>
                                        {cook.reviews
                                            .filter(review => typeof review.review === 'string' && review.review.trim() !== '')
                                            .map((review) => (
                                                <ListItem key={review.userId} sx={{ justifyContent: 'center' }}>
                                                    <ListItemText primary={review.review} />
                                                </ListItem>
                                            ))}
                                    </List>
                                )}
                            </Box>
                        </Box>
                    </Box>


                    <Typography variant="h6" sx={{ marginTop: '32px', textAlign: 'center' }}>
                        Dishes
                    </Typography>
                    {dishes.length === 0 ? (
                        <Typography variant="body1" textAlign="center">No dishes yet.</Typography>
                    ) : (
                        <Grid2 container spacing={2} sx={{ marginTop: '16px', justifyContent: "center" }} key="dish_array">
                            {dishes.map((dish) => (
                                <Grid2 item xs={12} sm={6} md={5} key={dish._id}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            image={dish.imageUrl}
                                            alt={dish.name}
                                            height="300"
                                            sx={{ objectFit: 'flex' }}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                <Link to={`/student/dishes/${dish._id}`}>
                                                    {dish.name}
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                {dish.description}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                Cuisine: {dish.cuisineType}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                Cost: ${dish.cost}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                Rating: {dish.rating === '-' ? 'No rating' : dish.rating}
                                            </Typography>
                                            <Box sx={{ justifyContent: "center" }}>
                                                {dish.isAvailable &&
                                                    <>
                                                        <Box >
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ marginTop: '8px', width: '50px' }}
                                                                onClick={() => handleIncrement(dish._id)}
                                                            >
                                                                {"+"}
                                                            </Button>
                                                            
                                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 10px' }}>
                                                                {quantities[dish._id] || 1}
                                                            </span>
                                                            
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ marginTop: '8px', width: '50px' }}
                                                                onClick={() => handleDecrement(dish._id)}
                                                            >
                                                                {'-'}
                                                            </Button>
                                                        </Box>
                                                        <Button
                                                            color="success"
                                                            variant="contained"
                                                            
                                                            sx={{ marginTop: '8px', width: '350px' }}
                                                            onClick={() => handleAddToCart(dish._id, quantities[dish._id] || 1)} >
                                                              {'Add to Cart'}  </Button>   
                                                    </>
                                                }
                                                {
                                                    !dish.isAvailable
                                                    && <Typography>
                                                        Currently Unavailable
                                                    </Typography>
                                                }
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    )}
                </CardContent>
            </Card>
        );
    }
}

export default CookDetails;