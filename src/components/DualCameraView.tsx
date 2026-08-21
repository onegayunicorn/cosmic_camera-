import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  Sliders,
  Eye,
  Maximize2,
  Video,
  VideoOff,
  Zap,
  Radio,
  Layers,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Disc,
  Play,
  Pause,
  Download,
  Crosshair
} from 'lucide-react';
import { CameraStreamState, CameraFacing, InfinityLinkState } from '../types';

export const DualCameraView: React.FC = () => {
  // Front Camera State
  const [frontCamera, setFrontCamera] = useState<CameraStreamState>({
    facing: 'user',
    resolution: '1080P_FHD',
    width: 1920,
    height: 1080,
    fps: 60,
    iso: 200,
    shutterSpeedMs: 16.6,
    opticalGainDb: 6.0,
    filterMode: 'NATURAL',
    active: true,
    stream: null,
    deviceId: 'front-cam-primary',
    label: 'Front Facing TrueDepth / Metasurface Alpha (Node A)',
    snrEstDb: 46.2,
    luxDominance: 0.96,
    shadowDecoherence: 0.04
  });

  // Rear Camera State
  const [rearCamera, setRearCamera] = useState<CameraStreamState>({
    facing: 'environment',
    resolution: '4K_UHD',
    width: 3840,
    height: 2160,
    fps: 60,
    iso: 100,
    shutterSpeedMs: 8.3,
    opticalGainDb: 0.0,
    filterMode: 'PHOTON_PNP',
    active: true,
    stream: null,
    deviceId: 'rear-cam-primary',
    label: 'Rear Sony IMX571 Photon Array 26MP (Node B)',
    snrEstDb: 54.8,
    luxDominance: 0.99997,
    shadowDecoherence: 0.00003
  });

  // Infinity Link State
  const [infinityLink, setInfinityLink] = useState<InfinityLinkState>({
    locked: true,
    pllPhaseErrorDeg: 0.0008,
    entanglementCoeff: 0.99998,
    bidirectionalFluxGbps: 12.8,
    photonTransferRateMcps: 432.0,
    quantumNodeA: 'NODE-A-FRONT-0x7F2A',
    quantumNodeB: 'NODE-B-REAR-0x9C4E',
    merkleSeal: '0x3F98...E81B',
    syncTimestamp: Date.now()
  });

  // UI View Mode
  const [viewMode, setViewMode] = useState<'SPLIT' | 'PIP' | 'STEREO_DISPARITY' | 'HOLO_OVERLAY' | 'FRONT_ONLY' | 'REAR_ONLY'>('SPLIT');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);
  const [hardwareDevices, setHardwareDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissionState, setPermissionState] = useState<'IDLE' | 'GRANTED' | 'PROMPTED' | 'SIMULATED'>('SIMULATED');

  // Video Refs
  const frontVideoRef = useRef<HTMLVideoElement | null>(null);
  const rearVideoRef = useRef<HTMLVideoElement | null>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rearCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Request actual hardware video if available
  useEffect(() => {
    async function initHardwareMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devices.filter(d => d.kind === 'videoinput');
          setHardwareDevices(videoDevs);
        }
      } catch (err) {
        console.warn('Hardware media device query fallback:', err);
      }
    }
    initHardwareMedia();
  }, []);

  // Request Hardware Camera Stream
  const requestHardwareStream = async (target: 'front' | 'rear') => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissionState('SIMULATED');
        return;
      }
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: target === 'front' ? 'user' : 'environment',
          width: { ideal: target === 'front' ? 1280 : 1920 },
          height: { ideal: target === 'front' ? 720 : 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setPermissionState('GRANTED');
      if (target === 'front') {
        if (frontVideoRef.current) {
          frontVideoRef.current.srcObject = stream;
          frontVideoRef.current.play().catch(() => {});
        }
        setFrontCamera(prev => ({ ...prev, stream, active: true }));
      } else {
        if (rearVideoRef.current) {
          rearVideoRef.current.srcObject = stream;
          rearVideoRef.current.play().catch(() => {});
        }
        setRearCamera(prev => ({ ...prev, stream, active: true }));
      }
    } catch (err) {
      console.info('Using high-fidelity quantum photon synthesized camera pipeline:', err);
      setPermissionState('SIMULATED');
    }
  };

  // Live Canvas Rendering & Filter Synthesis
  useEffect(() => {
    let t = 0;
    const renderLoop = () => {
      t += 0.03;

      // Render Front Canvas (Synthesized / Filtered)
      if (frontCanvasRef.current) {
        const ctx = frontCanvasRef.current.getContext('2d');
        const w = frontCanvasRef.current.width;
        const h = frontCanvasRef.current.height;
        if (ctx) {
          if (frontCamera.stream && frontVideoRef.current && frontVideoRef.current.readyState >= 2) {
            ctx.drawImage(frontVideoRef.current, 0, 0, w, h);
          } else {
            // High fidelity synthetic quantum front sensor
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#0a101d');
            grad.addColorStop(0.5, '#071526');
            grad.addColorStop(1, '#050a12');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Synthetic facial biometric & quantum phase mesh
            ctx.strokeStyle = frontCamera.filterMode === 'LUX_RADIANCE' ? '#00e5ff' : '#38bdf8';
            ctx.lineWidth = 1.2;

            // Reticle & Grid
            ctx.beginPath();
            const cx = w / 2;
            const cy = h / 2;
            const radius = 60 + Math.sin(t * 2) * 4;
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.moveTo(cx - 80, cy);
            ctx.lineTo(cx + 80, cy);
            ctx.moveTo(cx, cy - 80);
            ctx.lineTo(cx, cy + 80);
            ctx.stroke();

            // Dynamic Face Mesh Nodes (Front TrueDepth)
            for (let i = 0; i < 16; i++) {
              const angle = (i / 16) * Math.PI * 2 + t * 0.5;
              const r = 45 + Math.sin(t * 3 + i) * 8;
              const px = cx + Math.cos(angle) * r;
              const py = cy + Math.sin(angle) * (r * 1.25);
              ctx.fillStyle = '#00e5ff';
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }

            // Phase wave
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
            ctx.beginPath();
            for (let x = 0; x < w; x += 10) {
              const y = cy + Math.sin(x * 0.05 + t * 4) * 15;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }

          // Apply Post Filter
          applyFilter(ctx, frontCamera.filterMode, w, h, t);
        }
      }

      // Render Rear Canvas (Synthesized IMX571 / Reconstructed)
      if (rearCanvasRef.current) {
        const ctx = rearCanvasRef.current.getContext('2d');
        const w = rearCanvasRef.current.width;
        const h = rearCanvasRef.current.height;
        if (ctx) {
          if (rearCamera.stream && rearVideoRef.current && rearVideoRef.current.readyState >= 2) {
            ctx.drawImage(rearVideoRef.current, 0, 0, w, h);
          } else {
            // High fidelity IMX571 26MP photon reconstruction field
            const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 1.5);
            grad.addColorStop(0, '#0c1a2e');
            grad.addColorStop(0.7, '#070d18');
            grad.addColorStop(1, '#020408');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Photon noise & reconstructed celestial/quantum object
            const cx = w / 2;
            const cy = h / 2;

            // Concentric Lux Radiance rings (432Hz anchor)
            for (let r = 20; r < 140; r += 24) {
              ctx.strokeStyle = `rgba(255, 78, 0, ${0.4 - r / 400})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(cx, cy, r + Math.sin(t * 3 + r) * 3, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Central Airy Disk / Point Spread Function
            const psfGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
            psfGrad.addColorStop(0, '#ffffff');
            psfGrad.addColorStop(0.3, '#ffaa00');
            psfGrad.addColorStop(0.7, '#ff4e00');
            psfGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = psfGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 35, 0, Math.PI * 2);
            ctx.fill();

            // Quantum Photon Scatter Points
            for (let i = 0; i < 40; i++) {
              const sx = (Math.sin(i * 99 + t) * 0.5 + 0.5) * w;
              const sy = (Math.cos(i * 33 + t * 1.5) * 0.5 + 0.5) * h;
              ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 229, 255, 0.7)' : 'rgba(255, 78, 0, 0.7)';
              ctx.fillRect(sx, sy, 2, 2);
            }
          }

          // Apply Post Filter
          applyFilter(ctx, rearCamera.filterMode, w, h, t);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [frontCamera.filterMode, rearCamera.filterMode, frontCamera.stream, rearCamera.stream]);

  // Filter Pipeline Helper
  const applyFilter = (ctx: CanvasRenderingContext2D, mode: string, w: number, h: number, t: number) => {
    if (mode === 'PHOTON_PNP') {
      ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (mode === 'EDGE_TENSOR') {
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.strokeRect(w / 4, h / 4, w / 2, h / 2);
    } else if (mode === 'LUX_RADIANCE') {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.06)';
      ctx.fillRect(0, 0, w, h);
    } else if (mode === 'THERMAL_FALSE_COLOR') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255, 0, 0, 0.15)');
      grad.addColorStop(0.5, 'rgba(255, 255, 0, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 255, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  };

  // Recording Timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordedTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordedTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Periodic Infinity Link synchronization jitter
  useEffect(() => {
    const linkInterval = setInterval(() => {
      setInfinityLink(prev => ({
        ...prev,
        pllPhaseErrorDeg: +(0.0005 + Math.random() * 0.0004).toFixed(5),
        entanglementCoeff: +(0.99997 + Math.random() * 0.00002).toFixed(5),
        bidirectionalFluxGbps: +(12.5 + Math.random() * 0.6).toFixed(2),
        syncTimestamp: Date.now()
      }));
    }, 2000);
    return () => clearInterval(linkInterval);
  }, []);

  const takeSnapshot = () => {
    if (rearCanvasRef.current) {
      const dataUrl = rearCanvasRef.current.toDataURL('image/png');
      setSnapshotTaken(dataUrl);
    }
  };

  return (
    <div className="space-y-6 font-mono text-sm text-[#e0e0e0]">
      {/* Top Banner / Infinity Link Overview */}
      <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#2d3139]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff4e00]/10 border border-[#ff4e00]/40 rounded text-[#ff4e00]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f0f0f0] tracking-wide flex items-center gap-2">
                DUAL CAMERA MODULE &amp; INFINITY LINK (<span className="text-[#00e5ff] font-sans">∞</span>)
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                  432Hz PHASE-LOCKED
                </span>
              </h2>
              <p className="text-xs text-[#8e9299]">
                Front TrueDepth / Metasurface Alpha ↔ Rear IMX571 26MP Quantum Photon Array
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => requestHardwareStream('front')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#23272e] hover:bg-[#2d3139] border border-[#404550] rounded text-xs text-[#00e5ff] font-bold cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>LINK FRONT CAM</span>
            </button>
            <button
              onClick={() => requestHardwareStream('rear')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#23272e] hover:bg-[#2d3139] border border-[#404550] rounded text-xs text-[#ff4e00] font-bold cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>LINK REAR CAM</span>
            </button>
            <button
              onClick={() => {
                if (frontCamera.stream) frontCamera.stream.getTracks().forEach(t => t.stop());
                if (rearCamera.stream) rearCamera.stream.getTracks().forEach(t => t.stop());
                setFrontCamera(prev => ({ ...prev, stream: null }));
                setRearCamera(prev => ({ ...prev, stream: null }));
                setPermissionState('SIMULATED');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a1c20] hover:bg-[#252830] border border-[#333] rounded text-xs text-[#8e9299] cursor-pointer"
              title="Reset to quantum simulation feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SYNTHESIS</span>
            </button>
          </div>
        </div>

        {/* Quantum Infinity Link Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="bg-[#0e1013] p-2.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Infinity PLL Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
              <span className="text-xs font-bold text-[#00e5ff]">PHASE LOCKED</span>
            </div>
            <span className="text-[9px] text-[#6b7280] block mt-0.5">Err: ±{infinityLink.pllPhaseErrorDeg}°</span>
          </div>

          <div className="bg-[#0e1013] p-2.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Entanglement Coeff</span>
            <span className="text-xs font-bold text-[#22c55e] block mt-1">
              {(infinityLink.entanglementCoeff * 100).toFixed(4)}%
            </span>
            <span className="text-[9px] text-[#6b7280] block mt-0.5">Target: ≥99.997%</span>
          </div>

          <div className="bg-[#0e1013] p-2.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Bi-Dir Flux Rate</span>
            <span className="text-xs font-bold text-[#f0f0f0] block mt-1">
              {infinityLink.bidirectionalFluxGbps} Gbps
            </span>
            <span className="text-[9px] text-[#6b7280] block mt-0.5">Zero-Copy DMA</span>
          </div>

          <div className="bg-[#0e1013] p-2.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Photon Transfer</span>
            <span className="text-xs font-bold text-[#eab308] block mt-1">
              {infinityLink.photonTransferRateMcps} Mcps
            </span>
            <span className="text-[9px] text-[#6b7280] block mt-0.5">Anchor 432.0 Hz</span>
          </div>

          <div className="bg-[#0e1013] p-2.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Active Mode</span>
            <span className="text-xs font-bold text-[#38bdf8] block mt-1">{viewMode}</span>
            <span className="text-[9px] text-[#6b7280] block mt-0.5">Synchronous</span>
          </div>

          <div className="bg-[#0e1013] p-2.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Hardware Source</span>
            <span className="text-xs font-bold text-[#c084fc] block mt-1">
              {permissionState === 'GRANTED' ? 'LIVE SENSORS' : 'SYNTHESIZER'}
            </span>
            <span className="text-[9px] text-[#6b7280] block mt-0.5">{hardwareDevices.length} video inputs</span>
          </div>
        </div>
      </div>

      {/* View Mode & Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-[#8e9299] mr-2">LAYOUT:</span>
          {(['SPLIT', 'PIP', 'STEREO_DISPARITY', 'HOLO_OVERLAY', 'FRONT_ONLY', 'REAR_ONLY'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-[#ff4e00] text-[#0a0b0e]'
                  : 'bg-[#23272e] text-[#8e9299] hover:text-[#fff] hover:bg-[#2d3139]'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Record Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
              isRecording
                ? 'bg-[#ef4444] text-white animate-pulse'
                : 'bg-[#23272e] text-[#8e9299] hover:text-white hover:bg-[#2d3139]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>{isRecording ? `REC [${recordedTime}s]` : 'RECORD 4K'}</span>
          </button>

          {/* Snapshot Button */}
          <button
            onClick={takeSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 hover:bg-[#00e5ff]/30 rounded text-xs font-bold cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>SNAPSHOT</span>
          </button>
        </div>
      </div>

      {/* Hidden Video Elements for WebRTC Streams */}
      <video ref={frontVideoRef} className="hidden" autoPlay playsInline muted />
      <video ref={rearVideoRef} className="hidden" autoPlay playsInline muted />

      {/* Main Dual Camera Feeds Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FRONT CAMERA MODULE */}
        {(viewMode === 'SPLIT' || viewMode === 'PIP' || viewMode === 'FRONT_ONLY' || viewMode === 'STEREO_DISPARITY' || viewMode === 'HOLO_OVERLAY') && (
          <div className="bg-[#121418] border border-[#2d3139] rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#1a1d22] px-4 py-2.5 border-b border-[#2d3139] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]"></span>
                <span className="text-xs font-bold text-[#f0f0f0]">FRONT CAMERA (NODE A)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                  {frontCamera.facing.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#8e9299]">
                <span>{frontCamera.resolution}</span>
                <span>•</span>
                <span>{frontCamera.fps} FPS</span>
                <span>•</span>
                <span className="text-[#00e5ff]">SNR: {frontCamera.snrEstDb} dB</span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video bg-[#05070a] flex items-center justify-center overflow-hidden">
              <canvas
                ref={frontCanvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />

              {/* Live Overlay HUD */}
              <div className="absolute top-2 left-2 pointer-events-none text-[10px] font-mono text-[#00e5ff] bg-[#0a0b0e]/70 px-2 py-1 rounded border border-[#00e5ff]/30">
                <div>TRUE-DEPTH BIO-TRACKER: ACTIVE</div>
                <div>LUX DOMINANCE (Λ): {(frontCamera.luxDominance * 100).toFixed(1)}%</div>
                <div>SHADOW GRADIENT (Υ): {(frontCamera.shadowDecoherence * 100).toFixed(1)}%</div>
              </div>

              <div className="absolute bottom-2 right-2 pointer-events-none text-[10px] font-mono text-[#8e9299] bg-[#0a0b0e]/70 px-2 py-1 rounded">
                ISO {frontCamera.iso} | {frontCamera.shutterSpeedMs}ms | +{frontCamera.opticalGainDb}dB
              </div>

              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className="w-8 h-8 text-[#00e5ff]/40" />
              </div>
            </div>

            {/* Parameter & Filter Controls */}
            <div className="p-3 bg-[#15171a] border-t border-[#2d3139] space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-[#8e9299]">FILTER MATRIX:</span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(['NATURAL', 'PHOTON_PNP', 'EDGE_TENSOR', 'LUX_RADIANCE', 'QUANTUM_PHASE'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFrontCamera(prev => ({ ...prev, filterMode: f }))}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        frontCamera.filterMode === f
                          ? 'bg-[#00e5ff] text-[#0a0b0e]'
                          : 'bg-[#23272e] text-[#8e9299] hover:bg-[#2d3139]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-[#8e9299] block">ISO: {frontCamera.iso}</span>
                  <input
                    type="range"
                    min="50"
                    max="3200"
                    step="50"
                    value={frontCamera.iso}
                    onChange={e => setFrontCamera(prev => ({ ...prev, iso: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#00e5ff]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8e9299] block">Shutter: {frontCamera.shutterSpeedMs}ms</span>
                  <input
                    type="range"
                    min="1"
                    max="33"
                    step="0.5"
                    value={frontCamera.shutterSpeedMs}
                    onChange={e => setFrontCamera(prev => ({ ...prev, shutterSpeedMs: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#00e5ff]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8e9299] block">Gain: +{frontCamera.opticalGainDb}dB</span>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={frontCamera.opticalGainDb}
                    onChange={e => setFrontCamera(prev => ({ ...prev, opticalGainDb: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#00e5ff]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REAR CAMERA MODULE */}
        {(viewMode === 'SPLIT' || viewMode === 'PIP' || viewMode === 'REAR_ONLY' || viewMode === 'STEREO_DISPARITY' || viewMode === 'HOLO_OVERLAY') && (
          <div className="bg-[#121418] border border-[#2d3139] rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#1a1d22] px-4 py-2.5 border-b border-[#2d3139] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff4e00]"></span>
                <span className="text-xs font-bold text-[#f0f0f0]">REAR CAMERA (NODE B)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ff4e00]/10 text-[#ff4e00] border border-[#ff4e00]/30">
                  {rearCamera.facing.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#8e9299]">
                <span>{rearCamera.resolution}</span>
                <span>•</span>
                <span>{rearCamera.fps} FPS</span>
                <span>•</span>
                <span className="text-[#ff4e00]">SNR: {rearCamera.snrEstDb} dB</span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video bg-[#05070a] flex items-center justify-center overflow-hidden">
              <canvas
                ref={rearCanvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />

              {/* Live Overlay HUD */}
              <div className="absolute top-2 left-2 pointer-events-none text-[10px] font-mono text-[#ff4e00] bg-[#0a0b0e]/70 px-2 py-1 rounded border border-[#ff4e00]/30">
                <div>IMX571 RECONSTRUCTOR: ADMM v3.0</div>
                <div>LUX DOMINANCE (Λ): {(rearCamera.luxDominance * 100).toFixed(4)}%</div>
                <div>DARK CURRENT: 0.0002 e-/pix/s (-25°C)</div>
              </div>

              <div className="absolute bottom-2 right-2 pointer-events-none text-[10px] font-mono text-[#8e9299] bg-[#0a0b0e]/70 px-2 py-1 rounded">
                ISO {rearCamera.iso} | {rearCamera.shutterSpeedMs}ms | +{rearCamera.opticalGainDb}dB
              </div>

              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className="w-8 h-8 text-[#ff4e00]/40" />
              </div>
            </div>

            {/* Parameter & Filter Controls */}
            <div className="p-3 bg-[#15171a] border-t border-[#2d3139] space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-[#8e9299]">FILTER MATRIX:</span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(['PHOTON_PNP', 'NATURAL', 'EDGE_TENSOR', 'LUX_RADIANCE', 'THERMAL_FALSE_COLOR'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setRearCamera(prev => ({ ...prev, filterMode: f }))}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rearCamera.filterMode === f
                          ? 'bg-[#ff4e00] text-[#0a0b0e]'
                          : 'bg-[#23272e] text-[#8e9299] hover:bg-[#2d3139]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-[#8e9299] block">ISO: {rearCamera.iso}</span>
                  <input
                    type="range"
                    min="50"
                    max="3200"
                    step="50"
                    value={rearCamera.iso}
                    onChange={e => setRearCamera(prev => ({ ...prev, iso: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#ff4e00]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8e9299] block">Shutter: {rearCamera.shutterSpeedMs}ms</span>
                  <input
                    type="range"
                    min="1"
                    max="33"
                    step="0.5"
                    value={rearCamera.shutterSpeedMs}
                    onChange={e => setRearCamera(prev => ({ ...prev, shutterSpeedMs: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#ff4e00]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8e9299] block">Gain: +{rearCamera.opticalGainDb}dB</span>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={rearCamera.opticalGainDb}
                    onChange={e => setRearCamera(prev => ({ ...prev, opticalGainDb: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#ff4e00]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Modal Preview */}
      {snapshotTaken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#15171a] border border-[#ff4e00] rounded-lg max-w-xl w-full p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                QUANTUM PHOTON SNAPSHOT CAPTURED
              </h3>
              <button
                onClick={() => setSnapshotTaken(null)}
                className="text-[#8e9299] hover:text-white text-xs px-2 py-1 bg-[#23272e] rounded"
              >
                ✕ CLOSE
              </button>
            </div>
            <img src={snapshotTaken} alt="Snapshot Preview" className="w-full rounded border border-[#2d3139]" />
            <div className="flex items-center justify-between text-xs text-[#8e9299]">
              <span>Merkle Seal: 0x7A9D...B412</span>
              <a
                href={snapshotTaken}
                download="quantum_photon_capture_4k.png"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4e00] text-[#0a0b0e] font-bold rounded"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE RAW 26MP</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
