import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import { SocketContext } from "../../contexts/SocketContext";
import { Typography, Box, Card, CardContent, Grid2 } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
const Cook = () => {
    // const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext); // this has cook's data
    const navigate = useNavigate();
    const { inOrders } = useContext(SocketContext); // this has incomplete orders
    const [loading, setLoading] = useState(true);
    const [pendingOrders, setOrders] = useState([]);
    const [pendingRequests, setRequests] = useState([]);
    const [pendingMR, setMR] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
        // async function fetchData() {
        //     try {
        //         setLoading(true)
        //         const pendingMealReqs = await axios.get(`${import.meta.env.VITE_SERVER_URL}/mealReqs/${currentUser._id}/acceptedMr`);
        //         setRequests(pendingMealReqs.data.accpetedMealReqs);
        //         setLoading(false);
        //     } catch (e) {
        //         alert(e);
        //     }
        // }
        // fetchData()
        let order_s = []
        let requests_s = []
        if (inOrders) {
            for (let order of inOrders) {
                if (order.isMealReq) {
                    requests_s.push(order)
                } else {
                    order_s.push(order)
                }
            }
        }
        setOrders(order_s)
        setRequests(requests_s)
        // console.log("final 1", order_s);
        // console.log("final 2", requests_s);
        setLoading(false)
    }, [currentUser, navigate, inOrders]);

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
                        !loading && pendingOrders && pendingOrders.length > 0 &&
                        <>
                            <Grid2 width='90%' flex={1} p={2} marginTop={2}>
                                <Typography variant="h5" component="div">
                                    Upcoming orders
                                </Typography>
                            </Grid2>
                            {pendingOrders.map((order) => (
                                <Grid2 xs={6} key={order._id} width='90%' justifyContent="center" margin={2} flex={12} p={2}>
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
                                                order.dishes.dishes.map((dish, index) => (
                                                    <Typography key={index}>
                                                        {dish.dishName} : {dish.quantity}
                                                    </Typography>
                                                ))
                                            }
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            )
                            )}
                        </>
                    } {
                        !loading && (!pendingOrders || pendingOrders.length === 0) &&
                        <Grid2 width='90%' flex={1} p={2} marginTop={2}>
                            <Grid2 width='90%'>
                                <Typography variant="h5" component="div">
                                    Upcoming orders
                                </Typography>
                            </Grid2>
                            <CheckCircleIcon
                                color="success"
                                sx={{ fontSize: 50, mb: 1, marginTop: 10 }}
                            />
                            <Typography variant="h5" component="div">
                                You are all caught up with the orders!
                            </Typography>
                        </Grid2>
                    }
                </Box>
                <Box display="flex" flexDirection="column" sx={{
                    // boxShadow: 2,
                    overflowY: "auto",
                    height: "100%"
                }}>
                    {!loading && pendingRequests && pendingRequests.length > 0 &&
                        <>
                            <Grid2 width='90%' flex={1} p={2} marginTop={2}>
                                <Typography variant="h5" component="div">
                                    Meal Requests
                                </Typography>
                            </Grid2>
                            {pendingRequests.map((mealReq) => (
                                <Grid2 item xs={6} key={mealReq._id} width='90%' justifyContent="center" margin={2} flex={12} p={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                <Link to={`/cook/orders/${mealReq._id}`}>
                                                Placed By: <strong>@{mealReq.username}</strong>
                                                </Link>
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Placed On: <strong>{new Date(mealReq.createdAt).toLocaleString()}</strong>
                                            </Typography>
                                            {
                                                mealReq.dishes.dishes.map((dish, index) => (
                                                    <Typography key={index}>
                                                        {dish.dishName} : {dish.quantity}
                                                    </Typography>
                                                ))
                                            }
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))
                            }
                        </>
                    } {
                        !loading && (!pendingRequests || pendingRequests.length === 0) &&
                        <Grid2 width='90%' flex={1} p={2} marginTop={2}>
                            <Grid2 width='90%'>
                                <Typography variant="h5" component="div">
                                    Upcoming Meal Requests
                                </Typography>
                            </Grid2>
                            <CheckCircleIcon
                                color="success"
                                sx={{ fontSize: 50, mb: 1, marginTop: 10 }}
                            />
                            <Typography variant="h5" component="div">
                                You are all caught up with the meal requests!
                            </Typography>
                        </Grid2>
                    }
                </Box>
            </Box>
        </>
    );
};

export default Cook;
