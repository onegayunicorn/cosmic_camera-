import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon, CheckCircle2, Clock, FileCode, Check, X, ShieldX, Play, Lock, Eye, AlertTriangle } from 'lucide-react';
import { Gate, GateStatus, Incident } from '../types';
import { validationEngineer } from '../services/validationEngineer';
import { releaseGovernor } from '../services/releaseGovernor';

interface ReleaseGovernorViewProps {
  gates: Gate[];
  incidents: Incident[];
  onAuthorizeRelease: () => void;
  onRollback: () => void;
  isAuthorized: boolean;
}

export const ReleaseGovernorView: React.FC<ReleaseGovernorViewProps> = ({
  gates,
  incidents,
  onAuthorizeRelease,
  onRollback,
  isAuthorized
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'SOFTWARE' | 'HARDWARE' | 'LIVE'>('ALL');
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [runningGateId, setRunningGateId] = useState<string | null>(null);
  const [remediationText, setRemediationText] = useState<string>('');

  const filteredGates = gates.filter(g => {
    if (filterCategory === 'ALL') return true;
    return g.category === filterCategory;
  });

  const handleRunGate = async (gate: Gate) => {
    setRunningGateId(gate.id);
    await validationEngineer.runGateValidation(gate.stage);
    setRunningGateId(null);
  };

  const handleTestFakeEvidence = async (gate: Gate) => {
    setRunningGateId(gate.id);
    // Force SIMULATED provenance on a hardware gate to demonstrate Governor rejection!
    await validationEngineer.runGateValidation(gate.stage, 'SIMULATED');
    setRunningGateId(null);
  };

  const handleTestTamper = async (gate: Gate) => {
    setRunningGateId(gate.id);
    // Force cryptographic hash tamper
    await validationEngineer.runGateValidation(gate.stage, undefined, true);
    setRunningGateId(null);
  };

  const handleResolveIncident = async (incidentId: string, gateId?: string) => {
    const remediation = remediationText.trim() || 'Verified physical testbench telemetry & signed SHA-256 provenance signature; retested successfully.';
    releaseGovernor.resolveIncident(incidentId, remediation);
    setRemediationText('');
    if (gateId) {
      const gate = gates.find(g => g.id === gateId);
      if (gate) {
        setRunningGateId(gate.id);
        await validationEngineer.runGateValidation(gate.stage);
        setRunningGateId(null);
      }
    }
  };

  const getStatusBadge = (status: GateStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#00ff41]" /> [PASS]
          </span>
        );
      case 'BLOCK':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0a0b0e] text-[#ff4e00] border-2 border-[#ff4e00] flex items-center gap-1 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-[#ff4e00]" /> [BLOCK]
          </span>
        );
      case 'HOLD':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0a0b0e] text-[#8e9299] border border-[#2d3139] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#8e9299]" /> [HOLD]
          </span>
        );
      case 'ROLLBACK_REQUIRED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0a0b0e] text-[#ff4e00] border-2 border-[#ff4e00] flex items-center gap-1 animate-pulse">
            <AlertOctagon className="w-3 h-3 text-[#ff4e00]" /> [ROLLBACK]
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#8e9299] bg-[#0a0b0e] border border-[#2d3139]">
            [UNVERIFIED]
          </span>
        );
    }
  };

  const getProvenanceBadge = (prov: string) => {
    if (prov === 'MEASURED') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139]">[MEASURED]</span>;
    }
    if (prov === 'SIMULATED') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0a0b0e] text-[#ff4e00] border border-[#ff4e00]">[SIMULATED]</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2d3139] text-[#e0e0e0] border border-[#404550]">[{prov}]</span>;
  };

  return (
    <div className="space-y-5 font-mono">
      
      {/* Top Banner: Two-Key Principle & Invariant Explanation */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff4e00]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                01. DUAL-AGENT RELEASE GOVERNOR & HARDWARE GATES
              </h2>
            </div>
            <p className="text-xs text-[#8e9299] max-w-3xl leading-relaxed">
              <strong className="text-white">AGENT 1 (GOVERNOR)</strong> controls release seal & provenance authority. 
              <strong className="text-[#e0e0e0]"> AGENT 2 (ENGINEER)</strong> runs hardware interrogation & signs telemetry.
              <span className="text-[#ff4e00] font-bold"> HARD INVARIANT: <code>SIMULATED != MEASURED</code>. Software tests cannot unlock physical sensor release.</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAuthorizeRelease}
              className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-tight flex items-center gap-2 border transition-all cursor-pointer ${
                isAuthorized
                  ? 'bg-[#00ff41] text-[#0a0b0e] border-[#00ff41] shadow-lg shadow-[#00ff41]/20 font-black'
                  : 'bg-[#ff4e00] text-[#0a0b0e] border-[#ff4e00] hover:bg-[#e04500]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAuthorized ? 'RELEASE SEALED & SIGNED' : 'AUTHORIZE RELEASE (AGENT 1)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incidents Warning Alert if any open */}
      {incidents.filter(i => i.status === 'OPEN').length > 0 && (
        <div className="bg-[#15171a] border-2 border-[#ff4e00] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#ff4e00] text-xs font-bold font-mono uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-[#ff4e00]" />
              <span>ACTIVE INCIDENTS ({incidents.filter(i => i.status === 'OPEN').length}) — ADVANCEMENT HALTED</span>
            </div>
          </div>

          <div className="space-y-2">
            {incidents.filter(i => i.status === 'OPEN').map(inc => (
              <div key={inc.id} className="bg-[#0a0b0e] p-3 rounded border border-[#ff4e00]/60 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#ff4e00] font-bold">[{inc.id}] {inc.severity} SEVERITY ON {inc.gate}</span>
                  <span className="text-[#8e9299] text-[10px]">{new Date(inc.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[#e0e0e0] text-[11px]">{inc.observedFailure}</p>
                <div className="text-[10px] text-[#ff4e00]">EXPECTED: {inc.expectedBehavior}</div>
                
                {/* Quick Remediation Form */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter remediation action summary..."
                    value={remediationText}
                    onChange={(e) => setRemediationText(e.target.value)}
                    className="flex-1 bg-[#15171a] border border-[#2d3139] rounded px-2.5 py-1 text-xs text-[#e0e0e0] placeholder:text-[#5c6370] focus:outline-none focus:border-[#ff4e00]"
                  />
                  <button
                    onClick={() => handleResolveIncident(inc.id, inc.gate)}
                    className="px-3 py-1 rounded bg-[#ff4e00] hover:bg-[#e04500] text-[#0a0b0e] text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
                  >
                    Resolve & Retest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-[#15171a] p-1 rounded border border-[#2d3139]">
          {(['ALL', 'SOFTWARE', 'HARDWARE', 'LIVE'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0a0b0e] text-[#ff4e00] border border-[#ff4e00]'
                  : 'text-[#8e9299] hover:text-white'
              }`}
            >
              {cat} ({cat === 'ALL' ? gates.length : gates.filter(g => g.category === cat).length})
            </button>
          ))}
        </div>

        <div className="text-xs text-[#8e9299] font-mono uppercase">
          SHOWING {filteredGates.length} OF 12 VERIFICATION GATES
        </div>
      </div>

      {/* 12 Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredGates.map(gate => {
          const isRunning = runningGateId === gate.id;

          return (
            <div
              key={gate.id}
              className={`bg-[#15171a] rounded-lg p-3.5 border transition-all flex flex-col justify-between ${
                gate.status === 'PASS'
                  ? 'border-[#2d3139] hover:border-[#00ff41]/50 shadow-sm'
                  : gate.status === 'BLOCK'
                  ? 'border-2 border-[#ff4e00] bg-[#15171a]'
                  : 'border-[#2d3139]'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 border-b border-[#2d3139] pb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2d3139] text-[#e0e0e0] border border-[#404550] font-bold">
                    {gate.category}
                  </span>
                  {getStatusBadge(gate.status)}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white font-mono leading-snug uppercase">
                    {gate.title}
                  </h3>
                  <p className="text-[11px] text-[#8e9299] mt-1 line-clamp-2">
                    {gate.description}
                  </p>
                </div>

                {/* Provenance & Device info */}
                <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8e9299]">PROVENANCE:</span>
                    {getProvenanceBadge(gate.provenance)}
                  </div>
                  {gate.deviceId && (
                    <span className="text-[#8e9299] text-[10px] truncate max-w-[130px]">
                      {gate.deviceId}
                    </span>
                  )}
                </div>

                {/* Measurements / Actual Values Preview */}
                {gate.actualValues && (
                  <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139] text-[10px] font-mono text-[#e0e0e0] space-y-0.5 max-h-20 overflow-y-auto">
                    {Object.entries(gate.actualValues).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-[#8e9299] truncate mr-2">{k}:</span>
                        <span className="text-[#ff4e00] truncate font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3 pt-2.5 border-t border-[#2d3139] flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedGate(gate)}
                  className="text-xs text-[#8e9299] hover:text-[#ff4e00] flex items-center gap-1 font-mono cursor-pointer uppercase"
                >
                  <Eye className="w-3.5 h-3.5" /> [INSPECT]
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Standard Test Run (Agent 2 -> Agent 1) */}
                  <button
                    onClick={() => handleRunGate(gate)}
                    disabled={isRunning}
                    className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#ff4e00] hover:text-[#0a0b0e] border border-[#404550] text-[#e0e0e0] text-xs font-mono font-bold uppercase flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                    title="Validation Engineer runs standard gate test"
                  >
                    <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>RUN</span>
                  </button>

                  {/* Tamper / Fake Test buttons for hardware gates */}
                  {gate.category === 'HARDWARE' && (
                    <button
                      onClick={() => handleTestFakeEvidence(gate)}
                      disabled={isRunning}
                      className="px-2 py-1 rounded bg-[#0a0b0e] hover:bg-[#ff4e00] hover:text-[#0a0b0e] text-[#ff4e00] border border-[#ff4e00] text-[10px] font-mono font-bold uppercase transition-all disabled:opacity-50 cursor-pointer"
                      title="Test Invariant: Submit fake SIMULATED data to trigger Governor rejection"
                    >
                      FAKE TEST
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detailed Evidence Modal / Drawer */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#15171a] border-2 border-[#2d3139] rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4 font-mono">
            
            <div className="flex items-start justify-between gap-3 border-b border-[#2d3139] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#2d3139] text-[#ff4e00] font-mono font-bold">
                    {selectedGate.stage}
                  </span>
                  {getStatusBadge(selectedGate.status)}
                </div>
                <h3 className="text-sm font-bold text-white font-mono uppercase mt-1">
                  {selectedGate.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedGate(null)}
                className="p-1 rounded bg-[#2d3139] text-[#8e9299] hover:text-white border border-[#404550]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8e9299] leading-relaxed">
              {selectedGate.description}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0a0b0e] p-3 rounded border border-[#2d3139] text-xs font-mono">
              <div>
                <div className="text-[#8e9299] text-[10px]">PROVENANCE</div>
                <div className="font-bold text-[#ff4e00]">{selectedGate.provenance}</div>
              </div>
              <div>
                <div className="text-[#8e9299] text-[10px]">OWNER</div>
                <div className="text-white font-bold">{selectedGate.owner}</div>
              </div>
              <div>
                <div className="text-[#8e9299] text-[10px]">COMMIT</div>
                <div className="text-[#8e9299]">{selectedGate.commitSha}</div>
              </div>
              <div>
                <div className="text-[#8e9299] text-[10px]">BUILD ID</div>
                <div className="text-[#8e9299]">{selectedGate.buildId}</div>
              </div>
            </div>

            {/* Cryptographic Evidence Hash */}
            {selectedGate.evidenceHash && (
              <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] text-xs font-mono space-y-1">
                <div className="text-[#8e9299] text-[10px] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#ff4e00]" />
                  <span>CRYPTOGRAPHIC EVIDENCE SIGNATURE (SHA-256)</span>
                </div>
                <div className="text-[#00ff41] break-all text-[11px] font-bold">
                  {selectedGate.evidenceHash}
                </div>
              </div>
            )}

            {/* Actual Measurements */}
            {selectedGate.actualValues && (
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-white uppercase">
                  TELEMETRY & MEASURED READOUTS:
                </div>
                <pre className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] text-[11px] font-mono text-[#ff4e00] overflow-x-auto">
                  {JSON.stringify(selectedGate.actualValues, null, 2)}
                </pre>
              </div>
            )}

            {/* Gate Audit Log History */}
            {selectedGate.logs && selectedGate.logs.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-white uppercase">
                  GATE AUDIT EVENTS:
                </div>
                <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1 text-[11px] font-mono text-[#8e9299]">
                  {selectedGate.logs.map((log, idx) => (
                    <div key={idx} className="border-b border-[#15171a] pb-1 last:border-0 last:pb-0">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#2d3139] flex items-center justify-between gap-3">
              <button
                onClick={() => handleTestTamper(selectedGate)}
                className="px-3 py-1.5 rounded bg-[#0a0b0e] hover:bg-[#ff4e00] hover:text-[#0a0b0e] text-[#ff4e00] border border-[#ff4e00] text-xs font-mono font-bold uppercase cursor-pointer"
              >
                INJECT CORRUPTED HASH (TAMPER TEST)
              </button>

              <button
                onClick={() => handleRunGate(selectedGate)}
                className="px-4 py-1.5 rounded bg-[#ff4e00] hover:bg-[#e04500] text-[#0a0b0e] text-xs font-mono font-black uppercase cursor-pointer"
              >
                RUN VALIDATION NOW
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
