import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Terminal, Play, AlertOctagon, RotateCcw, Lock, CheckCircle2 } from 'lucide-react';
import { ReleaseState } from '../types';
import confetti from 'canvas-confetti';

interface HeaderProps {
  releaseState: ReleaseState;
  onRunAll: () => void;
  onAttemptFakeEvidence: () => void;
  onRollback: () => void;
  onReset: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  releaseState,
  onRunAll,
  onAttemptFakeEvidence,
  onRollback,
  onReset,
  onToggleTerminal,
  isTerminalOpen,
  isRunning
}) => {
  const isAuthorized = releaseState.overallStatus === 'PASS';
  const isBlocked = releaseState.overallStatus === 'BLOCK';
  const isHeld = releaseState.overallStatus === 'HOLD';
  const isRollback = releaseState.overallStatus === 'ROLLBACK_REQUIRED';

  const triggerCelebration = () => {
    if (isAuthorized) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <header className="bg-[#15171a] border-b border-[#2d3139] text-[#e0e0e0] sticky top-0 z-30 shadow-md font-mono">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Brand & Core Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#ff4e00] animate-pulse"></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-widest text-[#ff4e00] uppercase">
                PHOTON-COUNT // SOVEREIGN ORCHESTRATOR
              </h1>
              <span className="px-2 py-0.5 bg-[#2d3139] text-[10px] rounded border border-[#404550] text-[#e0e0e0] font-bold">
                V{releaseState.version} DUAL-AGENT
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 text-[10px] text-[#8e9299] uppercase tracking-tighter mt-0.5">
              <span>LOC: 28.0167° S, 153.4000° E</span>
              <span>PROVENANCE: <span className="text-white font-bold">MEASURED [PROD-ALPHA]</span></span>
              <span className={isAuthorized ? 'text-[#00ff41]' : isBlocked ? 'text-[#ff4e00]' : 'text-[#ff4e00]'}>
                STATUS: {releaseState.overallStatus} {isAuthorized ? '[RELEASE AUTHORIZED]' : isBlocked ? '[INVARIANT BREACH]' : '[WAITING FOR GATES]'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Two-Agent Protocol Status */}
        <div className="hidden xl:flex items-center gap-3 bg-[#0a0b0e] px-3 py-1.5 rounded border border-[#2d3139] text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="text-[#8e9299]">A1:</span>
            <span className="text-[#00ff41] font-bold">GOVERNOR</span>
          </div>
          <span className="text-[#404550]">|</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff4e00] animate-pulse" />
            <span className="text-[#8e9299]">A2:</span>
            <span className="text-[#ff4e00] font-bold">ENGINEER</span>
          </div>
          <span className="text-[#404550]">|</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#ff4e00]" />
            <span className="text-[#8e9299]">PROVENANCE:</span>
            <span className="text-white font-bold">LOCKED</span>
          </div>
        </div>

        {/* Right: Actions & Release Decision Status */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Release Status Badge */}
          <div 
            onClick={triggerCelebration}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border cursor-pointer uppercase transition-all ${
              isAuthorized
                ? 'bg-[#0a0b0e] text-[#00ff41] border-[#00ff41] shadow-sm shadow-[#00ff41]/20 hover:bg-[#00ff41]/10'
                : isBlocked
                ? 'bg-[#0a0b0e] text-[#ff4e00] border-[#ff4e00] animate-pulse'
                : isRollback
                ? 'bg-[#0a0b0e] text-[#ff4e00] border-[#ff4e00] animate-pulse'
                : 'bg-[#0a0b0e] text-[#8e9299] border-[#2d3139]'
            }`}
          >
            {isAuthorized ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff41]" />
            ) : isBlocked ? (
              <ShieldAlert className="w-3.5 h-3.5 text-[#ff4e00]" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#8e9299]" />
            )}
            <span>RELEASE: {releaseState.overallStatus}</span>
          </div>

          {/* Quick Action: Run All 12 Gates */}
          <button
            id="btn-run-all-gates"
            onClick={onRunAll}
            disabled={isRunning}
            className="px-3 py-1.5 rounded bg-[#ff4e00] hover:bg-[#e04500] text-[#0a0b0e] text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer border border-[#ff4e00]"
            title="Execute full 12-gate dual-agent verification pipeline"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'PIPELINE RUNNING...' : 'EXECUTE 12-GATES'}</span>
          </button>

          {/* Tamper/Invariant Test Button */}
          <button
            id="btn-attempt-fake-evidence"
            onClick={onAttemptFakeEvidence}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded bg-[#15171a] hover:bg-[#2d3139] hover:border-[#ff4e00] border border-[#2d3139] text-[#e0e0e0] text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
            title="Test the Two-Key Invariant: Attempts to submit SIMULATED evidence for a physical hardware gate and tests Governor rejection"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#ff4e00]" />
            <span className="uppercase text-[11px]">INVARIANT TEST</span>
          </button>

          {/* Emergency Rollback */}
          <button
            id="btn-emergency-rollback"
            onClick={onRollback}
            className="p-1.5 rounded bg-[#0a0b0e] hover:bg-[#ff4e00] hover:text-[#0a0b0e] text-[#8e9299] border border-[#2d3139] hover:border-[#ff4e00] transition-all cursor-pointer"
            title="Emergency Rollback & Hardware Freeze Drill"
          >
            <AlertOctagon className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            id="btn-reset-draft"
            onClick={onReset}
            className="p-1.5 rounded bg-[#0a0b0e] hover:bg-[#2d3139] text-[#8e9299] hover:text-[#e0e0e0] border border-[#2d3139] transition-all cursor-pointer"
            title="Reset to clean draft state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Toggle Dual-Agent Terminal */}
          <button
            id="btn-toggle-terminal"
            onClick={onToggleTerminal}
            className={`p-1.5 rounded border transition-all cursor-pointer ${
              isTerminalOpen 
                ? 'bg-[#ff4e00] text-[#0a0b0e] border-[#ff4e00] font-bold' 
                : 'bg-[#0a0b0e] text-[#8e9299] border-[#2d3139] hover:text-white'
            }`}
            title="Toggle Live Dual-Agent Dialogue Stream"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
