import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import { SocketContext } from "../../contexts/SocketContext";
import { Typography, Box, Card, CardContent, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
const Cook = () => {
    // const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext); // this has cook's data
    const navigate = useNavigate();
    const { inOrders } = useContext(SocketContext); // this has incomplete orders
    const [loading, setLoading] = useState(true);

    const [pendingMR, setMR] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
        async function fetchData() {
            try {
                setLoading(true)
                const pendingMealReqs = await axios.get(`${import.meta.env.VITE_SERVER_URL}/mealReqs/${currentUser._id}/pendingMr`);
                setMR(pendingMealReqs.data.pendingMealReqs);
                setLoading(false);
            } catch (e) {
                alert(e);
            }
        }
        fetchData()
    }, [currentUser, navigate]);

    console.log(pendingMR);
    console.log(inOrders);

    return (
        <>
            {loading && <Typography align="center" variant="subtitle1">Loading...</Typography>}
            {/* {!loading && pendingMR?.length === 0 && inOrders?.length === 0 && (
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <CheckCircleIcon
                        color="success"
                        sx={{ fontSize: 50, mb: 1 }}
                    />
                    <Typography variant="h6" align="center">
                        You are all caught up!
                    </Typography>
                </Box>
            )} */}
            <Box display="flex" flexDirection="row" height="80vh" gap={2} p={2}>
                <Box display="flex" flexDirection="column" sx={{
                    // boxShadow: 2,
                    overflowY: "auto",
                    height: "100%"
                }}>
                    {
                        !loading && inOrders && inOrders.length > 0 &&
                        <>
                            <Grid width='90%' flex={1} p={2} marginTop={2}>
                                <Typography variant="h5" component="div">
                                    Upcoming orders
                                </Typography>
                            </Grid>
                            {inOrders.map((order) => (
                                <Grid item xs={6} key={order._id} width='90%' justifyContent="center" margin={2} flex={12} p={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                <Link to={`/cook/orders/${order._id}`}>
                                                    Placed By: <strong>@{order.username}</strong>
                                                </Link>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Placed On: <strong>{new Date(order.createdAt).toLocaleString()}</strong>
                                            </Typography>
                                            {
                                                order.dishes.dishes.map((dish) => (
                                                    <Typography>
                                                        {dish.dishName} : {dish.quantity}
                                                    </Typography>
                                                ))
                                            }
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                            )}
                        </>
                    } {
                        !loading && (!inOrders || inOrders.length === 0) &&
                        <Grid width='90%' flex={1} p={2} marginTop={2}>
                            <Grid width='90%'>
                                <Typography variant="h5" component="div">
                                    Upcoming orders
                                </Typography>
                            </Grid>
                            <CheckCircleIcon
                                color="success"
                                sx={{ fontSize: 50, mb: 1, marginTop: 10 }}
                            />
                            <Typography variant="h5" component="div">
                                You are all caught up with the orders!
                            </Typography>
                        </Grid>
                    }
                </Box>
                <Box display="flex" flexDirection="column" sx={{
                    // boxShadow: 2,
                    overflowY: "auto",
                    height: "100%"
                }}>
                    {!loading && pendingMR && pendingMR.length > 0 &&
                        <>
                            <Grid width='90%' flex={1} p={2} marginTop={2}>
                                <Typography variant="h5" component="div">
                                    Meal Requests
                                </Typography>
                            </Grid>
                            {pendingMR.map((mealReq) => (
                                <Grid item xs={6} key={mealReq._id} width='90%' justifyContent="center" margin={2} flex={12} p={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Placed By: <strong>@{mealReq.username}</strong>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Placed On: <strong>{new Date(mealReq.createdAt).toLocaleString()}</strong>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Cuisine: <strong>{mealReq.cuisineType}</strong>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Description: <strong>{mealReq.description}</strong>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Quantity / For No. of People: <strong>{mealReq.noOfPeople}</strong>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Required By: <strong>{new Date(mealReq.requiredBy).toLocaleString()}</strong>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                            }
                        </>
                    } {
                        !loading && (!pendingMR || pendingMR.length === 0) &&
                        <Grid width='90%' flex={1} p={2} marginTop={2}>
                            <Grid width='90%'>
                                <Typography variant="h5" component="div">
                                    Meal Requests
                                </Typography>
                            </Grid>
                            <CheckCircleIcon
                                color="success"
                                sx={{ fontSize: 50, mb: 1, marginTop: 10 }}
                            />
                            <Typography variant="h5" component="div">
                                No more meal requests to explore!
                            </Typography>
                        </Grid>
                    }
                </Box>
            </Box>
        </>
    );
};

export default Cook;
