import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AccountContext';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import {doSignOut} from '../firebase/FirebaseFunctions';
import { CartContext } from '../contexts/CartContext';

const Navigation = () => {
    const { currentUser } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const location = useLocation();

    return (
        <AppBar position="static">
            <Toolbar sx={{width: '-webkit-fill-available'}}>
                <Box sx={{ flexGrow: 1 }}>
                {currentUser ? (
                    currentUser.role === 'user' ? (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <section style={{ display: "flex", alignItems: "center" }}>
                                <Button color="inherit">
                                    <Link to="/student" style={{ color: "white", textDecoration: "none" }}>
                                        Home
                                    </Link>
                                </Button>
                            </section>
                            {/* <section style={{ display: "flex", alignItems: "center" }}>
                                {location.pathname === '/student' && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mx: 'auto' }}>
                                        <InputBase
                                            placeholder="Search…"
                                            inputProps={{ 'aria-label': 'search' }}
                                            sx={{ color: 'inherit', ml: 1 }}
                                        />
                                        <IconButton type="submit" sx={{ p: 1, width: "auto" }} aria-label="search">
                                        <SearchIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </section> */}
                            <section style={{ display: "flex", alignItems: "center", width: "fit-content" }}>
                                <Button color="inherit" style={{width: "auto"}}>
                                    <Link to="/student/cooksForYou" style={{ color: "white", textDecoration: "none" }}>
                                        Cooks Around You
                                    </Link>
                                </Button>
                                <Button color="inherit" style={{width: "auto"}}>
                                    <Link to="/student/cart" style={{ color: "white", textDecoration: "none" }}>
                                        Cart
                                    <Badge badgeContent={cartItems.length} color="secondary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                    </Link>
                                </Button>
                                <Button color="inherit" style={{width: "auto"}}>
                                    <Link to="/mealReqs/users/pending" style={{ color: "white", textDecoration: "none" }}>
                                        Meal Requests
                                    </Link>
                                </Button>
                                <Button color="inherit" style={{width: "auto"}}>
                                    <Link to="/student/orders" style={{ color: "white", textDecoration: "none" }}>
                                        Orders
                                    </Link>
                                </Button>
                                <Button color="inherit" style={{width: "auto"}}>
                                    <Link to="/student/account" style={{ color: "white", textDecoration: "none" }}>
                                        My Account
                                    </Link>
                                </Button>
                                <Button color="inherit" style={{width: "auto"}}>
                                    <Link to="/student/history" style={{ color: "white", textDecoration: "none" }}>
                                        Recently Ordered
                                    </Link>
                                </Button>
                                <Button color="inherit" style={{width: "auto"}} onClick={doSignOut}>
                                    Sign Out
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
    );
};

export default Navigation;