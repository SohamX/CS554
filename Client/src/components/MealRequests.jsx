import './../App.css';
import React, { useState } from 'react';
import ReactModal from 'react-modal';

function MealsRequestModal(props) {
    const [MEAL_REQUEST_MODAL, SHOW_MEAL_REQUEST_MODAL] = useState(props.isOpen);
    return (
        <>
            <ReactModal
            name= 'mealsRequestModal'
            isOpen={MEAL_REQUEST_MODAL}
            contentLabel='Meals Request'
            >
                <form
                    className='form'
                    id='meals-request'
                >
                    <div>
                    </div>
                </form>
            </ReactModal>
        </>
    )
}

export default MealsRequestModal;