import React, { useState } from 'react';
import { Terminal, Shield, Wrench, AlertTriangle, CheckCircle, Info, X, Maximize2, Minimize2 } from 'lucide-react';
import { AgentMessage } from '../types';

interface AgentTerminalProps {
  messages: AgentMessage[];
  isOpen: boolean;
  onClose: () => void;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  messages,
  isOpen,
  onClose
}) => {
  const [filter, setFilter] = useState<'ALL' | 'GOVERNOR' | 'ENGINEER' | 'INCIDENTS'>('ALL');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredMessages = messages.filter(msg => {
    if (filter === 'GOVERNOR') return msg.sender === 'RELEASE_GOVERNOR';
    if (filter === 'ENGINEER') return msg.sender === 'VALIDATION_ENGINEER';
    if (filter === 'INCIDENTS') return msg.type === 'INCIDENT' || msg.type === 'BLOCK';
    return true;
  });

  return (
    <div 
      className={`fixed bottom-0 right-0 z-40 bg-[#0a0b0e] border-t-2 border-l-2 border-[#2d3139] shadow-2xl flex flex-col font-mono transition-all duration-300 ${
        isExpanded ? 'w-full h-3/4' : 'w-full md:w-[640px] h-[440px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#15171a] border-b border-[#2d3139] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#ff4e00]" />
          <span className="font-bold text-white uppercase tracking-wider">DUAL-AGENT PROTOCOL STREAM</span>
          <span className="text-[10px] text-[#8e9299]">({messages.length} EVENTS)</span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${filter === 'ALL' ? 'bg-[#ff4e00] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white'}`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter('GOVERNOR')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${filter === 'GOVERNOR' ? 'bg-[#00ff41] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white'}`}
          >
            GOV (A1)
          </button>
          <button
            onClick={() => setFilter('ENGINEER')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${filter === 'ENGINEER' ? 'bg-[#ff4e00] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white'}`}
          >
            ENG (A2)
          </button>
          <button
            onClick={() => setFilter('INCIDENTS')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${filter === 'INCIDENTS' ? 'bg-[#ff4e00] text-[#0a0b0e] animate-pulse' : 'text-[#8e9299] hover:text-white'}`}
          >
            ALERTS
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#8e9299] hover:text-white cursor-pointer"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#8e9299] hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs text-[#e0e0e0]">
        {filteredMessages.length === 0 ? (
          <div className="text-center text-[#5c6370] py-10">NO AGENT MESSAGES LOGGED IN THIS VIEW.</div>
        ) : (
          filteredMessages.map(msg => {
            const isGov = msg.sender === 'RELEASE_GOVERNOR';
            const isEng = msg.sender === 'VALIDATION_ENGINEER';
            const isBlock = msg.type === 'BLOCK' || msg.type === 'INCIDENT';
            const isReviewPass = msg.type === 'REVIEW' && msg.title.includes('Approved');

            return (
              <div
                key={msg.id}
                className={`p-2.5 rounded border text-[11px] transition-all ${
                  isBlock
                    ? 'bg-[#15171a] border-2 border-[#ff4e00] text-[#ff4e00] shadow-sm'
                    : isReviewPass
                    ? 'bg-[#15171a] border border-[#00ff41] text-[#00ff41]'
                    : isGov
                    ? 'bg-[#15171a] border border-[#2d3139] text-[#e0e0e0]'
                    : isEng
                    ? 'bg-[#15171a] border border-[#2d3139] text-[#e0e0e0]'
                    : 'bg-[#0a0b0e] border border-[#2d3139] text-[#8e9299]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isGov ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139] font-bold text-[10px] flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5 text-[#00ff41]" /> [GOVERNOR]
                      </span>
                    ) : isEng ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#0a0b0e] text-[#ff4e00] border border-[#2d3139] font-bold text-[10px] flex items-center gap-1">
                        <Wrench className="w-2.5 h-2.5 text-[#ff4e00]" /> [ENGINEER]
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-[#2d3139] text-[#e0e0e0] text-[10px] font-bold">
                        [SYSTEM]
                      </span>
                    )}

                    <span className="text-white font-bold">{msg.title}</span>

                    {msg.gate && (
                      <span className="px-1 py-0.2 rounded bg-[#2d3139] text-[#e0e0e0] text-[9px] font-bold border border-[#404550]">
                        GATE: {msg.gate}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-[#8e9299]">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-[#e0e0e0] leading-relaxed pl-1">{msg.content}</p>

                {msg.provenance && (
                  <div className="mt-1.5 pt-1 border-t border-[#2d3139] flex items-center gap-2 text-[10px]">
                    <span className="text-[#8e9299]">PROVENANCE:</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      msg.provenance === 'MEASURED'
                        ? 'bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139]'
                        : msg.provenance === 'SIMULATED'
                        ? 'bg-[#0a0b0e] text-[#ff4e00] border border-[#ff4e00]'
                        : 'bg-[#2d3139] text-white border border-[#404550]'
                    }`}>
                      [{msg.provenance}]
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
