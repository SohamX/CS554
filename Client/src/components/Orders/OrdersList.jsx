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

    if (!orders) return <Typography>Loading...</Typography>;

    const inProgressOrders = orders.filter(order => order.status !== 'completed');
    const completedOrders = orders.filter(order => order.status === 'completed');


    //Note for Soham to implement chat feature
    // This component is used for both completed and inprogress orders
    //we can use order.status to conditionally implement functionality
    //for inprogress use : order.status !== 'completed'
    //Once you read this please remove these comments and commit along with your chat feature
    const renderOrdersTable = (ordersList, title) => (
        <Box
            sx={{
                mx: 'auto',
                width: '100%',
                mt: 3,
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Card
                sx={{
                    boxShadow: 3,
                    p: 2,
                    borderRadius: 2,
                    width: '80%',
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                {ordersList.length > 0 ? (
                    <Table sx={{ minWidth: '80%' }} aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Order Details</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Order Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordersList.map(order => (
                                <TableRow key={order._id}>
                                    <TableCell>
                                        <Link
                                            to={{
                                                pathname: `/${role === 'user' ? 'student' : 'cook'}/orders/${order._id}`,
                                                state: { refreshOrders: getOrdersList },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                    },
                                                }}
                                                variant="h6"
                                                component="h3"
                                            >
                                                {order.dishes.cookName}{' '}
                                                {order.isMealReq ? '(Meal Request)' : ''}
                                            </Typography>
                                        </Link>
                                        <Typography>${order.totalCost.toFixed(2)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography component="h3">{order.status.toUpperCase()}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No orders found in this category.</Typography>
                )}
            </Card>
        </Box>
    );

    return (
        <div>
            <h2>Orders</h2>
            {renderOrdersTable(inProgressOrders, 'In-progress Orders')}
            {renderOrdersTable(completedOrders, 'Completed Orders')}
        </div>
    );
}


export default OrdersList;
