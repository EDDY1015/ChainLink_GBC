import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import {
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Card,
  CardContent,
} from '@mui/material';


const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "dataFeeds",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "pair",
				"type": "string"
			}
		],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const CONTRACT_ADDRESS = "0x733ca445dc424dcfea3cca0544f29bf8f92448da";

function App() {
  const [selectedPair, setSelectedPair] = useState('');
  const [price, setPrice] = useState('');

  const handleFetchPrice = async () => {
    if (!selectedPair) return alert('Please select a currency pair');

    try {
      if (!window.ethereum) {
        alert('Please install Metamask!');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);

      const fetchedPrice = await contract.getLatestPrice(selectedPair);

      const priceInDecimals = Number(fetchedPrice) / 10 ** 8; 
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInDecimals);

    setPrice(formattedPrice);
      //setPrice(fetchedPrice.toString());
    } catch (error) {
      console.error('Error fetching price:', error);
      alert('Failed to fetch the price. Check the console for details.');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto", border: "1px solid #ccc", borderRadius: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Currency Conversion
          </Typography>
          <RadioGroup
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            sx={{ my: 2 }}
          >
            <FormControlLabel value="BTC/USD" control={<Radio />} label="BTC to USD" />
            <FormControlLabel value="ETH/USD" control={<Radio />} label="ETH to USD" />
            <FormControlLabel value="DAI/USD" control={<Radio />} label="DAI to USD" />
            <FormControlLabel value="LINK/USD" control={<Radio />} label="LINK to USD" />
           
          </RadioGroup>
          <Button variant="contained" color="primary" fullWidth onClick={handleFetchPrice}>
            Get Conversion
          </Button>
          {price && (
            <Typography sx={{ mt: 2 }} align="center">
              Latest Price: {price}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
