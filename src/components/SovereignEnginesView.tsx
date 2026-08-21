import React, { useState, useEffect } from 'react';
import { Globe2, ShieldCheck, Play, Sparkles, Zap, Lock, RefreshCw, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { sovereignOrchestrator } from '../services/sovereignEngines';
import { SovereignEngineState, EngineId } from '../types';

export const SovereignEnginesView: React.FC = () => {
  const [engines, setEngines] = useState<SovereignEngineState[]>([]);
  const [globalMerkle, setGlobalMerkle] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<SovereignEngineState | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      setEngines(sovereignOrchestrator.getEngines());
      setGlobalMerkle(sovereignOrchestrator.getGlobalMerkle());
    };
    update();
    const unsub = sovereignOrchestrator.subscribe(update);
    return unsub;
  }, []);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    await sovereignOrchestrator.runFullSystemAudit();
    setIsAuditing(false);
  };

  const handleAlchemicalTransmute = (phase: 'NIGREDO' | 'ALBEDO' | 'CITRINITAS' | 'RUBEDO') => {
    sovereignOrchestrator.transmuteAlchemical(phase);
  };

  const handleAddVertex = () => {
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    const z = (Math.random() - 0.5) * 5;
    const w = (Math.random() - 0.5) * 5;
    const v = (Math.random() - 0.5) * 5;
    sovereignOrchestrator.add5DVertex(x, y, z, w, v);
  };

  const handleRotateBloch = () => {
    sovereignOrchestrator.rotateBlochState(0.3, 0.4);
  };

  const handleRunSingularity = () => {
    sovereignOrchestrator.runSingularitySimulation(50);
  };

  const handleWeaveReality = () => {
    sovereignOrchestrator.weaveRealityThreads();
  };

  const handlePhoenixCycle = () => {
    sovereignOrchestrator.runPhoenixCycle();
  };

  const handlePhotonicPulse = () => {
    sovereignOrchestrator.emitPhotonicPulse(1.0, 0.999);
  };

  const handleCreateBell = () => {
    sovereignOrchestrator.createQuantumBellPair();
  };

  const handleEntangle = () => {
    sovereignOrchestrator.synchronizeEntanglement();
  };

  const handleAgentMAS = () => {
    sovereignOrchestrator.orchestrateAgentProtocol();
  };

  const handleGeneweaver = () => {
    sovereignOrchestrator.weaveGeneSequence('SOV_DNA_' + Math.floor(Math.random() * 1000), 'AGCTAGCTAGCTCGATCG');
  };

  return (
    <div className="space-y-5 font-mono">
      
      {/* Top Banner & Global Merkle Root */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#ff4e00]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                04. SOVEREIGN ORCHESTRATOR ENGINE (SOA) — 11-ENGINE TOPOLOGY
              </h2>
            </div>
            <p className="text-xs text-[#8e9299] max-w-3xl leading-relaxed">
              Unbroken Merkle-chained state across 11 specialized engines with hermetic and quantum phase order. Coherence threshold enforced at ≥0.99997.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-3.5 py-1.5 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
            >
              <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'AUDITING 11 ENGINES...' : 'ORC-001 FULL SYSTEM AUDIT'}</span>
            </button>
          </div>
        </div>

        {/* Global Merkle Badge */}
        <div className="mt-3 pt-3 border-t border-[#2d3139] flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ff4e00]" />
            <span className="text-[#8e9299]">GLOBAL MERKLE ROOT:</span>
            <span className="text-[#00ff41] font-bold break-all bg-[#0a0b0e] px-2 py-0.5 rounded border border-[#2d3139]">
              {globalMerkle}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00ff41] font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>COHERENCE: ≥ 0.99997 (LOCKED)</span>
          </div>
        </div>
      </div>

      {/* 11 Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {engines.map(engine => (
          <div
            key={engine.id}
            className="bg-[#15171a] rounded-lg p-3.5 border border-[#2d3139] hover:border-[#404550] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2d3139] text-[#e0e0e0] font-bold border border-[#404550]">
                  {engine.version}
                </span>
                <span className="text-xs font-mono font-bold text-[#00ff41] bg-[#0a0b0e] px-2 py-0.5 rounded border border-[#2d3139] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00ff41]" /> {engine.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white font-mono uppercase">{engine.name}</h3>
                <div className="text-[11px] font-mono text-[#8e9299] mt-1 flex justify-between">
                  <span>COHERENCE:</span>
                  <span className="text-[#00ff41] font-bold">{engine.coherence.toFixed(5)}</span>
                </div>
              </div>

              {/* Merkle Root preview */}
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139] text-[10px] font-mono space-y-1">
                <div className="text-[#8e9299] flex justify-between">
                  <span>MERKLE ROOT:</span>
                  <span className="text-[#ff4e00] truncate max-w-[150px] font-bold">{engine.merkleRoot}</span>
                </div>
              </div>

              {/* Dynamic Engine Specific Metrics */}
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139] text-[11px] font-mono text-[#e0e0e0] space-y-0.5">
                {Object.entries(engine.metrics).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#8e9299] uppercase text-[10px]">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-white font-bold truncate max-w-[140px]">
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per Engine Interactive Action Trigger */}
            <div className="mt-3 pt-2.5 border-t border-[#2d3139] flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedEngine(engine)}
                className="text-xs text-[#ff4e00] hover:text-[#ff4e00]/80 font-mono font-bold flex items-center gap-1 cursor-pointer uppercase"
              >
                INSPECT <ChevronRight className="w-3 h-3" />
              </button>

              {/* Action Button mapped to engine */}
              {engine.id === 'ALCHEMICAL' && (
                <button
                  onClick={() => handleAlchemicalTransmute('RUBEDO')}
                  className="px-2.5 py-1 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  TRANSMUTE RUBEDO
                </button>
              )}
              {engine.id === 'GEOMETRY_5D' && (
                <button
                  onClick={handleAddVertex}
                  className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-white text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  ADD 5D VERTEX
                </button>
              )}
              {engine.id === 'BLOCH_SPHERE' && (
                <button
                  onClick={handleRotateBloch}
                  className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-white text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  ROTATE QUBIT
                </button>
              )}
              {engine.id === 'SINGULARITY' && (
                <button
                  onClick={handleRunSingularity}
                  className="px-2.5 py-1 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  RUN φ ITERS
                </button>
              )}
              {engine.id === 'REALITY_V2' && (
                <button
                  onClick={handleWeaveReality}
                  className="px-2.5 py-1 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  WEAVE THREAD
                </button>
              )}
              {engine.id === 'PHOENIX' && (
                <button
                  onClick={handlePhoenixCycle}
                  className="px-2.5 py-1 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  REBIRTH CYCLE
                </button>
              )}
              {engine.id === 'PHOTONIC' && (
                <button
                  onClick={handlePhotonicPulse}
                  className="px-2.5 py-1 rounded bg-[#00ff41] hover:bg-[#00ff41]/90 text-[#0a0b0e] text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  PULSE (12-CH)
                </button>
              )}
              {engine.id === 'QUANTUM_SIM' && (
                <button
                  onClick={handleCreateBell}
                  className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-white text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  CREATE BELL
                </button>
              )}
              {engine.id === 'ENTANGLEMENT' && (
                <button
                  onClick={handleEntangle}
                  className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-white text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  SYNC 1000HZ
                </button>
              )}
              {engine.id === 'AGENT_CORE' && (
                <button
                  onClick={handleAgentMAS}
                  className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-white text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  MAS PROTOCOL
                </button>
              )}
              {engine.id === 'GENEWEAVER' && (
                <button
                  onClick={handleGeneweaver}
                  className="px-2.5 py-1 rounded bg-[#00ff41] hover:bg-[#00ff41]/90 text-[#0a0b0e] text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  WEAVE DNA
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Selected Engine History & State Drawer */}
      {selectedEngine && (
        <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ff4e00]" />
              <h3 className="text-xs font-bold text-white font-mono uppercase">
                {selectedEngine.name} ({selectedEngine.version}) — STATE & MERKLE TRAIL
              </h3>
            </div>
            <button
              onClick={() => setSelectedEngine(null)}
              className="text-xs text-[#8e9299] hover:text-white font-mono cursor-pointer uppercase font-bold"
            >
              [CLOSE DRAWER]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Live Metrics */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-[#8e9299] uppercase">Active Metrics</div>
              <pre className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] text-xs font-mono text-[#00ff41] overflow-x-auto">
                {JSON.stringify(selectedEngine.metrics, null, 2)}
              </pre>
            </div>

            {/* Merkle History */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-[#8e9299] uppercase">Merkle Transition Log</div>
              <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2 text-xs font-mono max-h-48 overflow-y-auto">
                {selectedEngine.history.map((h, i) => (
                  <div key={i} className="border-b border-[#2d3139] pb-1.5 last:border-0 last:pb-0 space-y-0.5">
                    <div className="flex justify-between text-[#ff4e00] font-bold uppercase">
                      <span>{h.action}</span>
                      <span className="text-[#8e9299] text-[10px]">{new Date(h.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[#e0e0e0] text-[11px]">{h.resultSummary}</p>
                    <div className="text-[10px] text-[#8e9299] truncate">Hash: {h.hash}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
