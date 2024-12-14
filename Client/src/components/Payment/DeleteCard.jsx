import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';

// For react-modal
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
        borderRadius: '4px',
    },
};

function DeleteCard(props) {
    const navigate = useNavigate();
    const { apiCall } = useApi();
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const isById = props.isById;
    const card = props.deleteCard;
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        props.handleClose();
    };

    const handleDeleteCard = async (e) => {
        try {
            e.preventDefault();
            const cardId = card._id; // Get the ID of the card to delete

            // Perform API call to delete the card
            const deleteCard = async () => {
                try {
                    const response = await apiCall(
                        `${import.meta.env.VITE_SERVER_URL}/users/paymentCard/${props.userId}/${cardId}`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    if (response.error) {
                        throw response;
                    }
                    console.log('Card successfully deleted:', response);
                } catch (error) {
                    alert(error);
                }
            };

            await deleteCard();
            setShowDeleteModal(false);
            alert('Card Deleted');
            props.handleClose();

            if (isById) {
                navigate('/user/payment-cards');
            } else {
                props.refreshCards();
            }
        } catch (e) {
            setError(true);
            const errorMessage = e.message ? e.message : e;
            setErrorMsg('Error deleting card: ' + errorMessage);
        }
    };

    return (
        <div>
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel='Delete Card'
                style={customStyles}
            >
                <div>
                    <Typography variant='h6' align='center'>
                        Are you sure you want to delete the card ending in "{card.last4Digits}"?
                    </Typography>
                    {error && (
                        <Typography
                            variant='body1'
                            align='center'
                            gutterBottom
                            className='errorMessage'
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {errorMsg}
                        </Typography>
                    )}
                    <form className='form' id='delete-card' onSubmit={handleDeleteCard}>
                        <Box>
                            <Box display='flex' justifyContent='flex-end' gap={2}>
                                <Button variant='contained' color='error' type='submit'>
                                    Delete Card
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
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

export default DeleteCard;
