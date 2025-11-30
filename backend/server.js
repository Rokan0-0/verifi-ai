require('dotenv').config();
const express = require('express');
const { paymentMiddleware } = require('x402-express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG: Your wallet that receives the money
const SELLER_WALLET = process.env.SELLER_WALLET_ADDRESS; 

// The x402 Gate
app.use('/agent/sentiment', paymentMiddleware(SELLER_WALLET, {
    price: "0.10", // Cost in USDC
    token: "USDC", 
    network: "avalanche-fuji" // Testnet for the hackathon
}));

// The Protected Resource (Only runs if payment succeeds)
app.get('/agent/sentiment', (req, res) => {
    // TODO: Connect to Kite AI / TURF here later
    res.json({ 
        sentiment: "Bullish", 
        confidence: "87%",
        source: "Verifi-AI Agent Swarm"
    });
});

app.listen(4000, () => console.log('Verifi-AI Node running on port 4000'));