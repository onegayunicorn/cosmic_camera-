/**
 * Cosmic Camera V3.0.0 — Extended Types
 * Covers: Dual Camera Modules, Matrix Engine, Driver & CPU, Desktop Windows System, and Multi-Platform Scaling
 */

// ==========================================
// 1. DUAL CAMERA & INFINITY LINK TYPES
// ==========================================
export type CameraFacing = 'user' | 'environment' | 'synthetic_quantum' | 'stereo_disparity';

export interface CameraStreamState {
  facing: CameraFacing;
  resolution: '4K_UHD' | '1080P_FHD' | '720P_HD' | 'RAW_BAYER_26MP';
  width: number;
  height: number;
  fps: number;
  iso: number;
  shutterSpeedMs: number;
  opticalGainDb: number;
  filterMode: 'NATURAL' | 'PHOTON_PNP' | 'EDGE_TENSOR' | 'LUX_RADIANCE' | 'QUANTUM_PHASE' | 'THERMAL_FALSE_COLOR';
  active: boolean;
  stream: MediaStream | null;
  deviceId: string;
  label: string;
  snrEstDb: number;
  luxDominance: number; // [0, 1]
  shadowDecoherence: number; // [0, 1]
}

export interface InfinityLinkState {
  locked: boolean;
  pllPhaseErrorDeg: number;
  entanglementCoeff: number; // [0.0 - 1.0], >= 0.99997 target
  bidirectionalFluxGbps: number;
  photonTransferRateMcps: number; // Megacounts per second
  quantumNodeA: string;
  quantumNodeB: string;
  merkleSeal: string;
  syncTimestamp: number;
}

// ==========================================
// 2. MATRIX ENGINE TYPES
// ==========================================
export interface MatrixDecomposition {
  eigenvalues: number[];
  eigenvectors: number[][];
  determinant: number;
  trace: number;
  conditionNumber: number;
  rank: number;
  isPositiveDefinite: boolean;
  coherenceScore: number;
}

export interface MetricTensor5D {
  metric: number[][]; // 5x5 g_mu_nu
  curvatureScalarR: number;
  determinantG: number;
  christoffelSymbolsCount: number;
  signature: string; // "(-,+,+,+,+)" 5D de Sitter / Minkowski extension
  hyperRadius: number;
}

export interface QuantumHamiltonian {
  dim: number; // 2 to 8
  matrixReal: number[][];
  matrixImag: number[][];
  groundStateEnergy: number;
  vonNeumannEntropy: number;
  timeEvolutionT: number;
  purity: number; // Tr(rho^2)
}

// ==========================================
// 3. DRIVER & CPU INTEGRATION TYPES
// ==========================================
export type CpuGovernor = 'PERFORMANCE' | 'POWERSAVE' | 'SCHEDUTIL' | 'QUANTUM_COHERENCE' | 'BURST_RECON';

export interface CpuCoreState {
  coreId: number;
  type: 'P-CORE' | 'E-CORE';
  freqGhz: number;
  loadPct: number;
  tempC: number;
  voltageV: number;
  assignedThread: string;
  instructionsPerCycle: number;
}

export interface DriverState {
  id: string;
  name: string;
  category: 'CAMERA_ISP' | 'FPGA_PCIE' | 'TEC_PID' | 'I2C_SENSOR' | 'CRYPTO_HW';
  version: string;
  kernelHandle: string;
  status: 'ONLINE' | 'STANDBY' | 'DMA_ACTIVE' | 'CALIBRATING' | 'ERROR';
  dmaThroughputMbps: number;
  irqLatencyUs: number;
  bufferRingSize: number;
  droppedFrames: number;
  thermalStatus: string;
}

export interface CpuSubsystemState {
  totalUsagePct: number;
  packagePowerWatts: number;
  packageTempC: number;
  governor: CpuGovernor;
  simdVectorEngine: 'AVX-512_FMA' | 'ARM_NEON_V2' | 'TENSOR_CORE_FP16';
  tflopsCalculated: number;
  l1CacheHitPct: number;
  l2CacheHitPct: number;
  l3CacheHitPct: number;
  memoryBandwidthGbps: number;
  cores: CpuCoreState[];
}

// ==========================================
// 4. DESKTOP WINDOWS & MULTI-PLATFORM TYPES
// ==========================================
export type PlatformPreset = 
  | 'WINDOWS_DESKTOP' // 1920x1080 / 2560x1440
  | 'ANDROID_A17'     // 390x844 (Samsung A17 Mobile)
  | 'WRIST_DIGITAL_TWIN' // 410x502 (Smartwatch / Wrist Mesh)
  | 'ULTRAWIDE_DOME'  // 3440x1440 21:9
  | 'RESPONSIVE_AUTO';

export interface DesktopWindow {
  id: string;
  title: string;
  iconName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  pinned: boolean;
  opacity: number;
}
