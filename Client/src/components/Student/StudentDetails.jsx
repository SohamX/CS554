import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid2,
    Avatar,
    Chip,
    CardMedia,
    Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
const StudentDetails = () => {
    const { id } = useParams();
    const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext);
    const [student, setStudent] = useState(null)

    const getStudentDetails = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }
            setStudent(response.user)
        } catch (error) {
            alert(error);
        }
    }
    useEffect(() => {
        getStudentDetails();
    }, [id])

    if (student) {
        return (
            <Card sx={{ maxWidth: 1000, margin: '20px auto', padding: '24px', boxShadow: 3 }}>
                <CardContent>
                    <Grid2 container spacing={2} alignItems="center">
                        <Grid2 item>
                            <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
                                {student.firstName[0]}{student.lastName[0]}
                            </Avatar>
                        </Grid2>
                        <Grid2 item>
                            <Typography variant="h4" gutterBottom>
                                {student.firstName} {student.lastName}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                @{student.username}
                            </Typography>
                        </Grid2>
                    </Grid2>

                    <Box sx={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Chip label={`Email: ${student.gmail}`} />
                        <Chip label={`Mobile: ${student.mobileNumber}`} />
                    </Box>

                    <Box sx={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                        <Box>
                            <LocationOnIcon color="primary" />
                            <Typography variant="body1" align="center">
                                {student.location.address}, {student.location.city}, {student.location.state}, {student.location.zipcode}, {student.location.country}
                            </Typography>
                            {student.location.coordinates.latitude !== 0.0 && student.location.coordinates.longitude !== 0.0 &&
                                <iframe
                                    width="80%"
                                    height="200"
                                    frameBorder="0"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    src={`https://www.google.com/maps?q=${student.location.coordinates.latitude},${student.location.coordinates.longitude}&hl=es;z=14&output=embed`}
                                    allowFullScreen
                                ></iframe>
                            }
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }
}

export default StudentDetails;