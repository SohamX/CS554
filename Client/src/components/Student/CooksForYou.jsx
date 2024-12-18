import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, Button, Card, CardContent, Grid2, Avatar } from "@mui/material";
import { AuthContext } from "../../contexts/AccountContext";

const CooksForYou = () => {
    const { currentUser } = useContext(AuthContext);
    const [cooks, setCooks] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        async function fetchData() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/search/cooks?latitude=${currentUser.location.coordinates.latitude}&longitude=${currentUser.location.coordinates.longitude}`
                );
                setCooks(response.data.cooks);
                setLoading(false);
            } catch (error) {
                console.error(error);
                alert("An error occurred while fetching cooks data.");
            }
        }

        fetchData();
    }, [currentUser, navigate]);

    return (
        <>
            {loading && (
                <div>
                    <Typography variant="h6">Loading...</Typography>
                </div>
            )}

            {cooks && cooks.length > 0 && (
                <Grid2 container spacing={3}>
                    {cooks.slice(0, 2).map((cook) => (
                        <Grid2 item xs={6} key={cook._id} display="flex" justifyContent="center" marginBottom={1} marginTop={2}>
                            <Card sx={{ width: '70%', height: '100%' }}>
                                <CardContent>
                                    {/* <Grid2 item> */}
                                    <Avatar sx={{ width: 50, height: 50, fontSize: 20 }}>
                                        {cook.firstName[0]}{cook.lastName[0]}
                                    </Avatar>
                                    {/* </Grid2> */}
                                    <Typography variant="h5" component="div" marginRight={4}>
                                        <Link to={`/student/cook/${cook._id}`}>
                                            {cook.firstName} {cook.lastName}
                                        </Link>
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" marginRight={4}>
                                        @{cook.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        {cook.bio}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Location: {cook.location.city}, {cook.location.state}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Contact: {cook.gmail} | {cook.mobileNumber}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Average Rating: {cook.avgRating} ★
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}

                    {cooks.slice(2, 3).map((cook) => (
                        <Grid2 item xs={12} key={cook._id} display="flex" justifyContent="center" marginBottom={1}>
                            <Card sx={{ width: '50%', height: '100%' }}>
                                <CardContent>
                                    <Avatar sx={{ width: 50, height: 50, fontSize: 20 }}>
                                        {cook.firstName[0]}{cook.lastName[0]}
                                    </Avatar>
                                    <Typography variant="h5" component="div" marginRight={4}>
                                        <Link to={`/student/cook/${cook._id}`}>
                                            {cook.firstName} {cook.lastName}
                                        </Link>
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" marginRight={4}>
                                        @{cook.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        {cook.bio}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Location: {cook.location.city}, {cook.location.state}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Contact: {cook.gmail} | {cook.mobileNumber}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Average Rating: {cook.avgRating} ★
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}

                    {cooks.slice(3, 5).map((cook) => (
                        <Grid2 item xs={6} key={cook._id} display="flex" justifyContent="center" marginBottom={1}>
                            <Card sx={{ width: '70%', height: '100%' }}>
                                <CardContent>
                                    <Avatar sx={{ width: 50, height: 50, fontSize: 20 }}>
                                        {cook.firstName[0]}{cook.lastName[0]}
                                    </Avatar>
                                    <Typography variant="h5" component="div" marginRight={4}>
                                        <Link to={`/student/cook/${cook._id}`}>
                                            {cook.firstName} {cook.lastName}
                                        </Link>
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" marginRight={4}>
                                        @{cook.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        {cook.bio}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Location: {cook.location.city}, {cook.location.state}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Contact: {cook.gmail} | {cook.mobileNumber}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" marginRight={4}>
                                        Average Rating: {cook.avgRating} ★
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            )}

            {(!cooks || cooks.length === 0) && !loading && (
                <div>
                    <Typography variant="h6">
                        Uh Oh! We couldn't find any cooks near you...!
                    </Typography>
                </div>
            )}
        </>
    );
};

export default CooksForYou;
