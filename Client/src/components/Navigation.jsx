import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AccountContext';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Badge, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import {doSignOut} from '../firebase/FirebaseFunctions';
import { CartContext } from '../contexts/CartContext';

const Navigation = () => {
    const { currentUser } = useContext(AuthContext);
    const { cartItems, cook } = useContext(CartContext);
    const location = useLocation();

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{width: '-webkit-fill-available'}}>
                    <Box sx={{ flexGrow: 1 }}>
                    {currentUser ? (
                        currentUser.role === 'user' ? (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <section style={{ display: "flex", alignItems: "center" }}>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/student" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <HomeIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>Home</Typography>
                                            </Link>
                                        </Button>
                                    </section>
                                    <section style={{ display: "flex", alignItems: "center", width: "fit-content" }}>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/student/cooksForYou" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <DinnerDiningIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>Cooks Around You</Typography>
                                            </Link>
                                        </Button>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/student/cart" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <Badge badgeContent={cartItems.length} color="secondary">
                                                    <ShoppingCartIcon />
                                                </Badge>
                                                <Typography variant="body2" sx={{ ml: 1 }}>Cart</Typography>
                                            </Link>
                                        </Button>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/mealReqs/users/pending" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <ListAltIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>Meal Requests</Typography>
                                            </Link>
                                        </Button>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/student/orders" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <ReceiptIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>Orders</Typography>
                                            </Link>
                                        </Button>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/student/history" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <HistoryIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>Recently Ordered</Typography>
                                            </Link>
                                        </Button>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/student/account" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
                                                <AccountCircleIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>My Account</Typography>
                                            </Link>
                                        </Button>
                                        <Button color="inherit" style={{ width: "auto" }} onClick={doSignOut}>
                                            <LogoutIcon />
                                            <Typography variant="body2" sx={{ ml: 1 }}>Sign Out</Typography>
                                        </Button>
                                    </section>
                            </div>
                        ) : (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <section style={{ display: "flex", alignItems: "center" }}>
                                    <Button color="inherit">
                                        <Link to="/cook" style={{ color: "white", textDecoration: "none" }}>
                                            Home
                                        </Link>
                                    </Button>
                                </section>
                                <section style={{ display: "flex", alignItems: "center" }}>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/cook/dishes" style={{ color: "white", textDecoration: "none" }}>
                                            My Dishes
                                        </Link>
                                    </Button>
                                        <Button color="inherit" style={{ width: "auto" }}>
                                            <Link to="/cook/orders" style={{ color: "white", textDecoration: "none" }}>
                                            Orders
                                        </Link>
                                    </Button>
                                    <Button color="inherit" style={{width: "auto"}}>
                                        <Link to="/mealReqs/cooks/pending" style={{ color: "white", textDecoration: "none" }}>
                                            Meal Requests
                                        </Link>
                                    </Button>
                                    <Button color="inherit" style={{width: "auto"}}>
                                        <Link to="/cook/account" style={{ color: "white", textDecoration: "none" }}>
                                            My Account
                                        </Link>
                                    </Button>
                                    <Button color="inherit" style={{width: "auto"}} onClick={doSignOut}>
                                        Sign Out
                                    </Button>
                                </section>
                            </div>
                        )
                    ) : (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            {location.pathname!=='/additional/info' && (
                                <>
                                    <Button color="inherit" component={Link} to="/">
                                        Sign In
                                    </Button>
                                    <Button color="inherit" component={Link} to="/signup">
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                    </Box>
                </Toolbar>
            </AppBar>
            {cook && cook.cookName && (
                <Box sx={{ backgroundColor: 'success.main', color: 'white', textAlign: 'center', py: 1 }}>
                    <Typography variant="h6">
                        Currently shopping from {cook.cookName}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default Navigation;