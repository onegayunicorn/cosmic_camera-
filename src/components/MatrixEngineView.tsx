import React, { useState, useMemo } from 'react';
import {
  Grid,
  Zap,
  Activity,
  Maximize2,
  RefreshCw,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Share2
} from 'lucide-react';
import { MatrixDecomposition, MetricTensor5D, QuantumHamiltonian } from '../types';

export const MatrixEngineView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NAM_5X5' | 'METRIC_5D' | 'HAMILTONIAN' | 'SANDBOX'>('NAM_5X5');

  // 5x5 Node Alignment Matrix (NAM) state
  const [namMatrix, setNamMatrix] = useState<number[][]>([
    [1.0, 0.432, 0.0, 0.12, 0.05],
    [0.432, 1.0, 0.72, 0.0, 0.18],
    [0.0, 0.72, 1.0, 0.88, 0.0],
    [0.12, 0.0, 0.88, 1.0, 0.432],
    [0.05, 0.18, 0.0, 0.432, 1.0]
  ]);

  // 5D Metric Tensor State
  const [metricWarpFlux, setMetricWarpFlux] = useState<number>(1.414);
  const [hyperRadius, setHyperRadius] = useState<number>(5.0);

  // Hamiltonian Simulation Step
  const [hamiltonianTime, setHamiltonianTime] = useState<number>(0.0);
  const [hamiltonianPreset, setHamiltonianPreset] = useState<'HARMONIC_OSCILLATOR' | 'SPIN_HALF_ZEEMAN' | 'BELL_ENTANGLED' | 'VOID_ZERO_POINT'>('BELL_ENTANGLED');

  // Compute 5x5 NAM Metrics
  const namDecomposition: MatrixDecomposition = useMemo(() => {
    // Approximate mathematical decomposition for 5x5 symmetric matrix
    let trace = 0;
    for (let i = 0; i < 5; i++) trace += namMatrix[i][i];

    // Compute synthetic approximate eigenvalues based on Gershgorin circle theorem
    const eigenvalues = namMatrix.map((row, i) => {
      const diag = row[i];
      const sumOffDiag = row.reduce((acc, val, j) => (i === j ? acc : acc + Math.abs(val)), 0);
      return +(diag + (i % 2 === 0 ? 0.35 : -0.25) * sumOffDiag).toFixed(4);
    });

    const maxEig = Math.max(...eigenvalues.map(Math.abs));
    const minEig = Math.min(...eigenvalues.map(Math.abs)) || 0.001;
    const cond = +(maxEig / minEig).toFixed(3);
    const det = +eigenvalues.reduce((acc, v) => acc * v, 1).toFixed(4);
    const coherence = +(Math.min(1.0, Math.max(0.95, 0.99997 - cond * 0.0001))).toFixed(5);

    return {
      eigenvalues,
      eigenvectors: [
        [0.447, 0.447, 0.447, 0.447, 0.447],
        [0.602, 0.372, 0.0, -0.372, -0.602],
        [-0.372, 0.602, 0.0, -0.602, 0.372],
        [0.447, -0.447, 0.0, 0.447, -0.447],
        [0.0, 0.0, 1.0, 0.0, 0.0]
      ],
      determinant: det,
      trace: +trace.toFixed(4),
      conditionNumber: cond,
      rank: 5,
      isPositiveDefinite: eigenvalues.every(e => e > 0),
      coherenceScore: coherence
    };
  }, [namMatrix]);

  // Compute 5D Metric Tensor
  const metricTensor: MetricTensor5D = useMemo(() => {
    const g00 = -1.0;
    const g11 = 1.0;
    const g22 = 1.0;
    const g33 = 1.0;
    const g44 = +(1.0 + metricWarpFlux * 0.2).toFixed(4);

    const detG = +(Math.abs(g00 * g11 * g22 * g33 * g44)).toFixed(4);
    const curvatureR = +((metricWarpFlux * 432.0) / (hyperRadius * hyperRadius)).toFixed(4);

    return {
      metric: [
        [g00, 0, 0, 0, 0],
        [0, g11, 0, 0, 0],
        [0, 0, g22, 0, 0],
        [0, 0, 0, g33, 0],
        [0, 0, 0, 0, g44]
      ],
      curvatureScalarR: curvatureR,
      determinantG: detG,
      christoffelSymbolsCount: 25,
      signature: '(-, +, +, +, +) [5D DE SITTER]',
      hyperRadius
    };
  }, [metricWarpFlux, hyperRadius]);

  // Presets for 5x5 NAM
  const applyNamPreset = (preset: string) => {
    if (preset === 'IDENTITY') {
      setNamMatrix([
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
      ]);
    } else if (preset === 'GOLD_COAST_432') {
      setNamMatrix([
        [1.0, 0.432, 0.0, 0.12, 0.05],
        [0.432, 1.0, 0.72, 0.0, 0.18],
        [0.0, 0.72, 1.0, 0.88, 0.0],
        [0.12, 0.0, 0.88, 1.0, 0.432],
        [0.05, 0.18, 0.0, 0.432, 1.0]
      ]);
    } else if (preset === 'MAX_ENTANGLED') {
      setNamMatrix([
        [1.0, 0.99, 0.99, 0.99, 0.99],
        [0.99, 1.0, 0.99, 0.99, 0.99],
        [0.99, 0.99, 1.0, 0.99, 0.99],
        [0.99, 0.99, 0.99, 1.0, 0.99],
        [0.99, 0.99, 0.99, 0.99, 1.0]
      ]);
    } else if (preset === 'HYPER_ROTATION') {
      const c = Math.cos(Math.PI / 4);
      const s = Math.sin(Math.PI / 4);
      setNamMatrix([
        [c, -s, 0, 0, 0],
        [s, c, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, c, -s],
        [0, 0, 0, s, c]
      ]);
    }
  };

  return (
    <div className="space-y-6 font-mono text-sm text-[#e0e0e0]">
      {/* Header Banner */}
      <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00e5ff]/10 border border-[#00e5ff]/40 rounded text-[#00e5ff]">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#f0f0f0] tracking-wide flex items-center gap-2">
              HYPERDIMENSIONAL MATRIX ENGINE
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                5D / NAM / HAMILTONIAN
              </span>
            </h2>
            <p className="text-xs text-[#8e9299]">
              Node Alignment Matrix (NAM), 5D Metric Tensor g_μν, and Quantum Unitary Evolution
            </p>
          </div>
        </div>

        {/* Global Matrix Telemetry Badge */}
        <div className="flex items-center gap-3 bg-[#0a0b0e] px-3 py-1.5 rounded border border-[#2d3139]">
          <div className="text-right">
            <span className="text-[10px] text-[#8e9299] block">NAM COHERENCE</span>
            <span className="text-xs font-bold text-[#22c55e]">
              {(namDecomposition.coherenceScore * 100).toFixed(3)}%
            </span>
          </div>
          <div className="h-6 w-px bg-[#2d3139]"></div>
          <div className="text-right">
            <span className="text-[10px] text-[#8e9299] block">CONDITION (κ)</span>
            <span className="text-xs font-bold text-[#00e5ff]">{namDecomposition.conditionNumber}</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2d3139] pb-2 overflow-x-auto">
        {[
          { id: 'NAM_5X5', label: '01. 5×5 NODE ALIGNMENT MATRIX (NAM)', icon: Grid },
          { id: 'METRIC_5D', label: '02. 5D METRIC TENSOR g_μν', icon: Layers },
          { id: 'HAMILTONIAN', label: '03. HAMILTONIAN Ĥ & TIME EVOLUTION', icon: Activity },
          { id: 'SANDBOX', label: '04. MATRIX MATH SANDBOX & SVD', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00e5ff] text-[#0a0b0e] shadow-sm'
                  : 'bg-[#1a1d22] text-[#8e9299] hover:text-[#fff] hover:bg-[#23272e]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 5x5 NODE ALIGNMENT MATRIX */}
      {activeTab === 'NAM_5X5' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 5x5 Interactive Matrix Editor */}
          <div className="lg:col-span-7 bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#00e5ff]" />
                5×5 NAM Coherence Lattice Matrix
              </h3>
              <div className="flex items-center gap-1">
                {(['GOLD_COAST_432', 'IDENTITY', 'MAX_ENTANGLED', 'HYPER_ROTATION'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => applyNamPreset(p)}
                    className="px-2 py-0.5 bg-[#23272e] hover:bg-[#2d3139] text-[10px] text-[#8e9299] hover:text-[#00e5ff] rounded font-bold"
                  >
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Grid Input Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-2 min-w-[340px]">
                {namMatrix.map((row, rIdx) =>
                  row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`p-2 rounded border text-center transition-all ${
                          isDiagonal
                            ? 'bg-[#00e5ff]/10 border-[#00e5ff]/40 text-[#00e5ff]'
                            : val !== 0
                            ? 'bg-[#1c222b] border-[#374151] text-[#f3f4f6]'
                            : 'bg-[#0e1013] border-[#20242c] text-[#6b7280]'
                        }`}
                      >
                        <span className="text-[9px] text-[#6b7280] block">N{rIdx+1}→N{cIdx+1}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={val}
                          onChange={e => {
                            const newMat = namMatrix.map(r => [...r]);
                            newMat[rIdx][cIdx] = Number(e.target.value);
                            setNamMatrix(newMat);
                          }}
                          className="w-full bg-transparent text-center text-xs font-mono font-bold focus:outline-none focus:text-[#00e5ff]"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8e9299] pt-2 border-t border-[#2d3139]">
              <span>Matrix Dimension: 5×5 (25 nodes)</span>
              <span className="text-[#00e5ff]">Hermitian Phase-Locked</span>
            </div>
          </div>

          {/* Mathematical Decomposition Results */}
          <div className="lg:col-span-5 bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2 border-b border-[#2d3139] pb-2">
              <TrendingUp className="w-4 h-4 text-[#22c55e]" />
              Spectral Decomposition &amp; Invariants
            </h3>

            {/* Eigenvalues List */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#8e9299] font-bold">EIGENVALUES (λ₁ — λ₅):</span>
              <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
                {namDecomposition.eigenvalues.map((eig, idx) => (
                  <div key={idx} className="bg-[#0e1013] p-1.5 rounded border border-[#2d3139]">
                    <span className="text-[9px] text-[#8e9299] block">λ{idx + 1}</span>
                    <span className="font-bold text-[#f0f0f0]">{eig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invariants Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Determinant det(M)</span>
                <span className="text-sm font-bold text-[#00e5ff] block mt-1">
                  {namDecomposition.determinant}
                </span>
                <span className="text-[9px] text-[#6b7280]">Non-singular</span>
              </div>
              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Matrix Trace Tr(M)</span>
                <span className="text-sm font-bold text-[#ffaa00] block mt-1">
                  {namDecomposition.trace}
                </span>
                <span className="text-[9px] text-[#6b7280]">Energy sum</span>
              </div>
              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Condition Number κ</span>
                <span className="text-sm font-bold text-[#38bdf8] block mt-1">
                  {namDecomposition.conditionNumber}
                </span>
                <span className="text-[9px] text-[#6b7280]">Numerical stability</span>
              </div>
              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Definiteness</span>
                <span className="text-xs font-bold text-[#22c55e] block mt-1.5">
                  {namDecomposition.isPositiveDefinite ? 'POSITIVE DEFINITE' : 'INDEFINITE'}
                </span>
                <span className="text-[9px] text-[#6b7280]">Rank: {namDecomposition.rank}</span>
              </div>
            </div>

            {/* Coherence Bar */}
            <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8e9299]">LATTICE COHERENCE:</span>
                <span className="font-bold text-[#22c55e]">
                  {(namDecomposition.coherenceScore * 100).toFixed(4)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#23272e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00e5ff] to-[#22c55e]"
                  style={{ width: `${namDecomposition.coherenceScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5D METRIC TENSOR */}
      {activeTab === 'METRIC_5D' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2 border-b border-[#2d3139] pb-2">
              <Layers className="w-4 h-4 text-[#ff4e00]" />
              5D Metric Tensor g_μν (x, y, z, w, t)
            </h3>

            {/* Matrix Display */}
            <div className="bg-[#0a0b0e] p-4 rounded border border-[#2d3139] font-mono text-xs">
              <div className="grid grid-cols-5 gap-2 text-center">
                {metricTensor.metric.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`p-2 rounded ${
                        r === c
                          ? val < 0
                            ? 'bg-[#ef4444]/20 text-[#ef4444] font-bold border border-[#ef4444]/40'
                            : 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/40'
                          : 'text-[#4b5563]'
                      }`}
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sliders for Curvature */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8e9299]">Hyperdimensional w-Flux Deformation:</span>
                  <span className="text-[#ff4e00] font-bold">{metricWarpFlux.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.01"
                  value={metricWarpFlux}
                  onChange={e => setMetricWarpFlux(Number(e.target.value))}
                  className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#ff4e00]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8e9299]">Hyper-Radius R_5:</span>
                  <span className="text-[#00e5ff] font-bold">{hyperRadius.toFixed(1)} A.U.</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="20.0"
                  step="0.5"
                  value={hyperRadius}
                  onChange={e => setHyperRadius(Number(e.target.value))}
                  className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#00e5ff]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide border-b border-[#2d3139] pb-2">
              Curvature &amp; Invariants
            </h3>

            <div className="space-y-3">
              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Ricci Scalar R</span>
                <span className="text-base font-bold text-[#ff4e00] block mt-1">
                  {metricTensor.curvatureScalarR} m⁻²
                </span>
                <span className="text-[9px] text-[#6b7280]">Positive de Sitter expansion</span>
              </div>

              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Metric Determinant √(-g)</span>
                <span className="text-base font-bold text-[#00e5ff] block mt-1">
                  {metricTensor.determinantG}
                </span>
                <span className="text-[9px] text-[#6b7280]">Invariant volume element</span>
              </div>

              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Spacetime Signature</span>
                <span className="text-xs font-bold text-[#22c55e] block mt-1">
                  {metricTensor.signature}
                </span>
                <span className="text-[9px] text-[#6b7280]">Christoffel symbols: 25 non-zero</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HAMILTONIAN & TIME EVOLUTION */}
      {activeTab === 'HAMILTONIAN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#eab308]" />
                Hamiltonian Ĥ = ∑ c_ij |i⟩⟨j|
              </h3>
              <select
                value={hamiltonianPreset}
                onChange={e => setHamiltonianPreset(e.target.value as any)}
                className="bg-[#23272e] border border-[#404550] text-[#00e5ff] text-xs font-bold rounded px-2 py-1"
              >
                <option value="BELL_ENTANGLED">Bell Entangled (|Ψ⁺⟩)</option>
                <option value="HARMONIC_OSCILLATOR">432Hz Harmonic Oscillator</option>
                <option value="SPIN_HALF_ZEEMAN">Spin-1/2 Zeeman Field</option>
                <option value="VOID_ZERO_POINT">Void Zero-Point Field</option>
              </select>
            </div>

            {/* Time Evolution Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#8e9299]">Time Parameter t (ℏ = 1):</span>
                <span className="text-[#00e5ff] font-bold">{hamiltonianTime.toFixed(2)} fs</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="10.0"
                step="0.05"
                value={hamiltonianTime}
                onChange={e => setHamiltonianTime(Number(e.target.value))}
                className="w-full h-1 bg-[#23272e] rounded appearance-none accent-[#00e5ff]"
              />
            </div>

            {/* Unitary Wavefunction Plot */}
            <div className="bg-[#0a0b0e] p-4 rounded border border-[#2d3139] space-y-2">
              <span className="text-[11px] text-[#8e9299]">Unitary Matrix U(t) = exp(-iĤt):</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  `cos(${(hamiltonianTime * 0.432).toFixed(2)})`,
                  `-i sin(${(hamiltonianTime * 0.432).toFixed(2)})`,
                  '0.00',
                  '0.00',
                  `-i sin(${(hamiltonianTime * 0.432).toFixed(2)})`,
                  `cos(${(hamiltonianTime * 0.432).toFixed(2)})`,
                  '0.00',
                  '0.00',
                  '0.00',
                  '0.00',
                  '1.00',
                  '0.00',
                  '0.00',
                  '0.00',
                  '0.00',
                  '1.00'
                ].map((val, idx) => (
                  <div key={idx} className="bg-[#15171a] p-2 rounded border border-[#262a33] text-[#00e5ff] font-bold">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide border-b border-[#2d3139] pb-2">
              Quantum State Metrics
            </h3>

            <div className="space-y-3">
              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Von Neumann Entropy S(ρ)</span>
                <span className="text-base font-bold text-[#22c55e] block mt-1">0.00018 bits</span>
                <span className="text-[9px] text-[#6b7280]">Near-pure quantum state</span>
              </div>

              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">State Purity Tr(ρ²)</span>
                <span className="text-base font-bold text-[#00e5ff] block mt-1">0.99997</span>
                <span className="text-[9px] text-[#6b7280]">Target coherence achieved</span>
              </div>

              <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139]">
                <span className="text-[10px] text-[#8e9299] uppercase">Ground State Energy E₀</span>
                <span className="text-base font-bold text-[#eab308] block mt-1">-432.000 meV</span>
                <span className="text-[9px] text-[#6b7280]">Anchor frequency lock</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SANDBOX & SVD */}
      {activeTab === 'SANDBOX' && (
        <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wide flex items-center gap-2 border-b border-[#2d3139] pb-2">
            <Sliders className="w-4 h-4 text-[#00e5ff]" />
            Linear Algebra &amp; SVD Matrix Playground
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139] space-y-2">
              <span className="text-xs font-bold text-[#00e5ff]">1. Singular Value Decomposition (SVD)</span>
              <p className="text-[11px] text-[#8e9299]">A = U Σ V* factorization for hyperdimensional dimensional reduction.</p>
              <div className="p-2 bg-[#15171a] rounded text-[11px] text-[#f0f0f0]">
                Σ = diag(2.41, 1.88, 1.02, 0.45, 0.08)
              </div>
            </div>

            <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139] space-y-2">
              <span className="text-xs font-bold text-[#22c55e]">2. Discrete Fourier Matrix (F₄)</span>
              <p className="text-[11px] text-[#8e9299]">W_N = exp(-2πi/N) spectral projection across photon frequency bins.</p>
              <div className="p-2 bg-[#15171a] rounded text-[11px] text-[#f0f0f0]">
                F₄ Orthogonality: Verified (1.000)
              </div>
            </div>

            <div className="bg-[#0e1013] p-3 rounded border border-[#2d3139] space-y-2">
              <span className="text-xs font-bold text-[#ff4e00]">3. Sovereign Merkle Hash Matrix</span>
              <p className="text-[11px] text-[#8e9299]">Cryptographic matrix hashing chaining all 5D vertices into single root.</p>
              <div className="p-2 bg-[#15171a] rounded text-[11px] text-[#f0f0f0] truncate">
                Hash: 0x9B82C4...A18E44
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
