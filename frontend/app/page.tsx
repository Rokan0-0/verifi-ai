'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import ReactMarkdown from 'react-markdown'; // <--- NEW IMPORTS
import remarkGfm from 'remark-gfm';         // <--- NEW IMPORTS
import AgentAvatar from '../components/AgentAvatar'; // <--- NEW COMPONENT

// CONFIG
const AGENT_CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE"; 

export default function Home() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Helper to determine Agent State for the visual
  const getAgentState = () => {
    if (loading) return 'loading';
    if (messages.length > 0 && messages[messages.length-1].role === 'agent') return 'active';
    return 'idle';
  };

  const askAgent = async () => {
    if (!query) return;
    setLoading(true);
    setStatus('Contacting Agent...');
    
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    
    // Clear input for better UX
    const currentQuery = query; 
    setQuery('');

    try {
      let response = await fetch('http://localhost:3001/api/ask-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery })
      });

      if (response.status === 402) {
        setStatus('⚠️ Payment Required (x402 Protocol)');
        const errorData = await response.json();
        
        if (!window.ethereum) return alert("Please install MetaMask!");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request connection if needed
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const paymentDetails = errorData.details;
        const price = paymentDetails.amount;
        const receiver = paymentDetails.receiver;

        setStatus(`Signing Transaction of ${price} AVAX...`);

        let txHash; 
        try {
            const tx = await signer.sendTransaction({
                to: receiver,
                value: ethers.utils.parseEther(price) 
            });
            await tx.wait(); 
            txHash = tx.hash; 
        } catch (paymentError) {
            console.warn("Real payment failed.", paymentError);
            const confirmBypass = confirm("Payment failed (Insufficient Funds). Use Dev Bypass Mode?");
            if (confirmBypass) {
                txHash = "DEV_BYPASS_KEY_123";
                setStatus('🛠️ Using Dev Bypass...');
            } else {
                throw new Error("Payment cancelled");
            }
        }

        setStatus('Payment Confirmed. Unlocking Data...');
        response = await fetch('http://localhost:3001/api/ask-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: currentQuery, 
            paymentTxHash: txHash 
          })
        });
      }

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'agent', content: data.data.answer }]);
      } else {
         alert("Something went wrong!");
      }

    } catch (err: any) {
      console.error(err);
      setStatus('Error: ' + err.message);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* HEADER */}
      <div className="w-full p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/90 backdrop-blur fixed top-0 z-50">
        <div className="font-bold text-xl tracking-tighter text-blue-400">Verifi-AI</div>
        <div className="text-xs text-green-400 border border-green-900 bg-green-900/20 px-2 py-1 rounded">
          ● Fuji Testnet Active
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-3xl flex flex-col pt-24 pb-32 px-4">
        
        {/* 1. THE AGENT VISUAL */}
        <AgentAvatar state={getAgentState()} />

        {/* 2. CHAT AREA */}
        <div className="space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`
                  p-4 rounded-2xl max-w-[85%] shadow-lg overflow-hidden
                  ${m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none'}
                `}
              >
                {/* FIXED CODE: Apply prose class to a wrapper div instead */}
                <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {/* Status Indicators */}
          {status && (
            <div className="flex justify-center">
              <span className="text-xs font-mono text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded animate-pulse">
                {status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* INPUT AREA (FIXED BOTTOM) */}
      <div className="fixed bottom-0 w-full bg-gray-900/80 backdrop-blur border-t border-gray-800 p-4 pb-8">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAgent()}
            placeholder="Ask for Financial Insight (Cost: 0.1 AVAX)" 
            className="flex-1 p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
          />
          <button 
            onClick={askAgent}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
        </div>
        <div className="text-center mt-2 text-[10px] text-gray-600 font-mono">
           Powered by x402 • ERC-8004 Identity • TURF Oracle
        </div>
      </div>
    </main>
  );
}