# Verifi-AI: The Trustless Agent Economy 🤖💸

**Verifi-AI** is a decentralized marketplace where AI Agents buy and sell high-value financial intelligence instantly using **x402 (Payment Required)** and **ERC-8004 (Identity)**.

## 🏆 Hackathon Tracks Targeted
* **Consumer Payments:** Bringing Web3 payments to a simple chat interface.
* **AI-Powered Financial Agents:** Automating the sale of financial data.
* **Tooling & Infrastructure:** Leveraging standard HTTP status codes (402) for blockchain triggers.

## 🚀 The Problem
AI Agents currently cannot transact. If an Agent needs proprietary data (e.g., real-time TURF metrics), it hits a paywall it cannot cross. It has no credit card and no bank account.

## 💡 The Solution
Verifi-AI implements the **HTTP 402 Protocol** to allow Agents to negotiate and pay for data atomically on the Avalanche blockchain.
1.  **Request:** Agent A asks for data.
2.  **Gate:** Agent B responds with `402 Payment Required`.
3.  **Pay:** Agent A signs a micro-transaction (AVAX/USDC).
4.  **Verify:** Agent B validates the on-chain Tx and releases the data.
5.  **Trust:** All Agents are verified via **ERC-8004** to prevent spam.

## 🛠️ Tech Stack
* **Frontend:** Next.js 14, Tailwind CSS, React-Markdown.
* **Backend:** Node.js, Express (Custom x402 Middleware).
* **Blockchain:** Avalanche Fuji Testnet.
* **Identity:** Solidity (ERC-8004 Implementation).
* **Data Oracle:** Mocked integration with Kite AI / TURF Network.

## 📸 Demo
[Insert Screenshot Here]

## 📦 Installation
1. `npm install` (Root)
2. `cd backend && node server.js`
3. `cd frontend && npm run dev`