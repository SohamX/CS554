import React, { useState } from 'react';
import { Button, Typography, Box, TextField, Card, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext.jsx';

function AddCard(props) {
    const { apiCall } = useApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [cardType, setCardType] = useState('debit');
    const [provider, setProvider] = useState('Visa');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('United States');
    const [isDefault, setIsDefault] = useState(false);
    const [nickName, setNickName] = useState('');

    // Handlers
    const handleCardNumberChange = (e) => setCardNumber(e.target.value);
    const handleCardHolderNameChange = (e) => setCardHolderName(e.target.value);
    const handleExpirationDateChange = (e) => setExpirationDate(e.target.value);
    const handleCvvChange = (e) => setCvv(e.target.value);
    const handleZipcodeChange = (e) => setZipcode(e.target.value);
    const handleCountryChange = (e) => setCountry(e.target.value);
    const handleIsDefaultChange = (e) => setIsDefault(e.target.checked);

    const handleSubmitPayment = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!amount || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
            setError(true);
            setErrorMsg('All fields are required');
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMsg('');

        try {
            const response = await apiCall(`${import.meta.env.VITE_SERVER_URL}/users/paymentCard/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    type: cardType,
                    provider: provider,
                    cardNumber: cardNumber,
                    cardHolderName: cardHolderName,
                    expirationDate: expirationDate,
                    cvv: cvv,
                    zipcode: zipcode,
                    country: country,
                    isDefault: "false",
                    nickName: nickName,

                }),
            });

            if (response.error) {
                console.error('Failed to store payment method');
                throw response.error;
            }
        } catch (error) {
            console.error('Error sending payment method to backend:', error);
            alert(error);
            setError(true);
            setErrorMsg(`Could not add card: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <Card sx={{ padding: 3, borderRadius: 2, boxShadow: 3, maxWidth: 500, width: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Add Card
                </Typography>

                {error && (
                    <Typography color="error" align="center" gutterBottom>
                        {errorMsg}
                    </Typography>
                )}

                <form id="add-card" onSubmit={handleSubmitPayment}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <FormControl fullWidth>
                            <InputLabel id="cardType-label">Card Type</InputLabel>
                            <Select
                                labelId="cardType-label"
                                id="cardType"
                                value={cardType}
                                onChange={(e) => setCardType(e.target.value)}
                                label="Card Type"
                            >
                                <MenuItem value="debit">Debit</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="provider-label">Card Provider</InputLabel>
                            <Select
                                labelId="provider-label"
                                id="provider"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                label="Card Provider"
                            >
                                <MenuItem value="Visa">Visa</MenuItem>
                                <MenuItem value="Mastercard">Mastercard</MenuItem>
                                <MenuItem value="American Express">American Express</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Card Number"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Cardholder Name"
                            value={cardHolderName}
                            onChange={handleCardHolderNameChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Expiration Date (MM/YY)"
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="CVV"
                            value={cvv}
                            onChange={handleCvvChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Zip Code"
                            value={zipcode}
                            onChange={handleZipcodeChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select
                                labelId="country-label"
                                id="country"
                                value={country}
                                onChange={handleCountryChange}
                                label="Country"
                            >
                                <MenuItem value="United States">United States</MenuItem>
                                {/* <MenuItem value="Canada">Canada</MenuItem>
                                <MenuItem value="United Kingdom">United Kingdom</MenuItem> */}
                                {/* Add more countries as needed */}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
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
                        </FormControl>
                        <TextField
                            label="Nickname (Optional)"
                            fullWidth
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mr: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Add'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{ ml: 1 }}
                            onClick={() => {
                                document.getElementById('add-card').reset();
                                props.closeAddFormState();
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    );
}

export default AddCard;
