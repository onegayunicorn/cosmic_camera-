/**
 * Cosmic Camera V3.0.0 - Dual-Agent & Sovereign Orchestrator Types
 */

export type GateStatus = 
  | 'PASS'
  | 'HOLD'
  | 'BLOCK'
  | 'UNVERIFIED'
  | 'ROLLBACK_REQUIRED';

export type ProvenanceClass = 
  | 'SIMULATED'
  | 'RECONSTRUCTED'
  | 'MEASURED'
  | 'DERIVED'
  | 'REFERENCE'
  | 'UNKNOWN';

export type GateStage =
  | 'DEVELOPMENT'
  | 'INTEGRATION'
  | 'SECURITY'
  | 'STAGING'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'LIVE'
  | 'PARITY';

export interface Gate {
  id: string;
  stage: GateStage;
  title: string;
  category: 'SOFTWARE' | 'HARDWARE' | 'LIVE';
  status: GateStatus;
  owner: string;
  timestamp: string;
  commitSha: string;
  buildId: string;
  testId?: string;
  deviceId?: string;
  environment: string;
  provenance: ProvenanceClass;
  description: string;
  measurements?: Record<string, any>;
  expectedValues?: Record<string, any>;
  actualValues?: Record<string, any>;
  tolerance?: number;
  evidenceUri?: string;
  evidenceHash?: string;
  reviewer?: string;
  decision?: string;
  logs?: string[];
}

export interface Evidence {
  id: string;
  release: string;
  gate: string;
  status: GateStatus;
  provenance: ProvenanceClass;
  deviceId?: string;
  testId?: string;
  measurementRef?: string;
  evidenceHash: string;
  timestamp: string;
  signedBy: string;
  payload: Record<string, any>;
}

export interface Incident {
  id: string;
  release: string;
  gate: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  observedFailure: string;
  expectedBehavior: string;
  evidence?: any;
  environment: string;
  commit: string;
  device?: string;
  probableCause?: string;
  remediation?: string;
  owner: string;
  timestamp: string;
  retestRequired: boolean;
  rollbackRequired: boolean;
  status: 'OPEN' | 'RESOLVED';
}

export interface ReleaseManifest {
  version: string;
  timestamp: string;
  software: Record<string, GateStatus>;
  hardware: Record<string, GateStatus>;
  live: Record<string, GateStatus>;
  controls: {
    hardware_control: 'ENABLED' | 'DISABLED';
    raw_media_persistence: 'ENABLED' | 'DISABLED';
  };
  overall: {
    status: GateStatus;
    provenance_required: boolean;
  };
  signature?: string;
  merkleRoot?: string;
}

export interface ReleaseState {
  version: string;
  gates: Gate[];
  overallStatus: GateStatus;
  provenanceRequired: boolean;
  hardwareControl: 'ENABLED' | 'DISABLED';
  rawMediaPersistence: 'ENABLED' | 'DISABLED';
  manifest: ReleaseManifest;
  merkleRoot: string;
  governorSignature?: string;
  sealedTimestamp?: string;
  incidents: Incident[];
  messages: AgentMessage[];
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  sender: 'RELEASE_GOVERNOR' | 'VALIDATION_ENGINEER' | 'SYSTEM';
  type: 'TASK' | 'EVIDENCE' | 'REVIEW' | 'BLOCK' | 'INCIDENT' | 'LOG';
  gate?: string;
  title: string;
  content: string;
  provenance?: ProvenanceClass;
  payload?: any;
}

// Photon & PnP-ADMM Types
export interface PhotonConfig {
  flux: number; // photons / pixel (e.g., 0.1 - 30.0)
  rho: number; // ADMM penalty parameter (0.1 - 10.0)
  lambda: number; // denoiser strength (0.01 - 1.0)
  iterations: number; // N_iter: 1 - 50
  epsilon: number; // convergence threshold 1e-4
  exposureTimeMs: number; // sensor exposure time in ms (1 - 1000 ms)
  sensorGainDb: number; // analog/digital sensor gain in dB (0 - 36 dB)
  tecTempC: number; // -25°C to +35°C
  fovAngle: 68 | 72 | 78.4 | 110 | 120 | 145;
  sensorModel: string; // "Sony IMX571 (26MP)"
}

export interface FpgaTelemetry {
  lutUtilizationPct: number;
  dspUtilizationPct: number;
  bramUtilizationPct: number;
  clockFreqMhz: number;
  axiThroughputGbps: number;
  powerWatts: number;
  stepLatencyMs: number;
  pipelineState: 'ACTIVE' | 'IDLE' | 'STALLED';
}

export interface SensorTelemetry {
  actualTempC: number;
  targetTempC: number;
  heatsinkTempC: number;
  darkCurrentE: number;
  effectiveReadNoiseE: number;
  totalPhotonEvents: number;
  peakPixelCount: number;
  fanoFactor: number;
  snrEstDb: number;
}

export interface AdmmIterationMetrics {
  iteration: number;
  primalResidual: number;
  dualResidual: number;
  psnr: number;
  ssim: number;
  snrDb: number;
  objectiveLoss: number;
  executionTimeMs: number;
}

// Sovereign 11 Engines Types
export type EngineId = 
  | 'ALCHEMICAL'
  | 'GEOMETRY_5D'
  | 'BLOCH_SPHERE'
  | 'SINGULARITY'
  | 'REALITY_V2'
  | 'PHOENIX'
  | 'PHOTONIC'
  | 'QUANTUM_SIM'
  | 'ENTANGLEMENT'
  | 'AGENT_CORE'
  | 'GENEWEAVER';

export interface SovereignEngineState {
  id: EngineId;
  name: string;
  version: string;
  status: 'ACTIVE' | 'CALIBRATING' | 'HALTED';
  coherence: number; // >= 0.99997
  merkleRoot: string;
  lastActionTime: string;
  metrics: Record<string, any>;
  history: Array<{ action: string; timestamp: string; hash: string; resultSummary: string }>;
}

// J09 Bio-Resonance Types
export interface J09BioReading {
  seq: number;
  ts_ns: number;
  heartRateBpm: number;
  hrvMs: number;
  spo2Pct: number;
  skinTempC: number;
  tempDeviation: number;
  bioElectricIndex: number;
  motionState: 'STILL' | 'ACTIVE' | 'SLEEP';
  dnaResonanceIndex: number;
  rfCorrelationScore: number;
  pqcSignature: string;
  pqcVerified: boolean;
  udpIngestStatus: 'DELIVERED' | 'DROPPED' | 'QUEUED';
  redisKey: string;
}

export * from './extended';
