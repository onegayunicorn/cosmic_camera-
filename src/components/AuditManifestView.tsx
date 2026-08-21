import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Download, Copy, Check, Lock, AlertOctagon, RefreshCw, Key } from 'lucide-react';
import { ReleaseState, Incident } from '../types';
import { releaseGovernor } from '../services/releaseGovernor';

interface AuditManifestViewProps {
  releaseState: ReleaseState;
  incidents: Incident[];
  onRollback: () => void;
}

export const AuditManifestView: React.FC<AuditManifestViewProps> = ({
  releaseState,
  incidents,
  onRollback
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const manifestData = {
    version: releaseState.version,
    releaseStatus: releaseState.overallStatus,
    timestamp: releaseState.sealedTimestamp || new Date().toISOString(),
    merkleRoot: releaseState.merkleRoot,
    governorSignature: releaseState.governorSignature,
    twoKeyProtocol: {
      agent1_governor: 'RELEASE_GOVERNOR_AUTHORITY',
      agent2_engineer: 'VALIDATION_ENGINEER_EXECUTOR',
      provenanceInvariant: 'SIMULATED != MEASURED (ENFORCED)'
    },
    gates: releaseState.gates.map(g => ({
      id: g.id,
      title: g.title,
      stage: g.stage,
      category: g.category,
      status: g.status,
      provenance: g.provenance,
      evidenceHash: g.evidenceHash,
      measuredValues: g.actualValues
    })),
    incidentsResolved: incidents.map(i => ({
      id: i.id,
      gate: i.gate,
      severity: i.severity,
      failure: i.observedFailure,
      status: i.status,
      remediation: i.remediation
    }))
  };

  const manifestJsonString = JSON.stringify(manifestData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([manifestJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic_camera_v${releaseState.version}_release_manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 font-mono">
      
      {/* Top Banner */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#ff4e00]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                06. CRYPTOGRAPHIC RELEASE MANIFEST & AUDIT TRAIL
              </h2>
            </div>
            <p className="text-xs text-[#8e9299] max-w-3xl leading-relaxed">
              Tamper-evident release manifest sealed with Merkle tree proofs, dual-agent signatures, and immutable provenance records for Cosmic Camera v{releaseState.version}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-[#2d3139] hover:bg-[#404550] text-[#e0e0e0] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#404550] transition-all cursor-pointer uppercase"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED JSON' : 'COPY MANIFEST'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer uppercase"
            >
              <Download className="w-3.5 h-3.5 text-[#0a0b0e]" />
              <span>EXPORT JSON</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Badges */}
        <div className="mt-3 pt-3 border-t border-[#2d3139] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
            <div className="text-[#8e9299] text-[10px] flex items-center gap-1 uppercase font-bold">
              <Lock className="w-3 h-3 text-[#ff4e00]" />
              <span>12-GATE MERKLE ROOT HASH</span>
            </div>
            <div className="text-[#00ff41] font-bold break-all text-[11px]">
              {releaseState.merkleRoot}
            </div>
          </div>

          <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
            <div className="text-[#8e9299] text-[10px] flex items-center gap-1 uppercase font-bold">
              <Key className="w-3 h-3 text-[#ff4e00]" />
              <span>GOVERNOR SEAL SIGNATURE</span>
            </div>
            <div className="text-white font-bold break-all text-[11px]">
              {releaseState.governorSignature || 'PENDING_RELEASE_AUTHORIZATION'}
            </div>
          </div>
        </div>
      </div>

      {/* Manifest JSON Viewer */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
        <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
          <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
            <FileCheck className="w-4 h-4 text-[#ff4e00]" />
            SIGNED MANIFEST PAYLOAD
          </h3>
          <span className="text-xs font-mono text-[#8e9299]">
            {manifestJsonString.length} BYTES • UTF-8
          </span>
        </div>

        <pre className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] text-xs font-mono text-[#00ff41] overflow-x-auto max-h-96 leading-relaxed">
          <code>{manifestJsonString}</code>
        </pre>
      </div>

      {/* Emergency Freeze & Rollback Drill Zone */}
      <div className="bg-[#15171a] border-2 border-[#ff4e00] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[#ff4e00] font-mono text-xs font-bold uppercase">
            <AlertOctagon className="w-4 h-4 text-[#ff4e00]" />
            <span>EMERGENCY ROLLBACK & HARDWARE SAFETY DRILL</span>
          </div>
          <button
            onClick={onRollback}
            className="px-3.5 py-1.5 rounded bg-[#ff4e00] hover:bg-[#ff4e00]/90 text-[#0a0b0e] text-xs font-mono font-bold transition-all cursor-pointer uppercase"
          >
            TRIGGER EMERGENCY ROLLBACK DRILL
          </button>
        </div>

        <p className="text-xs text-[#8e9299] leading-relaxed">
          The Two-Agent system enforces safety boundaries: hardware control and raw media persistence are instantly frozen upon rollback, reverting state to the previous verified stable checkpoint.
        </p>
      </div>

    </div>
  );
};
