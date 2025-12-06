require('dotenv').config(); // Make sure this is at the VERY TOP

const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const port = 3001;

// CONFIGURATION
const SELLER_WALLET = process.env.SELLER_WALLET_ADDRESS;
const PRICE_AVAX = "0.1";
const FUJI_RPC = process.env.FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc";

// SAFETY CHECK: Crash if .env is missing
if (!SELLER_WALLET) {
    console.error("❌ ERROR: SELLER_WALLET_ADDRESS is missing from .env file!");
    process.exit(1);
}

console.log(`Verifi-AI Gateway Configured`);
console.log(`Receiver Wallet: ${SELLER_WALLET}`);

app.use(cors());
app.use(express.json());

// Provider to check blockchain
const provider = new ethers.JsonRpcProvider(FUJI_RPC);

app.post('/api/ask-agent', async (req, res) => {
    const { query, paymentTxHash } = req.body;
    
    // DEBUG LOGGING (Add this to see what is happening in the terminal)
    console.log("Received Query:", query);
    console.log("Received Hash:", paymentTxHash);

    // 1. GATEWAY CHECK (The 402 Wall)
    if (!paymentTxHash) {
        return res.status(402).json({
            error: "Payment Required",
            details: {
                receiver: SELLER_WALLET,
                amount: PRICE_AVAX,
                currency: "AVAX",
                chain: "Avalanche Fuji",
                description: "Verifi-AI Agent Insight Fee"
            }
        });
    }

    // 2. VERIFICATION LOGIC
    // === THE BACKDOOR ===
    if (paymentTxHash === "DEV_BYPASS_KEY_123" || paymentTxHash === "FREE_DEV_PASS_2025") {
        console.log(">> 🟢 DEV MODE DETECTED. Access Granted.");
        // We do NOT check the blockchain. We just continue down.
    } 
    // === THE REAL DOOR ===
    else {
        try {
            console.log(`>> Verifying On-Chain Tx: ${paymentTxHash}...`);
            const tx = await provider.getTransaction(paymentTxHash);
            
            if (!tx) throw new Error("Transaction not found");
            if (tx.to.toLowerCase() !== SELLER_WALLET.toLowerCase()) throw new Error("Wrong Recipient");
            
            console.log(">> Payment Valid.");
        } catch (err) {
            console.error("Payment Verification Failed:", err.message);
            // This is where your 403 comes from
            return res.status(403).json({ error: "Invalid Payment", reason: err.message });
        }
    }

    // 3. AI RESPONSE (The "Smart" Analyst)
    // We mock a complex interaction between Kite AI (Logic) and TURF (Data)
    
    // Detect what token they asked about (Default to AVAX)
    const token = query.toUpperCase().includes("BTC") ? "BTC" : "AVAX";
    const isAvax = token === "AVAX";

    // Mock Data that looks real
    const price = isAvax ? "42.50" : "98,400.00";
    const sentiment = isAvax ? "🟢 STRONG BUY" : "🟡 NEUTRAL";
    const volume = isAvax ? "+18.2%" : "-2.4%";
    
    // The "Product": A formatted markdown report
    const analysis = `
### 📊 Market Intelligence: ${token}
**Signal:** ${sentiment}

**On-Chain Rationale (TURF Oracle):**
• **Whale Activity:** High inflow detected (>$5M) in last 4h.
• **Volume Delta:** ${volume} vs 24h average.
• **Resistance:** $${price} is holding as key support.

**Agent Recommendation:**
Accumulate. The x402 payment volume on Subnet-C suggests rising utility demand.
    `;

    res.json({
        success: true,
        data: {
            answer: analysis.trim(),
            metadata: {
                source: "TURF Network Aggregator",
                confidence: "94.2%",
                compute_time: "0.4s",
                model: "Kite-AI-Financial-v2"
            }
        }
    });
});

app.listen(port, () => {
    console.log(`\nVerifi-AI Gateway running on port ${port}`);
});