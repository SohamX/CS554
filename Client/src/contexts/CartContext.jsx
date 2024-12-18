import React, {useState, useEffect, useContext} from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useApi } from './ApiContext';
import { AuthContext } from './AccountContext';

export const CartContext = React.createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const [cook, setCook] = useState({cookId: '', cookName: ''});
    const [total, setTotal] = useState(0);
    const [loadingCart, setLoadingCart] = useState(false);
    const { apiCall } = useApi();
    const { currentUser } = useContext(AuthContext);

    const addToCart = async (itemId,quantity) => {
        try{
            console.log(itemId);
            console.log(quantity);
            const response = await apiCall(`http://localhost:3000/users/cart/add/${itemId}/to/${currentUser._id}/by/${quantity}`, {
                method: 'POST'
            });
            console.log(response);
            if (response.status !== 'success') {
                throw response;
            }
            setCartItems(response.addedItem.dishes);
            setCook({cookId: response.addedItem.cookId, cookName: response.addedItem.cookName});
            setTotal(response.addedItem.totalCost);
        } catch (error) {
            console.error('Error:', error);
            // alert(error.error);
            throw error;
        };
        // if (cook.cookId === '') {
        //     let newdish = {
        //         dishId: item.dishId,
        //         dishName: item.name,
        //         quantity: 1,
        //         subTotal: item.subTotal
        //     }
        //     setCook({cookId: item.cookId, cookName: item.cookName});
        //     setCartItems((prevCart) => [...prevCart, newdish ]);
        //     setTotal(item.subTotal);
        // }
        // else if(cook.cookId === item.cookId){
        //     const flag = cartItems.findIndex(cartItem => cartItem.dishId === item.dishId);
        //     if(flag!=-1){
        //         let newitem = cartItems[flag];
        //         newitem.subTotal += item.subTotal/item.quantity;
        //         newitem.quantity += 1;
        //         setCartItems((prevCart) => prevCart.map((cartItem)=>{
        //             if(cartItem.dishId === item.dishId){
        //                 return newitem;
        //             }
        //             return cartItem;
        //         }))
        //     }
        //     else{
        //         let newdish = {
        //             dishId: item.dishId,
        //             dishName: item.name,
        //             quantity: 1,
        //             subTotal: item.subTotal
        //         }
        //         setCartItems((prevCart) => [...prevCart, newdish ]);
        //     }
        //     setTotal(prevTotal => prevTotal + item.subTotal);
        // }
        // else {
        //     throw new Error('You can only order from one cook at a time');
        // }
    };
    
    const decFromCart = async (itemId) => {
        // setCartItems((prevCart) => prevCart.filter(item => item.id !== itemId));
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/dec/${itemId}/to/${currentUser._id}`, {
                method: 'POST',
            });
            if(response.status !== 'success'){
                throw response;
            }
            setCartItems(response.decItem.dishes);
            setCook({cookId: response.decItem.cookId, cookName: response.decItem.cookName});
            setTotal(response.decItem.totalCost);
        } catch (error) {
            console.error('Error:', error);
            alert(error.error);
        }
        // const flag = cartItems.findIndex(cartItem => cartItem.dishId === item.dishId);
        // if(flag!=-1){
        //     let newitem = cartItems[flag];
        //     newitem.subTotal -= item.subTotal/item.quantity;
        //     newitem.quantity -= 1;
        //     if(newitem.quantity === 0){
        //         setCartItems((prevCart) => prevCart.filter(cartItem => cartItem.dishId !== item.dishId));
        //     }
        //     else{
        //         setCartItems((prevCart) => prevCart.map((cartItem)=>{
        //             if(cartItem.dishId === item.dishId){
        //                 return newitem;
        //             }
        //             return cartItem;
        //         }))
        //     }
        //     setTotal(prevTotal => prevTotal - item.subTotal);
        //     console.log(response.decItem);
        //     if(response.decItem?.dishes?.length === 0){
        //         console.log('empty cart');
        //         setCook({cookId: '', cookName: ''});
        //     }
        // }
        // else{
        //     throw new Error('Item not found in cart');
        // }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/rem/${itemId}/to/${currentUser._id}`, {
                method: 'POST',
            });
            if(response.status !== 'success'){
                throw response;
            }
            setCartItems(response.remItem.dishes);
            setCook({cookId: response.remItem.cookId, cookName: response.remItem.cookName});
            setTotal(response.remItem.totalCost);
        } catch (error) {
            console.error('Error:', error);
            alert(error.error);
        }
        // const flag = cartItems.findIndex(cartItem => cartItem.dishId === item.dishId);
        // if(flag!=-1){
        //     setCartItems((prevCart) => prevCart.filter(cartItem => cartItem.dishId !== item.dishId));
        //     setTotal(prevTotal => prevTotal - item.subTotal);
        //     if(response.remItem?.dishes?.length === 0){
        //         console.log('empty cart');
        //         setCook({cookId: '', cookName: ''});
        //     }
        // }
        // else{
        //     throw new Error('Item not found in cart');
        // }
    }

    useEffect(() => {
        const getCartItemList = async () => {
            if(currentUser.role==="user"){
                try {
                    setLoadingCart(true);
                    const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/cart/${currentUser._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.error) {
                        throw response;
                    }
                    console.log(response);
                    setCartItems(response.cart.dishes);
                    setCook({cookId: response.cart.cookId, cookName: response.cart.cookName});
                    setTotal(response.cart.totalCost);
                } catch (error) {
                    alert(error);
                    console.error('Error:', error);
                } finally {
                    setLoadingCart(false);
                }
            }
        };
        if(currentUser){
            getCartItemList();
        }
    }, [currentUser]);

    if (loadingCart) {
        return (
            <Backdrop
                style={{ opacity: 1, visibility: 'visible'}}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <CartContext.Provider value={{ addToCart, removeFromCart, decFromCart, cook, setCook, total, setTotal, cartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
}