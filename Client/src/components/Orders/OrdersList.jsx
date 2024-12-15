import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormControlLabel, Switch } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';


function OrdersList() {
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);
    const [userId, setUserId] = useState(currentUser._id || '');
    const [role, setRole] = useState(currentUser.role || '');

    useEffect(() => {
        setUserId(currentUser._id);
        setRole(currentUser.role);
    }, [currentUser]);

    const [orders, setOrders] = useState(null);
    const isById = false;
    const attr = 'order';
    const getOrdersList = async () => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/orders/${role}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.error) {
                throw response;
            }

            console.log("Orders successfully fetched:", response.orders);
            setOrders(response.orders);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getOrdersList();
    }, [userId, role]);


    if (orders) {

        return (
            <div>
                <h2>Orders</h2>
                <Box
                    sx={{
                        mx: 'auto',
                        width: '100%',
                        mt: 3,
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <TableContainer component={Card}
                        sx={{
                            boxShadow: 3,
                            p: 2,
                            borderRadius: 2,
                            width: '80%',
                        }}
                    >
                        <Table sx={{ minWidth: '80%' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Order Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Order Status</TableCell>
                                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>
                                            {/* <Box display="flex" alignItems="center" gap={2}> */}
                                            <Link to={{
                                                pathname: `/${role === 'user' ? 'student' : 'cook'}/orders/${order._id}`,
                                                state: { refreshOrders: getOrdersList }
                                            }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                    variant='h6'
                                                    component='h3'
                                                >
                                                    {order.dishes.cookName} {order.isMealReq ? '(Meal Request)' : ''}
                                                </Typography>
                                            </Link>
                                            <Typography>${order.totalCost}</Typography>
                                            {/* </Box> */}
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                component='h3'
                                            >
                                                {order.status.toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        );
    }
}


export default OrdersList;
