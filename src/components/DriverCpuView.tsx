import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  HardDrive,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Flame,
  ShieldCheck,
  RefreshCw,
  Server,
  Layers,
  Thermometer
} from 'lucide-react';
import { CpuSubsystemState, DriverState, CpuGovernor } from '../types';

export const DriverCpuView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'CPU_TOPOLOGY' | 'DRIVER_HAL' | 'VECTOR_SIMD'>('CPU_TOPOLOGY');

  // CPU Subsystem State (16-core topology: 8 P-cores + 8 E-cores)
  const [cpuState, setCpuState] = useState<CpuSubsystemState>({
    totalUsagePct: 28.4,
    packagePowerWatts: 64.2,
    packageTempC: 44.5,
    governor: 'QUANTUM_COHERENCE',
    simdVectorEngine: 'AVX-512_FMA',
    tflopsCalculated: 14.82,
    l1CacheHitPct: 99.1,
    l2CacheHitPct: 96.8,
    l3CacheHitPct: 92.4,
    memoryBandwidthGbps: 128.4,
    cores: Array.from({ length: 16 }, (_, i) => {
      const isP = i < 8;
      return {
        coreId: i,
        type: isP ? 'P-CORE' : 'E-CORE',
        freqGhz: isP ? 5.2 : 3.6,
        loadPct: Math.floor(15 + Math.random() * 30),
        tempC: Math.floor(40 + Math.random() * 10),
        voltageV: 1.12,
        assignedThread: [
          'PNP_ADMM_SOLVER_T0',
          'PNP_ADMM_SOLVER_T1',
          '5D_METRIC_TENSOR_EIG',
          'HAMILTONIAN_TIME_EVOL',
          'J09_BLE_PQC_INGEST',
          'SOVEREIGN_11_MERKLE',
          'CAMERA_ISP_DMA_P0',
          'CAMERA_ISP_DMA_P1',
          'AUDIO_432HZ_SYNTH',
          'DESKTOP_WIN_COMPOSITOR',
          'NETWORK_UDP_BROADCAST',
          'RESERVED_SYSTEM_T0',
          'IDLE_WORKER_0',
          'IDLE_WORKER_1',
          'IDLE_WORKER_2',
          'IDLE_WORKER_3'
        ][i],
        instructionsPerCycle: +(2.8 + Math.random() * 0.6).toFixed(2)
      };
    })
  });

  // Hardware Drivers HAL State
  const [drivers, setDrivers] = useState<DriverState[]>([
    {
      id: 'DRV_CAM_ISP_01',
      name: 'Sony IMX571 / MIPI-CSI2 ISP Driver',
      category: 'CAMERA_ISP',
      version: 'v4.1.2-sovereign',
      kernelHandle: '0xffff8801f9a0',
      status: 'DMA_ACTIVE',
      dmaThroughputMbps: 24800,
      irqLatencyUs: 0.8,
      bufferRingSize: 16,
      droppedFrames: 0,
      thermalStatus: 'NORMAL (28°C)'
    },
    {
      id: 'DRV_FPGA_PCIE_02',
      name: 'Kintex-7 PCIe Gen4 x8 Direct DMA',
      category: 'FPGA_PCIE',
      version: 'v2.8.0-pnp',
      kernelHandle: '0xffff8802b1c4',
      status: 'DMA_ACTIVE',
      dmaThroughputMbps: 128000,
      irqLatencyUs: 1.1,
      bufferRingSize: 64,
      droppedFrames: 0,
      thermalStatus: 'OPTIMAL (42°C)'
    },
    {
      id: 'DRV_TEC_PID_03',
      name: 'Micro-TEC PID Thermal Controller',
      category: 'TEC_PID',
      version: 'v1.4.0-cryo',
      kernelHandle: '0xffff8803c7e0',
      status: 'ONLINE',
      dmaThroughputMbps: 12,
      irqLatencyUs: 2.4,
      bufferRingSize: 8,
      droppedFrames: 0,
      thermalStatus: 'CRYO LOCK (-40.0°C)'
    },
    {
      id: 'DRV_I2C_SPI_04',
      name: 'J09 Bio-Ring & Shard Bus Driver',
      category: 'I2C_SENSOR',
      version: 'v3.0.1-bio',
      kernelHandle: '0xffff8804e8d2',
      status: 'ONLINE',
      dmaThroughputMbps: 48,
      irqLatencyUs: 3.2,
      bufferRingSize: 32,
      droppedFrames: 0,
      thermalStatus: 'NORMAL (24°C)'
    },
    {
      id: 'DRV_CRYPTO_HW_05',
      name: 'PQC Dilithium-3 Hardware Coprocessor',
      category: 'CRYPTO_HW',
      version: 'v5.0.0-pqc',
      kernelHandle: '0xffff8805f991',
      status: 'ONLINE',
      dmaThroughputMbps: 4200,
      irqLatencyUs: 0.5,
      bufferRingSize: 16,
      droppedFrames: 0,
      thermalStatus: 'OPTIMAL (31°C)'
    }
  ]);

  // Live Jitter & Load Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuState(prev => {
        const newCores = prev.cores.map(c => {
          const isP = c.type === 'P-CORE';
          const delta = (Math.random() - 0.5) * 8;
          const newLoad = Math.max(5, Math.min(95, Math.floor(c.loadPct + delta)));
          return {
            ...c,
            loadPct: newLoad,
            freqGhz: +( (isP ? 4.8 : 3.2) + (newLoad / 100) * (isP ? 1.0 : 0.6) ).toFixed(2),
            tempC: Math.floor(38 + (newLoad / 100) * 22)
          };
        });

        const avgLoad = +(newCores.reduce((acc, c) => acc + c.loadPct, 0) / newCores.length).toFixed(1);
        const avgTemp = +(newCores.reduce((acc, c) => acc + c.tempC, 0) / newCores.length).toFixed(1);

        return {
          ...prev,
          totalUsagePct: avgLoad,
          packageTempC: avgTemp,
          packagePowerWatts: +(45 + (avgLoad / 100) * 65).toFixed(1),
          tflopsCalculated: +(12.0 + (avgLoad / 100) * 8.5).toFixed(2)
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const changeGovernor = (gov: CpuGovernor) => {
    setCpuState(prev => ({ ...prev, governor: gov }));
  };

  const restartDriver = (drvId: string) => {
    setDrivers(prev =>
      prev.map(d => (d.id === drvId ? { ...d, status: 'DMA_ACTIVE', droppedFrames: 0 } : d))
    );
  };

  return (
    <div className="space-y-6 font-mono text-sm text-[#e0e0e0]">
      {/* Header Banner */}
      <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ff4e00]/10 border border-[#ff4e00]/40 rounded text-[#ff4e00]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#f0f0f0] tracking-wide flex items-center gap-2">
              HARDWARE DRIVERS &amp; CPU SUBSYSTEM
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff4e00]/20 text-[#ff4e00] border border-[#ff4e00]/40">
                16 CORES / AVX-512
              </span>
            </h2>
            <p className="text-xs text-[#8e9299]">
              Direct DMA Kernel Drivers, Micro-TEC PID, Kintex-7 PCIe x8, and Thread Affinity Manager
            </p>
          </div>
        </div>

        {/* Governor Selector */}
        <div className="flex items-center gap-2 bg-[#0e1013] p-1.5 rounded border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] px-2">GOVERNOR:</span>
          {(['QUANTUM_COHERENCE', 'PERFORMANCE', 'BURST_RECON', 'SCHEDUTIL'] as const).map(gov => (
            <button
              key={gov}
              onClick={() => changeGovernor(gov)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                cpuState.governor === gov
                  ? 'bg-[#ff4e00] text-[#0a0b0e]'
                  : 'bg-[#1e2229] text-[#8e9299] hover:text-white'
              }`}
            >
              {gov.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Global Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">CPU Total Load</span>
          <span className="text-base font-bold text-[#ff4e00] block mt-1">{cpuState.totalUsagePct}%</span>
          <div className="w-full h-1.5 bg-[#23272e] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[#ff4e00]" style={{ width: `${cpuState.totalUsagePct}%` }}></div>
          </div>
        </div>

        <div className="bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Package Power</span>
          <span className="text-base font-bold text-[#eab308] block mt-1">{cpuState.packagePowerWatts} W</span>
          <span className="text-[9px] text-[#6b7280]">TDP Cap: 125 W</span>
        </div>

        <div className="bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Junction Temp</span>
          <span className="text-base font-bold text-[#22c55e] block mt-1">{cpuState.packageTempC} °C</span>
          <span className="text-[9px] text-[#6b7280]">T_junction max: 100°C</span>
        </div>

        <div className="bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">SIMD Vector Perf</span>
          <span className="text-base font-bold text-[#00e5ff] block mt-1">{cpuState.tflopsCalculated} TFLOPS</span>
          <span className="text-[9px] text-[#6b7280]">{cpuState.simdVectorEngine}</span>
        </div>

        <div className="bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">L1/L2/L3 Cache Hit</span>
          <span className="text-base font-bold text-[#38bdf8] block mt-1">{cpuState.l1CacheHitPct}%</span>
          <span className="text-[9px] text-[#6b7280]">L3: {cpuState.l3CacheHitPct}%</span>
        </div>

        <div className="bg-[#15171a] p-3 rounded-lg border border-[#2d3139]">
          <span className="text-[10px] text-[#8e9299] uppercase tracking-wider block">Memory Bandwidth</span>
          <span className="text-base font-bold text-[#c084fc] block mt-1">{cpuState.memoryBandwidthGbps} GB/s</span>
          <span className="text-[9px] text-[#6b7280]">Octa-Channel DDR5</span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#2d3139] pb-2 overflow-x-auto">
        {[
          { id: 'CPU_TOPOLOGY', label: '01. 16-CORE CPU THREAD AFFINITY TOPOLOGY', icon: Cpu },
          { id: 'DRIVER_HAL', label: '02. HARDWARE DRIVER HAL & DMA ENGINES', icon: HardDrive },
          { id: 'VECTOR_SIMD', label: '03. SIMD VECTOR & INSTRUCTION PIPELINE', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#ff4e00] text-[#0a0b0e]'
                  : 'bg-[#1a1d22] text-[#8e9299] hover:text-[#fff] hover:bg-[#23272e]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: 16-CORE CPU TOPOLOGY */}
      {activeSubTab === 'CPU_TOPOLOGY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8e9299]">
            <span>CORES 0-7: HIGH-PERFORMANCE (P-CORES) • CORES 8-15: HIGH-EFFICIENCY (E-CORES)</span>
            <span className="text-[#00e5ff]">Thread Affinity: Auto-Coherence Locked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cpuState.cores.map(core => (
              <div
                key={core.coreId}
                className={`p-3 rounded-lg border transition-all ${
                  core.type === 'P-CORE'
                    ? 'bg-[#15171a] border-[#2d3139] hover:border-[#ff4e00]/50'
                    : 'bg-[#121417] border-[#262930] hover:border-[#00e5ff]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f0f0f0]">
                    CORE #{core.coreId}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      core.type === 'P-CORE'
                        ? 'bg-[#ff4e00]/20 text-[#ff4e00] border border-[#ff4e00]/30'
                        : 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30'
                    }`}
                  >
                    {core.type}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9299]">Load:</span>
                    <span className="font-bold text-[#f0f0f0]">{core.loadPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#23272e] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${core.loadPct > 70 ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`}
                      style={{ width: `${core.loadPct}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-[#8e9299]">
                    <div>Freq: <span className="text-[#f0f0f0] font-bold">{core.freqGhz} GHz</span></div>
                    <div>Temp: <span className="text-[#f0f0f0] font-bold">{core.tempC} °C</span></div>
                    <div>IPC: <span className="text-[#00e5ff] font-bold">{core.instructionsPerCycle}</span></div>
                    <div>Volt: <span className="text-[#eab308] font-bold">{core.voltageV} V</span></div>
                  </div>

                  <div className="mt-2 pt-1 border-t border-[#23272e] text-[9px] text-[#8e9299] truncate">
                    Affinity: <span className="text-[#38bdf8]">{core.assignedThread}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DRIVER HAL */}
      {activeSubTab === 'DRIVER_HAL' && (
        <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#ff4e00]" />
              Active Hardware Driver Registry &amp; DMA Ring Pipelines
            </h3>
            <span className="text-xs text-[#22c55e] flex items-center gap-1 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              5/5 DRIVERS ONLINE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2d3139] text-[#8e9299]">
                  <th className="py-2 px-3">DRIVER ID &amp; NAME</th>
                  <th className="py-2 px-3">VERSION</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3">DMA RATE</th>
                  <th className="py-2 px-3">IRQ LATENCY</th>
                  <th className="py-2 px-3">BUFFERS</th>
                  <th className="py-2 px-3">THERMAL</th>
                  <th className="py-2 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20242c]">
                {drivers.map(drv => (
                  <tr key={drv.id} className="hover:bg-[#1a1d22]">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[#f0f0f0] block">{drv.name}</span>
                      <span className="text-[10px] text-[#6b7280] font-mono">{drv.id} • {drv.kernelHandle}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#8e9299] font-mono">{drv.version}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">
                        {drv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#00e5ff]">
                      {(drv.dmaThroughputMbps / 1000).toFixed(2)} Gbps
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#eab308]">
                      {drv.irqLatencyUs} μs
                    </td>
                    <td className="py-2.5 px-3 text-[#8e9299]">
                      {drv.bufferRingSize} Ring Frames
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-[#22c55e]">
                      {drv.thermalStatus}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => restartDriver(drv.id)}
                        className="px-2 py-1 bg-[#23272e] hover:bg-[#2d3139] text-[10px] text-[#8e9299] hover:text-[#ff4e00] rounded font-bold cursor-pointer"
                      >
                        RELOAD
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SIMD VECTOR & INSTRUCTION PIPELINE */}
      {activeSubTab === 'VECTOR_SIMD' && (
        <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2 border-b border-[#2d3139] pb-2">
            <Zap className="w-4 h-4 text-[#00e5ff]" />
            SIMD Vector Acceleration &amp; FMA Instructions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0e1013] p-3.5 rounded border border-[#2d3139] space-y-2">
              <span className="text-xs font-bold text-[#00e5ff]">AVX-512 FMA Pipeline</span>
              <p className="text-[11px] text-[#8e9299]">512-bit vector width running 16x FP32 FMA ops per cycle for PnP-ADMM Proximal Solver.</p>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#8e9299]">Vector Utilization:</span>
                <span className="font-bold text-[#22c55e]">98.4%</span>
              </div>
            </div>

            <div className="bg-[#0e1013] p-3.5 rounded border border-[#2d3139] space-y-2">
              <span className="text-xs font-bold text-[#22c55e]">ARM NEON v2 Vector Bridging</span>
              <p className="text-[11px] text-[#8e9299]">128-bit vector arithmetic pipeline cross-compiled for Samsung A17 Bio-Ingest.</p>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#8e9299]">Throughput:</span>
                <span className="font-bold text-[#00e5ff]">3.8 GFLOPS</span>
              </div>
            </div>

            <div className="bg-[#0e1013] p-3.5 rounded border border-[#2d3139] space-y-2">
              <span className="text-xs font-bold text-[#ff4e00]">PQC Dilithium Coprocessor</span>
              <p className="text-[11px] text-[#8e9299]">Dedicated NTT (Number Theoretic Transform) acceleration for lattice polynomial multiplication.</p>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#8e9299]">Sig Verification:</span>
                <span className="font-bold text-[#eab308]">8.2 μs / op</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
