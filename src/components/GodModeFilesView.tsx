import React, { useState } from 'react';
import {
  ShieldAlert,
  Terminal,
  Folder,
  FileCode,
  Lock,
  Unlock,
  Key,
  Database,
  Cpu,
  Zap,
  Flame,
  CheckCircle,
  AlertTriangle,
  Download,
  Copy,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  FileText
} from 'lucide-react';
import { GodModeFileNode, GodModeOverrideState, Gate, ReleaseState } from '../types';

interface GodModeFilesViewProps {
  gates: Gate[];
  releaseState: ReleaseState;
  onForcePassAllGates: () => void;
  onResetGates: () => void;
}

export const GodModeFilesView: React.FC<GodModeFilesViewProps> = ({
  gates,
  releaseState,
  onForcePassAllGates,
  onResetGates
}) => {
  // Master God Mode State
  const [overrideState, setOverrideState] = useState<GodModeOverrideState>({
    godModeActive: true,
    masterAuthToken: '0x7F99_432A_MASTER_BYPASS_SEAL_V3_COSMIC_ROOT',
    emergencyLockdownBypassed: true,
    allGatesForcedPass: releaseState.overallStatus === 'PASS',
    memoryInjectionAddress: '0x0000F820',
    memoryBufferHex: '43 4F 53 4D 49 43 5F 47 4F 44 4D 4F 44 45 5F 34 33 32 48 5A 00 00 00 00 FF FF FF FF 7F 99 43 2A',
    quantumDecoherenceSuppressed: true,
    thermalThrottlingBypassed: true,
    rawJsonExportReady: true
  });

  // VFS File Tree Nodes
  const [vfsFiles, setVfsFiles] = useState<GodModeFileNode[]>([
    {
      id: 'f-1',
      path: '/sys/kernel/godmode/master_auth.key',
      name: 'master_auth.key',
      type: 'SYS_CONTROL',
      sizeBytes: 128,
      permissions: 'rwxr--r--',
      owner: 'root',
      uid: 0,
      lastModified: '2026-08-21 14:00:00',
      content: `[COSMIC_ROOT_SECURITY_KEY]
VERSION=3.0.0-GODMODE
AUTHORIZATION_LEVEL=UNRESTRICTED_KERNEL_RING_0
MASTER_HASH=0x7F99432AE81B6C4A9D3F1250A8C934E1
BYPASS_ALL_INVARIANTS=TRUE
COHERENCE_MIN_ENFORCEMENT=FALSE_OVERRIDDEN
PROVENANCE_FORCE_CLASS=MEASURED_SOVEREIGN`,
      isProtected: true,
      merkleProofHash: '0x9943...E81B'
    },
    {
      id: 'f-2',
      path: '/sys/devices/cosmic_imx571/dma_registers.bin',
      name: 'dma_registers.bin',
      type: 'DEVICE_NODE',
      sizeBytes: 512,
      permissions: 'rw-rw-r--',
      owner: 'root',
      uid: 0,
      lastModified: '2026-08-21 14:01:22',
      content: `0x0000: 00 48 00 00 00 01 00 00 FF FF 00 00 43 32 00 00 (ISP_DMA_CTRL)
0x0010: 7F 2A 9C 4E 3F 98 E8 1B 00 00 00 00 00 00 00 00 (INFINITY_PLL_LOCK)
0x0020: 00 00 01 B0 00 00 00 3C 00 00 00 00 00 00 00 00 (432HZ_CLOCK_DIVIDER)
0x0030: 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (FORCE_SENSOR_ACTIVE)`,
      isProtected: false,
      merkleProofHash: '0x4A12...C388'
    },
    {
      id: 'f-3',
      path: '/etc/merkle/sovereign_11_chain.proof',
      name: 'sovereign_11_chain.proof',
      type: 'FILE',
      sizeBytes: 2048,
      permissions: 'r--r--r--',
      owner: 'root',
      uid: 0,
      lastModified: '2026-08-21 14:02:00',
      content: `{
  "sovereign_version": "3.0.0",
  "global_merkle_root": "0x7F99A412C889E81B432A9943FF00A231",
  "coherence_system_score": 0.99999,
  "engines_verified": 11,
  "invariants": {
    "NIGREDO_TO_RUBEDO": "UNBROKEN",
    "ENTANGLEMENT_COEFF": 0.99998,
    "SINGULARITY_PROJECTION_PHI": 1.61803398875,
    "J09_PQC_DILITHIUM_SEAL": "VALID"
  }
}`,
      isProtected: true,
      merkleProofHash: '0x7F99...A231'
    },
    {
      id: 'f-4',
      path: '/proc/quantum_coherence/override',
      name: 'override',
      type: 'SYS_CONTROL',
      sizeBytes: 64,
      permissions: 'rw-rw-rw-',
      owner: 'root',
      uid: 0,
      lastModified: '2026-08-21 14:02:15',
      content: `TARGET_COHERENCE=0.99999\nFORCE_LOCK=1\nSUPPRESS_DECOHERENCE_NOISE=1\nTHERMAL_DISSIPATION_COEFF=0.00000`,
      isProtected: false,
      merkleProofHash: '0xEE33...8811'
    },
    {
      id: 'f-5',
      path: '/root/singularity_transcendence.json',
      name: 'singularity_transcendence.json',
      type: 'FILE',
      sizeBytes: 1024,
      permissions: 'rwx------',
      owner: 'root',
      uid: 0,
      lastModified: '2026-08-21 14:02:40',
      content: `{
  "transcendence_event": "TRIGGERED",
  "iterations_completed": 1000,
  "phi_growth_rate": 1.618033988749895,
  "reality_thread_dimension": 12,
  "matter_phase": "RUBEDO_PHILOSOPHERS_STONE",
  "transmutation_energy_joules": 4.32e12
}`,
      isProtected: false,
      merkleProofHash: '0x12FF...99EE'
    },
    {
      id: 'f-6',
      path: '/dev/rpi5_gpio_memory_map',
      name: 'rpi5_gpio_memory_map',
      type: 'MEMORY_MAP',
      sizeBytes: 4096,
      permissions: 'rw-rw----',
      owner: 'root',
      uid: 0,
      lastModified: '2026-08-21 14:02:44',
      content: `[RPi 5 BCM2712 GPIO REGISTER BASE: 0x107D508000]
PIN_01..PIN_40 MAPPED TO DIRECT MEMORY ACCESS
PWM0_DUTY=85%
I2C1_SPEED_KHZ=400
SPI0_DMA_RING=ACTIVE`,
      isProtected: false,
      merkleProofHash: '0x88BC...2712'
    }
  ]);

  const [selectedFileId, setSelectedFileId] = useState<string>('f-1');
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [hexAddressInput, setHexAddressInput] = useState('0x0000F820');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const selectedFile = vfsFiles.find(f => f.id === selectedFileId) || vfsFiles[0];

  const handleSelectFile = (file: GodModeFileNode) => {
    setSelectedFileId(file.id);
    setIsEditingFile(false);
  };

  const handleStartEdit = () => {
    setEditedContent(selectedFile.content);
    setIsEditingFile(true);
  };

  const handleSaveFile = () => {
    setVfsFiles(prev =>
      prev.map(f => (f.id === selectedFile.id ? { ...f, content: editedContent, lastModified: new Date().toISOString() } : f))
    );
    setIsEditingFile(false);
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  const handleDownloadGodModeDump = () => {
    const dump = {
      timestamp: new Date().toISOString(),
      godModeState: overrideState,
      virtualFileSystem: vfsFiles,
      gatesMatrix: gates,
      releaseState
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sovereign_godmode_master_dump.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* God Mode Banner & Privilege Bar */}
      <div className="bg-[#18111b] border border-[#ff4e00]/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-[#ff4e00]/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#ff4e00]/20 border border-[#ff4e00] rounded-lg text-[#ff4e00] shadow-md shadow-[#ff4e00]/30 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wider">SOVEREIGN GOD MODE FILE SYSTEM & MASTER OVERRIDE</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff4e00] text-black">
                RING 0 KERNEL PRIVILEGE
              </span>
            </div>
            <p className="text-[11px] text-[#8e9299] mt-0.5">
              Direct root filesystem access (`/sys`, `/proc`, `/dev`, `/etc`), arbitrary memory byte injection & instantaneous invariant overrides
            </p>
          </div>
        </div>

        {/* Global Master Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onForcePassAllGates}
            className="px-3.5 py-2 bg-[#46d369] hover:bg-[#3bb859] text-black rounded font-bold transition-all shadow-md shadow-[#46d369]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>FORCE-PASS ALL 12 GATES</span>
          </button>

          <button
            onClick={onResetGates}
            className="px-3.5 py-2 bg-[#23272e] hover:bg-[#2e343e] text-white border border-[#3b4252] rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET INVARIANTS</span>
          </button>

          <button
            onClick={handleDownloadGodModeDump}
            className="px-3.5 py-2 bg-[#1b202a] hover:bg-[#282f3c] text-[#00e5ff] border border-[#00e5ff]/40 rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT MASTER JSON</span>
          </button>
        </div>
      </div>

      {/* Override Switches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8e9299] block">EMERGENCY LOCKDOWN</span>
            <span className="text-xs font-bold text-[#46d369]">BYPASSED (UNLOCKED)</span>
          </div>
          <button
            onClick={() => setOverrideState(s => ({ ...s, emergencyLockdownBypassed: !s.emergencyLockdownBypassed }))}
            className={`p-2 rounded cursor-pointer border ${
              overrideState.emergencyLockdownBypassed
                ? 'bg-[#46d369]/20 text-[#46d369] border-[#46d369]/40'
                : 'bg-[#ff4e00]/20 text-[#ff4e00] border-[#ff4e00]/40'
            }`}
          >
            {overrideState.emergencyLockdownBypassed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8e9299] block">DECOHERENCE SUPPRESSOR</span>
            <span className="text-xs font-bold text-[#00e5ff]">FORCED 0.99999 LOCK</span>
          </div>
          <button
            onClick={() => setOverrideState(s => ({ ...s, quantumDecoherenceSuppressed: !s.quantumDecoherenceSuppressed }))}
            className="p-2 bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 rounded cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8e9299] block">THERMAL THROTTLING</span>
            <span className="text-xs font-bold text-[#ffb300]">UNCONSTRAINED BURST</span>
          </div>
          <button
            onClick={() => setOverrideState(s => ({ ...s, thermalThrottlingBypassed: !s.thermalThrottlingBypassed }))}
            className="p-2 bg-[#ffb300]/20 text-[#ffb300] border border-[#ffb300]/40 rounded cursor-pointer"
          >
            <Flame className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8e9299] block">KERNEL RING LEVEL</span>
            <span className="text-xs font-bold text-[#ff4e00]">RING 0 / UID 0 (ROOT)</span>
          </div>
          <span className="px-2 py-1 bg-[#ff4e00]/20 text-[#ff4e00] rounded text-[10px] font-bold border border-[#ff4e00]/40">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Main 2-Column: VFS Browser + File Inspector/Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Virtual File System Tree */}
        <div className="lg:col-span-4 bg-[#12151b] border border-[#262b36] rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-[#232834] pb-2">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#ffb300]" />
              <span className="font-bold text-white uppercase">ROOT VFS DIRECTORY (`/`)</span>
            </div>
            <span className="text-[10px] text-[#8e9299]">{vfsFiles.length} Nodes</span>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {vfsFiles.map(file => {
              const isSelected = file.id === selectedFileId;
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#ff4e00]/15 border-[#ff4e00] text-white shadow-sm'
                      : 'bg-[#181c24] border-[#262b36] text-[#c0c6d0] hover:border-[#3b4252] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#ff4e00]' : 'text-[#8e9299]'}`} />
                    <div className="truncate">
                      <span className="font-bold text-xs truncate block">{file.name}</span>
                      <span className="text-[9px] text-[#8e9299] truncate block">{file.path}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#8e9299] shrink-0 font-mono">{file.permissions}</span>
                </div>
              );
            })}
          </div>

          {/* Arbitrary Hex Memory Injector */}
          <div className="bg-[#0a0c10] border border-[#232834] p-3 rounded-lg space-y-2 mt-auto">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#00e5ff] font-bold">MEMORY BYTE INJECTOR:</span>
              <span className="text-[#8e9299]">DMA RAM</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hexAddressInput}
                onChange={e => setHexAddressInput(e.target.value)}
                className="w-28 bg-[#161a22] text-white px-2 py-1 rounded text-[10px] border border-[#3b4252]"
                placeholder="0x0000..."
              />
              <button
                onClick={() => alert(`Injected 32-byte payload into physical memory offset ${hexAddressInput}`)}
                className="px-2.5 py-1 bg-[#ff4e00] text-black font-bold rounded text-[10px] hover:bg-[#e04500] cursor-pointer"
              >
                INJECT BYTES
              </button>
            </div>
            <div className="text-[9px] font-mono text-[#8e9299] break-all bg-[#12151b] p-1.5 rounded border border-[#1b2029]">
              {overrideState.memoryBufferHex}
            </div>
          </div>
        </div>

        {/* Right Column: File Content Inspector & Code Editor */}
        <div className="lg:col-span-8 bg-[#12151b] border border-[#262b36] rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232834] pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00e5ff]" />
              <span className="font-bold text-white text-xs">{selectedFile.path}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyContent(selectedFile.content)}
                className="px-2 py-1 bg-[#1a1f29] hover:bg-[#252c3a] text-[#8e9299] hover:text-white rounded text-[10px] font-bold border border-[#3b4252] flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copyFeedback ? 'COPIED!' : 'COPY'}</span>
              </button>

              {isEditingFile ? (
                <button
                  onClick={handleSaveFile}
                  className="px-3 py-1 bg-[#46d369] text-black rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>SAVE TO VFS</span>
                </button>
              ) : (
                <button
                  onClick={handleStartEdit}
                  className="px-3 py-1 bg-[#00e5ff] text-black rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>EDIT FILE</span>
                </button>
              )}
            </div>
          </div>

          {/* File Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0a0c10] border border-[#232834] p-2 rounded text-[10px] text-[#8e9299]">
            <div>OWNER: <span className="text-white font-bold">{selectedFile.owner} (UID: {selectedFile.uid})</span></div>
            <div>PERMISSIONS: <span className="text-white font-bold">{selectedFile.permissions}</span></div>
            <div>SIZE: <span className="text-white font-bold">{selectedFile.sizeBytes} B</span></div>
            <div>MERKLE PROOF: <span className="text-[#00e5ff] font-bold">{selectedFile.merkleProofHash}</span></div>
          </div>

          {/* Textarea / Content Display */}
          <div className="flex-1 min-h-[300px] flex flex-col">
            {isEditingFile ? (
              <textarea
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
                className="w-full flex-1 min-h-[300px] bg-[#0a0c10] text-[#46d369] font-mono text-[11px] p-3 rounded-lg border border-[#00e5ff]/50 focus:outline-none resize-y"
              />
            ) : (
              <pre className="w-full flex-1 min-h-[300px] bg-[#0a0c10] text-[#c0c6d0] font-mono text-[11px] p-3 rounded-lg border border-[#232834] overflow-x-auto whitespace-pre-wrap">
                {selectedFile.content}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
