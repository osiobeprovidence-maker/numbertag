
import React, { useState, useEffect } from 'react';

const ProtocolLoader: React.FC = () => {
  const [log, setLog] = useState('INITIALIZING BOOT SEQUENCE...');
  const technicalLogs = [
    'CALIBRATING INTENT LAYER...',
    'SYNCHRONIZING VAULT LEDGER...',
    'ENCRYPTING HANDSHAKE TUNNELS...',
    'AUTHENTICATING NODE IDENTITY...',
    'READY FOR PROTOCOL ENTRY.'
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < technicalLogs.length) {
        setLog(technicalLogs[i]);
        i++;
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="relative mb-12 animate-scale-in">
        <div className="w-24 h-24 bg-[#bef264] rounded-[2rem] flex items-center justify-center text-black font-black text-5xl shadow-[0_0_50px_rgba(190,242,100,0.3)] animate-pulse">
          #
        </div>
        <div className="absolute -inset-4 border border-[#bef264]/20 rounded-[2.5rem] animate-ping opacity-20"></div>
      </div>

      <div className="w-full max-w-xs space-y-4 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bef264] h-4 flex items-center justify-center italic">
          {log}
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div className="h-full bg-[#bef264] shadow-[0_0_10px_#bef264] animate-sync"></div>
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700 animate-pulse">
          Secure Handshake v4.0.2
        </div>
      </div>

      <div className="absolute bottom-12 left-12 hidden md:block">
        <div className="text-[8px] font-mono text-zinc-800 space-y-1">
          <p>NT_PROC_START: 0x88912</p>
          <p>LOAD_VAULT: SUCCESS</p>
          <p>PULSE_RADAR: ONLINE</p>
        </div>
      </div>
    </div>
  );
};

export default ProtocolLoader;
