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
  vx?: number;
  vy?: number;
  lastDragTime?: number;
  renderCount?: number;
}

// ==========================================
// 5. WINDOW DYNAMICS DEBUGGER TYPES
// ==========================================
export interface WindowPhysicsState {
  fps: number;
  frameTimeMs: number;
  totalRedraws: number;
  activeWindowCount: number;
  draggedWindowId: string | null;
  velocityVectors: Record<string, { vx: number; vy: number; speed: number }>;
  collisionIntersections: Array<{ idA: string; idB: string; overlapAreaPx: number }>;
  snapActive: boolean;
  snapTargetZone: 'NONE' | 'LEFT_HALF' | 'RIGHT_HALF' | 'TOP_HALF' | 'BOTTOM_HALF' | 'QUAD_1' | 'QUAD_2' | 'QUAD_3' | 'QUAD_4' | 'MAXIMIZE';
  magneticDistancePx: number;
  springDamping: number;
  boundaryCollisions: number;
  dragEventLog: Array<{ timestamp: string; windowId: string; type: 'DRAG_START' | 'DRAGGING' | 'DRAG_END' | 'SNAP' | 'RESIZE' | 'CASCADE'; x: number; y: number }>;
}

// ==========================================
// 6. GOD MODE VFS & MASTER OVERRIDE TYPES
// ==========================================
export interface GodModeFileNode {
  id: string;
  path: string;
  name: string;
  type: 'FILE' | 'DIRECTORY' | 'DEVICE_NODE' | 'SYS_CONTROL' | 'MEMORY_MAP';
  sizeBytes: number;
  permissions: string; // "rwxr-xr-x"
  owner: string; // "root" / "godmode"
  uid: number; // 0
  lastModified: string;
  content: string;
  isProtected: boolean;
  merkleProofHash: string;
}

export interface GodModeOverrideState {
  godModeActive: boolean;
  masterAuthToken: string;
  emergencyLockdownBypassed: boolean;
  allGatesForcedPass: boolean;
  memoryInjectionAddress: string;
  memoryBufferHex: string;
  quantumDecoherenceSuppressed: boolean;
  thermalThrottlingBypassed: boolean;
  rawJsonExportReady: boolean;
}

// ==========================================
// 7. RASPBERRY PI INTEGRATION TYPES
// ==========================================
export type RPiModel = 'RPI_5_8GB' | 'RPI_4_B' | 'RPI_CM4_DUAL_CSI' | 'RPI_ZERO_2_W';

export interface RPiGpioPin {
  pinNumber: number; // 1 to 40
  bcmNumber: number | null; // BCM GPIO 0-27 or null for power/ground
  name: string;
  type: '3V3_PWR' | '5V_PWR' | 'GND' | 'GPIO' | 'I2C_SDA' | 'I2C_SCL' | 'SPI_MOSI' | 'SPI_MISO' | 'SPI_SCLK' | 'SPI_CE0' | 'SPI_CE1' | 'UART_TX' | 'UART_RX' | 'PWM0' | 'PWM1';
  direction: 'IN' | 'OUT' | 'ALT_FUNC';
  state: 'HIGH' | 'LOW' | 'HIGH_Z' | 'PWM';
  voltage: number; // 3.3, 5.0, 0
  pwmDutyPercent?: number;
  pull: 'UP' | 'DOWN' | 'NONE';
  description: string;
}

export interface RPiI2cDevice {
  addressHex: string; // e.g. "0x3C"
  deviceType: string; // "SSD1306 OLED", "MPU6050 IMU", "BME280 Environment", "PCA9685 PWM"
  bus: number; // 1
  status: 'ONLINE' | 'STANDBY' | 'DMA_TRANSFER';
  dataRegister: string;
}

export interface RPiCameraRibbonState {
  cameraType: 'PI_CAM_V3_IMX708_AUTOFOCUS' | 'PI_HQ_IMX477_12MP' | 'PI_GLOBAL_SHUTTER_IMX296' | 'DUAL_CSI_STEREO';
  csiPort: 'CSI_0' | 'CSI_1' | 'DUAL_SYNC';
  resolution: string;
  framerate: number;
  autofocusMode: 'CONTINUOUS' | 'MANUAL' | 'HYPERFOCAL';
  focusDistanceMeters: number;
  rawBayerLaneWidth: number; // 2-lane or 4-lane MIPI CSI-2
  dmaThroughputMbps: number;
  active: boolean;
}

export interface RPiSystemTelemetry {
  model: RPiModel;
  soc: string; // BCM2712 / BCM2711
  cpuTempC: number;
  throttleState: 'NORMAL' | 'UNDERVOLTAGE_WARNING' | 'THROTTLED' | 'THERMAL_LIMIT';
  armFreqMhz: number;
  gpuFreqMhz: number;
  ramUsageMb: number;
  totalRamMb: number;
  gpuMemorySplitMb: number;
  fanSpeedRpm: number;
  uartBaud: number;
  gpioPins: RPiGpioPin[];
  i2cDevices: RPiI2cDevice[];
  cameraRibbon: RPiCameraRibbonState;
  serialLogs: string[];
}
