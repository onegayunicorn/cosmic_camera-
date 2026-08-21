import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Activity,
  Cpu,
  Thermometer,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Layers,
  Gauge,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PhotonConfig, AdmmIterationMetrics } from '../types';
import { ReconstructionResult } from '../services/pnpAdmmEngine';

interface Props {
  config: PhotonConfig;
  result: ReconstructionResult | null;
  currentStep: number;
  isIterating: boolean;
  photonStats?: {
    totalPhotons: number;
    peakCount: number;
    meanCount: number;
    fanoFactor: number;
    histogram: { bin: string; count: number; theoretical: number }[];
  };
}

interface ThermalHistoryPoint {
  time: string;
  sensorTempC: number;
  targetTempC: number;
  heatsinkTempC: number;
  darkCurrentE: number;
}

interface StreamHistoryPoint {
  frame: number;
  photonFlux: number;
  snrEstDb: number;
  reconstructedPsnr: number;
}

export const PhotonTelemetryDashboard: React.FC<Props> = ({
  config,
  result,
  currentStep,
  isIterating,
  photonStats
}) => {
  const [activeTab, setActiveTab] = useState<'photon_flux' | 'convergence' | 'fpga_hardware' | 'thermal'>('photon_flux');
  const [streamHistory, setStreamHistory] = useState<StreamHistoryPoint[]>([]);
  const [thermalHistory, setThermalHistory] = useState<ThermalHistoryPoint[]>([]);

  // Simulate continuous real-time telemetry buffer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0].substring(3); // mm:ss

      // Calculate thermal readings
      const targetT = config.tecTempC;
      const noise = (Math.random() - 0.5) * 0.4;
      const actualT = Number((targetT + noise).toFixed(2));
      const heatsinkT = Number((28.5 + (actualT < 0 ? Math.abs(actualT) * 0.35 : 0) + (Math.random() - 0.5) * 0.3).toFixed(2));
      const darkE = Number((0.05 * Math.exp((actualT - (-10.0)) / 9.5) * (config.exposureTimeMs / 50.0)).toFixed(4));

      setThermalHistory(prev => {
        const next = [
          ...prev,
          {
            time: timeStr,
            sensorTempC: actualT,
            targetTempC: targetT,
            heatsinkTempC: heatsinkT,
            darkCurrentE: darkE
          }
        ];
        return next.slice(-15);
      });

      // Stream history
      setStreamHistory(prev => {
        const frameNum = (prev.length > 0 ? prev[prev.length - 1].frame : 100) + 1;
        const currentFlux = Number((config.flux * (1 + (Math.random() - 0.5) * 0.15)).toFixed(2));
        const psnrVal = result ? Number(result.finalPsnr.toFixed(2)) : 32.5;
        const snrVal = Number((10 * Math.log10(Math.max(1, currentFlux / Math.max(0.01, darkE)))).toFixed(2));

        const next = [
          ...prev,
          {
            frame: frameNum,
            photonFlux: currentFlux,
            snrEstDb: snrVal,
            reconstructedPsnr: psnrVal
          }
        ];
        return next.slice(-20);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [config.tecTempC, config.flux, config.exposureTimeMs, result]);

  // FPGA dynamic load calculations based on iteration count and configuration
  const fpgaLutPct = Math.min(94, Math.round(52 + (config.iterations / 50) * 22 + (config.lambda > 0.5 ? 8 : 0)));
  const fpgaDspPct = Math.min(96, Math.round(65 + (config.iterations / 50) * 25));
  const fpgaBramPct = 48;
  const fpgaPowerW = Number((3.85 + (fpgaDspPct / 100) * 1.6).toFixed(2));
  const stepLatencyMs = result && result.iterationsData.length > 0
    ? Number((result.totalTimeMs / result.iterationsData.length).toFixed(2))
    : 1.84;

  const iterationsData = result?.iterationsData || [];

  return (
    <div className="bg-[#15171a] rounded-lg border border-[#2d3139] shadow-md p-4 space-y-4 font-mono">
      {/* Top Header & Telemetry Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d3139] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#ff4e00]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            REAL-TIME DATA VISUALIZATION & TELEMETRY DASHBOARD
          </h3>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center bg-[#0a0b0e] p-0.5 rounded border border-[#2d3139] overflow-x-auto">
          <button
            onClick={() => setActiveTab('photon_flux')}
            className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'photon_flux' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
            }`}
          >
            Live Photon Counts
          </button>
          <button
            onClick={() => setActiveTab('convergence')}
            className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'convergence' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
            }`}
          >
            Reconstruction Progress
          </button>
          <button
            onClick={() => setActiveTab('thermal')}
            className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'thermal' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
            }`}
          >
            Sensor Thermal
          </button>
          <button
            onClick={() => setActiveTab('fpga_hardware')}
            className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'fpga_hardware' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
            }`}
          >
            FPGA System Load
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase flex items-center justify-between">
            <span>Total Detected</span>
            <Sparkles className="w-3 h-3 text-[#ff4e00]" />
          </div>
          <div className="text-lg font-bold text-white">
            {photonStats ? photonStats.totalPhotons.toLocaleString() : '5,760'}{' '}
            <span className="text-[10px] font-normal text-[#8e9299]">ph</span>
          </div>
          <div className="text-[9px] text-[#00ff41]">Mean: {(photonStats?.meanCount ?? 2.5).toFixed(2)} ph/pix</div>
        </div>

        <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase flex items-center justify-between">
            <span>Poisson Fano (F)</span>
            <TrendingUp className="w-3 h-3 text-[#00ff41]" />
          </div>
          <div className="text-lg font-bold text-[#00ff41]">
            {(photonStats?.fanoFactor ?? 1.02).toFixed(3)}
          </div>
          <div className="text-[9px] text-[#8e9299]">Shot Noise Limit: ~1.000</div>
        </div>

        <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase flex items-center justify-between">
            <span>Active Iteration</span>
            <Clock className="w-3 h-3 text-[#ff4e00]" />
          </div>
          <div className="text-lg font-bold text-white">
            {isIterating ? currentStep : result?.iterationsData.length ?? config.iterations}
            <span className="text-[10px] font-normal text-[#8e9299]"> / {config.iterations}</span>
          </div>
          <div className="text-[9px] text-[#00ff41]">
            {result?.converged ? 'Status: Converged' : isIterating ? 'Status: Running' : 'Status: Ready'}
          </div>
        </div>

        <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase flex items-center justify-between">
            <span>Restored PSNR</span>
            <Zap className="w-3 h-3 text-[#00ff41]" />
          </div>
          <div className="text-lg font-bold text-[#00ff41]">
            {result?.finalPsnr.toFixed(2) ?? '38.45'}{' '}
            <span className="text-[10px] font-normal text-[#8e9299]">dB</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">SSIM: {result?.finalSsim.toFixed(3) ?? '0.942'}</div>
        </div>

        <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase flex items-center justify-between">
            <span>TEC Temp</span>
            <Thermometer className="w-3 h-3 text-[#ff4e00]" />
          </div>
          <div className={`text-lg font-bold ${config.tecTempC <= -5 ? 'text-[#00ff41]' : 'text-[#ff4e00]'}`}>
            {config.tecTempC.toFixed(1)} <span className="text-[10px] font-normal text-[#8e9299]">°C</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">
            Dark Noise: {result?.darkCurrentNoiseE.toFixed(3) ?? '0.050'} e⁻
          </div>
        </div>

        <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase flex items-center justify-between">
            <span>FPGA Latency</span>
            <Cpu className="w-3 h-3 text-[#ff4e00]" />
          </div>
          <div className="text-lg font-bold text-white">
            {stepLatencyMs.toFixed(2)} <span className="text-[10px] font-normal text-[#8e9299]">ms</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">DSP Load: {fpgaDspPct}%</div>
        </div>
      </div>

      {/* VIEW 1: Live Photon Counts (Histogram & Rolling Influx Stream) */}
      {activeTab === 'photon_flux' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Histogram: Measured Photon Hits vs Theoretical Poisson */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4e00]" />
                Photon Count Distribution: Measured vs Poisson P(k; λ)
              </div>
              <span className="text-[10px] text-[#00ff41] bg-[#15171a] px-1.5 py-0.5 rounded border border-[#2d3139]">
                48x48 Matrix (2,304 Pixels)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={photonStats?.histogram || [
                    { bin: '0', count: 420, theoretical: 450 },
                    { bin: '1', count: 780, theoretical: 760 },
                    { bin: '2', count: 580, theoretical: 590 },
                    { bin: '3', count: 290, theoretical: 280 },
                    { bin: '4', count: 140, theoretical: 135 },
                    { bin: '5', count: 60, theoretical: 55 },
                    { bin: '6', count: 22, theoretical: 20 },
                    { bin: '7', count: 8, theoretical: 9 },
                    { bin: '8+', count: 4, theoretical: 5 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis dataKey="bin" stroke="#8e9299" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8e9299" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15171a', borderColor: '#2d3139', fontSize: '11px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#e0e0e0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  <Bar dataKey="count" name="Detected Photon Pixel Counts" fill="#ff4e00" radius={[2, 2, 0, 0]} barSize={20} />
                  <Line type="monotone" dataKey="theoretical" name="Poisson Theoretical Fit" stroke="#00ff41" strokeWidth={2} dot={{ r: 3, fill: '#00ff41' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-[#8e9299] flex justify-between pt-1">
              <span>Peak Photon Hit: <strong className="text-white">{photonStats?.peakCount ?? 8} ph</strong></span>
              <span>Variance / Mean Ratio: <strong className="text-[#00ff41]">{(photonStats?.fanoFactor ?? 1.02).toFixed(3)}</strong></span>
            </div>
          </div>

          {/* Rolling Photon Influx & Sensor SNR Stream */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-[#00ff41]" />
                Live Incident Flux & SNR Rolling Stream
              </div>
              <span className="text-[10px] text-[#8e9299]">1.2s Heartbeat Cadence</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streamHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis dataKey="frame" stroke="#8e9299" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#ff4e00" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#00ff41" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15171a', borderColor: '#2d3139', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="photonFlux" name="Instant Flux (ph/pix)" stroke="#ff4e00" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="snrEstDb" name="Sensor SNR (dB)" stroke="#00ff41" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-[#8e9299] flex justify-between pt-1">
              <span>Exposure Window: <strong className="text-white">{config.exposureTimeMs} ms</strong></span>
              <span>Analog Gain: <strong className="text-white">+{config.sensorGainDb} dB</strong></span>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: Reconstruction Progress & ADMM Convergence */}
      {activeTab === 'convergence' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Primal & Dual Residuals Progression with Epsilon Threshold */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold">
                <Activity className="w-3.5 h-3.5 text-[#ff4e00]" />
                ADMM Residuals: Primal ||x-z|| & Dual ρ||z-z_prev||
              </div>
              <span className="text-[10px] text-[#00ff41] font-bold">
                Target ε = {config.epsilon}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={iterationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis dataKey="iteration" stroke="#8e9299" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8e9299" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15171a', borderColor: '#2d3139', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  <ReferenceLine y={config.epsilon} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'ε Limit', fill: '#eab308', fontSize: 10 }} />
                  <Line type="monotone" dataKey="primalResidual" name="Primal Residual ||x - z||" stroke="#ff4e00" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line type="monotone" dataKey="dualResidual" name="Dual Residual ρ||Δz||" stroke="#00ff41" strokeWidth={1.5} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-[#8e9299] flex justify-between pt-1">
              <span>Final Primal Res: <strong className="text-white">{result?.iterationsData.slice(-1)[0]?.primalResidual.toFixed(5) ?? '0.00008'}</strong></span>
              <span>Final Dual Res: <strong className="text-white">{result?.iterationsData.slice(-1)[0]?.dualResidual.toFixed(5) ?? '0.00004'}</strong></span>
            </div>
          </div>

          {/* PSNR & SSIM Evolution Curve */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold">
                <Zap className="w-3.5 h-3.5 text-[#00ff41]" />
                Reconstruction Fidelity Curve: PSNR (dB) & SSIM
              </div>
              <span className="text-[10px] text-[#00ff41]">
                Max PSNR: {result?.finalPsnr.toFixed(2) ?? '38.45'} dB
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={iterationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis dataKey="iteration" stroke="#8e9299" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="psnr" stroke="#00ff41" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                  <YAxis yAxisId="ssim" orientation="right" stroke="#e0e0e0" fontSize={10} tickLine={false} domain={[0.5, 1.0]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15171a', borderColor: '#2d3139', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  <Area yAxisId="psnr" type="monotone" dataKey="psnr" name="PSNR (dB)" fill="#00ff41" fillOpacity={0.15} stroke="#00ff41" strokeWidth={2} />
                  <Line yAxisId="ssim" type="monotone" dataKey="ssim" name="Structural Similarity (SSIM)" stroke="#ff4e00" strokeWidth={1.5} dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-[#8e9299] flex justify-between pt-1">
              <span>SNR Gain vs Raw: <strong className="text-[#00ff41]">+{result?.finalSnrDb.toFixed(1) ?? '14.2'} dB</strong></span>
              <span>Total ADMM Elapsed: <strong className="text-white">{result?.totalTimeMs.toFixed(1) ?? '28.4'} ms</strong></span>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: Sensor Thermal Regulation Curve */}
      {activeTab === 'thermal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          <div className="lg:col-span-2 bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold">
                <Thermometer className="w-3.5 h-3.5 text-[#ff4e00]" />
                IMX571 TEC Peltier Thermal Dynamic Regulation
              </div>
              <span className="text-[10px] text-[#00ff41]">PID Loop Active</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={thermalHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis dataKey="time" stroke="#8e9299" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="temp" stroke="#8e9299" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="dark" orientation="right" stroke="#ff4e00" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15171a', borderColor: '#2d3139', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  <Line yAxisId="temp" type="monotone" dataKey="sensorTempC" name="Sensor Temp (°C)" stroke="#00ff41" strokeWidth={2} dot={false} />
                  <Line yAxisId="temp" type="monotone" dataKey="heatsinkTempC" name="Heatsink Temp (°C)" stroke="#8e9299" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  <Line yAxisId="dark" type="monotone" dataKey="darkCurrentE" name="Dark Noise (e⁻/pix)" stroke="#ff4e00" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-[#8e9299] flex justify-between pt-1">
              <span>Peltier Power: <strong className="text-white">12.4 W</strong></span>
              <span>Thermal Differential ΔT: <strong className="text-[#00ff41]">{(28.5 - config.tecTempC).toFixed(1)} °C</strong></span>
            </div>
          </div>

          {/* Thermal Diagnostics Panel */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase border-b border-[#2d3139] pb-2 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#ff4e00]" />
                Thermal Calibration Status
              </h4>
              <div className="space-y-2 pt-2.5 text-xs">
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">Sensor Target Temp:</span>
                  <span className="text-white font-bold">{config.tecTempC.toFixed(1)} °C</span>
                </div>
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">Dark Noise Floor:</span>
                  <span className="text-[#00ff41] font-bold">
                    {(0.05 * Math.exp((config.tecTempC - (-10.0)) / 9.5)).toFixed(3)} e⁻/pix
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">Read Noise @ +{config.sensorGainDb}dB:</span>
                  <span className="text-white font-bold">
                    {(1.18 * Math.sqrt(Math.pow(10, config.sensorGainDb / 20) / 3.98)).toFixed(2)} e⁻
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">TEC PID Controller:</span>
                  <span className="text-[#00ff41] font-bold">LOCKED (±0.05°C)</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#15171a] rounded border border-[#2d3139] text-[10px] text-[#8e9299] space-y-1">
              <div className="text-white font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#00ff41]" />
                Cryogenic Suppression Active
              </div>
              <p>
                Lowering sensor temperature from +25°C to -10°C reduces thermal dark electron accumulation by over 92%, critical for sub-5 photon low-flux reconstruction.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 4: Kintex-7 FPGA System Load & Hardware Telemetry */}
      {activeTab === 'fpga_hardware' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Hardware Resource Utilization Gauges */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase border-b border-[#2d3139] pb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#ff4e00]" />
              Kintex-7 XC7K325T FPGA Utilization
            </h4>

            {/* Logic LUTs */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#8e9299]">Logic LUTs (326,080 total)</span>
                <span className="text-white font-bold">{fpgaLutPct}% ({Math.round(326080 * fpgaLutPct / 100).toLocaleString()})</span>
              </div>
              <div className="w-full bg-[#15171a] h-2 rounded overflow-hidden border border-[#2d3139]">
                <div className="bg-[#ff4e00] h-full transition-all duration-300" style={{ width: `${fpgaLutPct}%` }} />
              </div>
            </div>

            {/* DSP48E1 Slices */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#8e9299]">DSP48E1 Slices (840 total)</span>
                <span className="text-[#00ff41] font-bold">{fpgaDspPct}% ({Math.round(840 * fpgaDspPct / 100)} Slices)</span>
              </div>
              <div className="w-full bg-[#15171a] h-2 rounded overflow-hidden border border-[#2d3139]">
                <div className="bg-[#00ff41] h-full transition-all duration-300" style={{ width: `${fpgaDspPct}%` }} />
              </div>
            </div>

            {/* Block RAM (BRAM 36Kb) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#8e9299]">BRAM 36Kb Tiles (445 total)</span>
                <span className="text-white font-bold">{fpgaBramPct}% (214 Tiles)</span>
              </div>
              <div className="w-full bg-[#15171a] h-2 rounded overflow-hidden border border-[#2d3139]">
                <div className="bg-[#e0e0e0] h-full transition-all duration-300" style={{ width: `${fpgaBramPct}%` }} />
              </div>
            </div>

            <div className="text-[10px] text-[#8e9299] pt-2 border-t border-[#2d3139]/60 flex justify-between">
              <span>AXI4-Stream Clock: <strong className="text-white">250.0 MHz</strong></span>
              <span>PCIe Gen2 x4: <strong className="text-[#00ff41]">12.8 Gbps</strong></span>
            </div>
          </div>

          {/* Pipeline Step Latency Breakdown */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase border-b border-[#2d3139] pb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00ff41]" />
              ADMM Pipeline Timing Breakdown
            </h4>

            <div className="space-y-2 text-xs">
              <div className="bg-[#15171a] p-2 rounded border border-[#2d3139] flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">1. Poisson Likelihood (X-Update)</div>
                  <div className="text-[10px] text-[#8e9299]">Parallel Newton-Raphson Roots</div>
                </div>
                <span className="text-[#00ff41] font-bold">0.42 ms</span>
              </div>

              <div className="bg-[#15171a] p-2 rounded border border-[#2d3139] flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">2. 2D Bilateral Prior (Z-Update)</div>
                  <div className="text-[10px] text-[#8e9299]">Separable 5x5 Convolver Array</div>
                </div>
                <span className="text-[#ff4e00] font-bold">1.15 ms</span>
              </div>

              <div className="bg-[#15171a] p-2 rounded border border-[#2d3139] flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">3. Dual Accumulator (U-Update)</div>
                  <div className="text-[10px] text-[#8e9299]">Residual Norm & Stop Condition</div>
                </div>
                <span className="text-[#00ff41] font-bold">0.27 ms</span>
              </div>
            </div>

            <div className="text-[10px] text-[#8e9299] pt-1 flex justify-between">
              <span>Per-Iteration Latency: <strong className="text-white">{stepLatencyMs.toFixed(2)} ms</strong></span>
              <span>Total ({config.iterations} iters): <strong className="text-[#00ff41]">{(stepLatencyMs * config.iterations).toFixed(1)} ms</strong></span>
            </div>
          </div>

          {/* Power & Thermal Metrics */}
          <div className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase border-b border-[#2d3139] pb-2 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#ff4e00]" />
                FPGA Power & Thermal Dissipation
              </h4>

              <div className="space-y-2 pt-2.5 text-xs">
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">FPGA Core Voltage (VCCINT):</span>
                  <span className="text-white font-bold">1.00 V (±15mV)</span>
                </div>
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">Dynamic Compute Power:</span>
                  <span className="text-[#ff4e00] font-bold">{fpgaPowerW} W</span>
                </div>
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">Die Junction Temp (Tj):</span>
                  <span className="text-[#00ff41] font-bold">+44.2 °C (Limit 85°C)</span>
                </div>
                <div className="flex justify-between border-b border-[#2d3139]/40 pb-1.5">
                  <span className="text-[#8e9299]">Hardware Synthesis Status:</span>
                  <span className="text-[#00ff41] font-bold">TIMING MET (Slack +0.42ns)</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#15171a] rounded border border-[#2d3139] text-[10px] text-[#8e9299]">
              FPGA systolic array operates with 100% deterministic latency, eliminating operating system jitter for sub-second quantum imaging loops.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
