import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Button, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { useApi } from '../../contexts/ApiContext';
import { AuthContext } from '../../contexts/AccountContext';
import { checkisValidString, validateCvv, validateZipCode } from '../../helpers/validationHelper.js';
import helpers from '../../helpers/pranHelpers.js'

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
        maxHeight: '50vh',
        overflowY: 'auto'
    }
};

function EditCard(props) {
    const { apiCall } = useApi();
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [card, setCard] = useState(props.card);
    const userId = props.userId;
    const [cardType, setCardType] = useState(card.type.toUpperCase() || 'debit');
    const [provider, setProvider] = useState(card.provider || 'Visa');
    const [cardNumber, setCardNumber] = useState(`**** **** **** ${card.last4Digits}` || '');
    const [cardHolderName, setCardHolderName] = useState(card.cardHolderName || '');
    const [expirationDate, setExpirationDate] = useState(card.expirationDate || '');
    const [cvv, setCvv] = useState('');
    const [zipcode, setZipcode] = useState(card.zipcode || '');
    const [country, setCountry] = useState(card.country || '');
    // const [isDefault, setIsDefault] = useState(card.isDefault || false);
    const [nickName, setNickName] = useState(card.nickName || '');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [dataModified, setDataModified] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleCardNumberChange = (event) => {
        if (card.cardNumber !== event.target.value) setDataModified(true);
        setCardNumber(event.target.value);
    };

    const handleCardHolderNameChange = (event) => {
        if (card.cardHolderName !== event.target.value.trim()) setDataModified(true);
        setCardHolderName(event.target.value);
    };

    const handleExpirationDateChange = (event) => {
        if (card.expirationDate !== event.target.value.trim()) setDataModified(true);
        setExpirationDate(event.target.value);
    };

    const handleCvvChange = (event) => {
        if (card.cvv !== event.target.value.trim()) setDataModified(true);
        setCvv(event.target.value);
    };

    const handleZipcodeChange = (event) => {
        if (card.zipcode !== event.target.value.trim()) setDataModified(true);
        setZipcode(event.target.value);
    };

    const handleCountryChange = (event) => {
        if (card.country !== event.target.value.trim()) setDataModified(true);
        setCountry(event.target.value);
    };

    const handleNicknameChange = (event) => {
        if (card.nickName !== event.target.value.trim()) setDataModified(true);
        setNickName(event.target.value);
    };

    const handleIsDefaultChange = (event) => {
        setIsDefault(event.target.checked);
        setDataModified(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCard(null);
        props.handleClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setDataModified(false);
        setError(false);
        setErrorMsg('');

        let errors = [];

        // Basic validation
        if (!cardHolderName || !expirationDate || !cvv || !zipcode || !country || !nickName) {
            throw 'At least one field must be updated';
        }

        if (cardHolderName) {
            try {
                let cardHolderNameVal = helpers.checkString(cardHolderName.trim(), 'Card Holder Name');
                cardHolderNameVal = helpers.checkSpecialCharsAndNum(cardHolderNameVal, 'Card Holder Name');
                setCardHolderName(cardHolderNameVal);
                setDataModified(true);
            } catch (e) {
                errors.push(e);
            }
        }


        if (expirationDate) {
            try {
                if (!helpers.isValidExpirationDate(expirationDate.trim())) throw 'Your Card is Expired';
                setDataModified(true);
            } catch (e) {
                errors.push(e);
            }
        }

        if (cvv) {
            try {
                let cvvVal = validateCvv(cvv.trim(), 'CVV');
                setCvv(cvvVal);
                setDataModified(true);
            } catch (e) {
                errors.push(e);
            }
        }
        if (zipcode) {
            try {
                let zipcodeVal = validateZipCode(zipcode.trim(), 'Zipcode');
                setZipcode(zipcodeVal);
                setDataModified(true);
            } catch (e) {
                errors.push(e);
            }
        }
        if (country) {
            try {
                let countryVal = helpers.checkString(country.trim(), 'Country');
                countryVal = helpers.checkSpecialCharsAndNum(countryVal, 'Country');
                setCountry(countryVal);
                setDataModified(true);
            } catch (e) {
                errors.push(e);
            }
        }

        if (nickName) {
            try {
                let nickNameVal = checkisValidString(nickName.trim(), 'Nickname');
                setNickName(nickNameVal);
                setDataModified(true);
            } catch (e) {
                errors.push(e);
            }
        }
        // Check if the data has been modified
        if (!dataModified) {
            errors.push('No modifications were made to the card details.');
        }

        if (errors.length > 0) {
            setError(true);
            setErrorMsg(errors.join('\n'));
            setLoading(false);
            return;
        }

        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/paymentCard/${userId}/${card._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardHolderName: cardHolderName,
                    expirationDate: expirationDate,
                    cvv: cvv,
                    zipcode: zipcode,
                    country: country,
                    // isDefault: isDefault,
                    nickName: nickName
                })
            });

            if (response.error) {
                throw response.error;
            }

            console.log("Card successfully updated:", response.card);

            setShowEditModal(false);
            setLoading(false);
            alert('Card Updated');
            props.refreshCards();
            props.handleClose();

        } catch (error) {
            setError(true);
            const errorMessage = error.message || error;
            setErrorMsg('Error editing card: ' + errorMessage);
        }
    };

    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Card'
                style={customStyles}
            >
                <Typography variant="h5" gutterBottom>Edit Card</Typography>
                {error && <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    className='errorMessage'
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {errorMsg}
                </Typography>}

                <form className="form" onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Card Type"
                            variant="outlined"
                            fullWidth
                            required
                            value={cardType}
                            disabled
                        />
                        <TextField
                            label="Card Provider"
                            variant="outlined"
                            fullWidth
                            required
                            value={provider}
                            disabled
                        />
                        <TextField
                            label="Card Number"
                            variant="outlined"
                            fullWidth
                            required
                            value={cardNumber}
                            disabled
                        //onChange={handleCardNumberChange}
                        />
                        <TextField
                            label="Card Holder Name"
                            variant="outlined"
                            fullWidth
                            required
                            value={cardHolderName}
                            onChange={handleCardHolderNameChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Expiration Date (MM/YY)"
                            variant="outlined"
                            fullWidth
                            required
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                            disabled={loading}
                            inputProps={{
                                maxLength: 5,
                            }}
                        />
                        <TextField
                            label="CVV"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={cvv}
                            onChange={handleCvvChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Zipcode"
                            variant="outlined"
                            fullWidth
                            required
                            value={zipcode}
                            onChange={handleZipcodeChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Country"
                            variant="outlined"
                            fullWidth
                            required
                            value={country}
                            disabled
                        />
                        {/* <FormControl fullWidth disabled={loading}>
                            <InputLabel id="isDefault-label">Set as Default</InputLabel>
                            <Select
                                labelId="isDefault-label"
                                id="isDefault"
                                value={isDefault}
                                onChange={(e) => handleIsDefaultChange(e)}
                                label="Set as Default"

                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl> */}
                        <TextField
                            label="Nickname (Optional)"
                            fullWidth
                            value={nickName}
                            onChange={handleNicknameChange}
                            sx={{ mb: 2 }}
                            disabled={loading}
                        />

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Update'}
                            </Button>
                            <Button
                                variant="contained"
                                color="string"
                                onClick={handleCloseEditModal}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </form>
            </ReactModal>
        </div>
    );
}

export default EditCard;
