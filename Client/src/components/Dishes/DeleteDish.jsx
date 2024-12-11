import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, TextField } from '@mui/material';
import { validateId } from '../../helpers/validationHelper.js';
import { useApi } from '../../contexts/ApiContext';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function DeleteModal(props) {
    const navigate = useNavigate();
    const { apiCall } = useApi();
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const isById = props.isById;
    const attr = props.attr;
    if (attr == 'dish') {
        const [dish, setDish] = useState(props.deleteDish);
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');

        const handleCloseDeleteModal = () => {
            setShowDeleteModal(false);
            setDish(null);
            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Dish'
                    style={customStyles}
                >
                    <div>
                        <Typography variant="h6" align="center">
                            Are you sure you want to delete "{dish.name}"?
                        </Typography>
                        {error && <Typography
                            variant="body1"
                            align="center"
                            gutterBottom
                            className='errorMessage'
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {errorMsg}
                        </Typography>}
                        <form
                            className='form'
                            id='delete-dish'
                            onSubmit={async (e) => {
                                try {
                                    e.preventDefault();
                                    let errors = [];
                                    let id = dish._id;
                                    // try {
                                    //     id = validateId(id);
                                    // } catch (err) {
                                    //     errors.push(err);
                                    // }
                                    const deleteDish = async () => {
                                        try {
                                            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/dishes/${id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                }
                                            });
                                            if (response.error) {
                                                throw response;
                                            }

                                            console.log("Dish successfully deleted:", response.dish);
                                        } catch (error) {
                                            alert(error);
                                        }
                                    };

                                    await deleteDish();
                                    setShowDeleteModal(false);

                                    alert('Dish Deleted');
                                    props.handleClose();
                                    if (isById) {
                                        navigate('/cook/dishes');
                                    } else {
                                        props.refreshDishes();
                                    }
                                } catch (e) {
                                    setError(true);
                                    const errorMessage = e.message ? e.message : e;
                                    setErrorMsg("Error deleting author:" + errorMessage);
                                }
                            }}
                        >
                            <Box>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type="submit"
                                    >
                                        Delete Dish
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="string"
                                        onClick={handleCloseDeleteModal}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </div>
                </ReactModal>
            </div>
        );
    }

}

export default DeleteModal;
