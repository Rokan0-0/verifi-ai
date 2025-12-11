require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const port = 3001;

// === CONFIGURATION ===
// Uses .env but falls back to hardcoded ONLY for local dev safety if .env fails
const SELLER_WALLET = process.env.SELLER_WALLET || "0xYourWalletHere"; 
const PRICE_AVAX = "0.1";
const FUJI_RPC = process.env.FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc";

// Setup Ethers Provider
const provider = new ethers.JsonRpcProvider(FUJI_RPC);

app.use(cors());
app.use(express.json());

// === SAFETY CHECK ===
if (!process.env.SELLER_WALLET) {
    console.warn("⚠️ WARNING: SELLER_WALLET not found in .env. Using fallback/dummy address.");
}

// === THE ENDPOINT ===
app.post('/api/ask-agent', async (req, res) => {
    const { query, paymentTxHash } = req.body;
    console.log(`\n[INCOMING] Query: "${query}" | Tx: ${paymentTxHash || "None"}`);

    // 1. GATEWAY: HTTP 402 PAYMENT REQUIRED
    if (!paymentTxHash) {
        console.log(">> ⛔ Blocking request. Sending 402.");
        return res.status(402).json({
            error: "Payment Required",
            details: {
                receiver: SELLER_WALLET,
                amount: PRICE_AVAX,
                currency: "AVAX",
                chain: "Avalanche Fuji",
                description: "Mercenary Agent Insight Fee"
            }
        });
    }

    // 2. VERIFICATION (Real + Dev Bypass)
    if (paymentTxHash === "DEV_BYPASS_KEY_123") {
        console.log(">> 🛠️ DEV MODE DETECTED. Access Granted.");
    } else {
        try {
            console.log(`>> 🔍 Verifying On-Chain Tx: ${paymentTxHash}...`);
            const tx = await provider.getTransaction(paymentTxHash);
            
            if (!tx) throw new Error("Transaction not found");
            if (tx.to.toLowerCase() !== SELLER_WALLET.toLowerCase()) throw new Error("Wrong Recipient");
            
            console.log(">> ✅ Payment Valid.");
        } catch (err) {
            console.error("Payment Verification Failed:", err.message);
            return res.status(403).json({ error: "Invalid Payment", reason: err.message });
        }
    }

    // 3. THE MERCENARY AI ENGINE (Simulation)
    const isWallet = query.trim().startsWith("0x");
    const upperQuery = query.toUpperCase();
    let analysis = "";

    // --- MODE A: ROAST MY WALLET (Entertainment) ---
    if (isWallet) {
        // Randomize net worth for variety
        const netWorth = (Math.random() * (800 - 5) + 5).toFixed(2); 
        const isRekt = netWorth < 200;
        
        const roast = isRekt 
            ? "absolute dust. Did you click a drainer link or are you just bad at this?" 
            : "exit liquidity for VC unlocks. Stop buying tops.";

        const score = isRekt ? "4/100 (NGMI)" : "42/100 (Mid-Curve)";

        analysis = `
### 💀 Wallet Audit: ${query.substring(0, 6)}...${query.substring(38)}
**Net Worth:** $${netWorth}
**Degen Score:** ${score}

**The Roast:**
I scanned your on-chain history. You are holding ${roast}

**Mercenary Advice:**
Bridge your assets to Avalanche and buy something with actual utility before you get rugged again.
        `;
    } 
    
    // --- MODE B: ALPHA HUNTER (Utility) ---
    else {
        const token = upperQuery.includes("BTC") ? "BTC" : (upperQuery || "AVAX");
        // 60% chance of Bullish result
        const isBullish = Math.random() > 0.4; 
        
        const signal = isBullish ? "🟢 APE IN" : "🔴 DUMP IT";
        const sentiment = isBullish ? "Whales are accumulating heavily." : "Insiders are dumping.";
        
        // Randomize price targets
        const upside = (Math.random() * (500 - 20) + 20).toFixed(0);
        const downside = (Math.random() * (90 - 10) + 10).toFixed(0);
        const target = isBullish ? `+${upside}%` : `-${downside}%`;

        analysis = `
### ⚔️ Mercenary Signal: ${token}
**Verdict:** ${signal}
**Potential Upside:** ${target}

**Intel (x402 Exclusive):**
${sentiment} I tracked a wallet (0x8f...2a) that moved $200k in the last 15 minutes. 

**Strategy:**
Don't be a jeet. ${isBullish ? "Hold until the targets hit." : "Cut your losses now."}
        `;
    }

    // SEND RESPONSE
    res.json({
        success: true,
        data: {
            answer: analysis.trim(),
            metadata: {
                source: "Mercenary Private Node",
                agent_id: "MERC-001",
                gas_used: "Low"
            }
        }
    });
});

app.listen(port, () => {
    console.log(`\n🤖 Mercenary Gateway running on port ${port}`);
    console.log(`💰 Receiver: ${SELLER_WALLET}`);
});