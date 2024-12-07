import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactModal from 'react-modal';
import MealsRequestModal from './MealRequests';
function User() {
    const [MEAL_REQUEST_MODAL, SHOW_MEAL_REQUEST_MODAL] = useState(false);
    const [MEAL_REQUEST_USER, SET_MEAL_REQUEST_USER] = useState(false);

    // let { id } = useParams()
    // id = id.trim;

    const open_meals_request_modal = (getUserMeals) => {
        SHOW_MEAL_REQUEST_MODAL(true);
        SET_MEAL_REQUEST_USER(getUserMeals);
    };

    const handle_close_all_modals = () => {
        SHOW_MEAL_REQUEST_MODAL(false)
    }

    // =====================================================
    // TO BE CHANGED
    // const { loading, error, data } = useQuery(queries.GET_AUTHOR_BY_ID, {
    //     variables: { id },
    //     fetchPolicy: 'cache-and-network'
    // });
    let data = {
        _id: '6753a59eafdb6b75a60b2de4',
        firstName: 'Sakshi',
        lastName: 'Sherkar',
        username: 'ssherkar',
        password: 'Temp##1234',
        gmail: 'sakshi@gmail.com',
        mobileNumber: '+12351500899',
        address: '122 Nelson Avenue',
        city: 'Jersey City',
        state: 'NJ',
        zipcode: '07307',
        country: 'US'
    };

    // =============================================
    return (
        <div>
            <button className='button'
            // onClick={() => handleCartModal()}
            >
                Cart
            </button>
            <br />
            <br />
            <button className='button'
            // onClick={() => handleCartModal()}
            >
                My Profile
            </button>
            <br />
            <br />
            <button className='button'
            // onClick={() => handleCartModal()}
            >
                Orders
            </button>
            <br />
            <br />
            <button className='button'
                onClick={() => open_meals_request_modal(data)}
            >
                Meal Request
            </button>

            {MEAL_REQUEST_MODAL && (
                <MealsRequestModal
                    isOpen={MEAL_REQUEST_MODAL}
                    meals={MEAL_REQUEST_USER}
                    handleClose={handle_close_all_modals}
                />
            )}
        </div>
    )

}

export default User;