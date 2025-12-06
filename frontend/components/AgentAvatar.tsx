export default function AgentAvatar({ state }: { state: 'idle' | 'loading' | 'active' }) {
  // CSS for the glowing orb effect
  const getPulseColor = () => {
    if (state === 'loading') return 'bg-yellow-400 shadow-yellow-400/50'; // Thinking
    if (state === 'active') return 'bg-green-400 shadow-green-400/50';   // Speaking
    return 'bg-blue-500 shadow-blue-500/50';                             // Idle
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className={`relative w-24 h-24 rounded-full transition-all duration-500 ${getPulseColor()} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
        {/* Inner Core */}
        <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center z-10">
          <span className="text-4xl">
            {state === 'loading' ? '⏳' : '🤖'}
          </span>
        </div>
        
        {/* Animated Rings (Only when loading/active) */}
        {state !== 'idle' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-white opacity-20 animate-ping"></div>
            <div className="absolute -inset-2 rounded-full border border-white opacity-10 animate-pulse"></div>
          </>
        )}
      </div>
      <p className="mt-4 text-gray-400 text-sm tracking-widest uppercase">
        {state === 'loading' ? 'ANALYZING ON-CHAIN DATA...' : 'VERIFI-AI AGENT ONLINE'}
      </p>
    </div>
  );
}