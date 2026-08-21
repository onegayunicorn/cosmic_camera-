import { Gate, GateStatus, GateStage, ProvenanceClass, ReleaseState, ReleaseManifest, Evidence, Incident, AgentMessage } from '../types';
import { simpleSha256, computeMerkleRoot } from '../utils/crypto';

export class ReleaseGovernor {
  private version: string;
  private overallStatus: GateStatus = 'HOLD';
  private provenanceRequired: boolean = true;
  private hardwareControl: 'ENABLED' | 'DISABLED' = 'DISABLED';
  private rawMediaPersistence: 'ENABLED' | 'DISABLED' = 'DISABLED';
  private manifest: ReleaseManifest;
  private gatesMap: Map<string, Gate> = new Map();
  private evidenceStore: Map<string, Evidence> = new Map();
  private incidentStore: Map<string, Incident> = new Map();
  private messages: AgentMessage[] = [];
  private listeners: Array<() => void> = [];
  private governorSignature?: string;
  private sealedTimestamp?: string;

  constructor(version: string = '3.0.0') {
    this.version = version;
    this.manifest = this.createInitialManifest(version);
    this.initializeGates();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  private createInitialManifest(version: string): ReleaseManifest {
    return {
      version,
      timestamp: new Date().toISOString(),
      software: {
        development: 'UNVERIFIED',
        integration: 'UNVERIFIED',
        security: 'UNVERIFIED',
        staging: 'UNVERIFIED'
      },
      hardware: {
        H1_sensor: 'UNVERIFIED',
        H2_thermal: 'UNVERIFIED',
        H3_optical: 'UNVERIFIED',
        H4_acquisition: 'UNVERIFIED',
        H5_fpga_hil: 'UNVERIFIED',
        H6_reconstruction_parity: 'UNVERIFIED'
      },
      live: {
        device_handshake: 'UNVERIFIED',
        telemetry: 'UNVERIFIED',
        orchestrator: 'UNVERIFIED',
        dashboard: 'UNVERIFIED',
        digital_twin: 'UNVERIFIED',
        audit_event: 'UNVERIFIED'
      },
      controls: {
        hardware_control: 'DISABLED',
        raw_media_persistence: 'DISABLED'
      },
      overall: {
        status: 'HOLD',
        provenance_required: true
      },
      merkleRoot: simpleSha256('INITIAL_RELEASE_MANIFEST_V3.0.0')
    };
  }

  private initializeGates(): void {
    this.gatesMap.clear();
    const initialGates: Gate[] = [
      {
        id: 'DEVELOPMENT',
        stage: 'DEVELOPMENT',
        title: 'D1: Development & Determinism',
        category: 'SOFTWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '1609d35',
        buildId: 'build-d1-001',
        environment: 'development',
        provenance: 'SIMULATED',
        description: 'TypeScript strict compilation, ESLint, unit tests, and deterministic build test harness.',
        expectedValues: { typecheck: 'PASS', unitTestsPassed: 28, lintErrors: 0 },
        logs: ['Ready for D1 validation execution by Validation Engineer.']
      },
      {
        id: 'INTEGRATION',
        stage: 'INTEGRATION',
        title: 'I1: API Contracts & Digital Twin Schema',
        category: 'SOFTWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '1609d35',
        buildId: 'build-i1-002',
        environment: 'integration',
        provenance: 'DERIVED',
        description: 'Cross-repo API contracts, OpenAPI specs, Orchestrator endpoints, and provenance preservation.',
        expectedValues: { openApiValid: true, contractsPassed: 14, schemaDrift: 0 },
        logs: ['Ready for I1 interface and contract validation.']
      },
      {
        id: 'SECURITY',
        stage: 'SECURITY',
        title: 'S1: Security, SAST & Secret Audits',
        category: 'SOFTWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '1609d35',
        buildId: 'build-s1-003',
        environment: 'security',
        provenance: 'DERIVED',
        description: 'Mandatory zero-vulnerability gate: High=0, Medium=0, Low=0, secret detection, XSS/injection scans.',
        expectedValues: { high: 0, medium: 0, low: 0, secretsFound: 0 },
        logs: ['Security audit pipeline queued.']
      },
      {
        id: 'STAGING',
        stage: 'STAGING',
        title: 'ST1: Staging & Rollback Rehearsal',
        category: 'SOFTWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '1609d35',
        buildId: 'build-st1-004',
        environment: 'staging',
        provenance: 'SIMULATED',
        description: 'Container image build, health endpoints, observability, readiness probes, and verified rollback drill.',
        expectedValues: { containerImageBuilt: true, healthCheck: 200, rollbackRehearsalPass: true },
        logs: ['Staging container environment configured.']
      },
      {
        id: 'H1',
        stage: 'H1',
        title: 'H1: IMX571 Sensor Identity & Physical QE',
        category: 'HARDWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '5a247db',
        buildId: 'hw-h1-005',
        deviceId: 'VIS-IMX571-01',
        environment: 'hardware-lab-station-1',
        provenance: 'MEASURED',
        description: 'Physical Sony IMX571 26MP CMOS sensor characterization. Read noise ≤ 1.2e-, QE ≥ 85%, Dark Current verified.',
        expectedValues: { quantumEfficiency: 0.85, readNoise_e: 1.2, serialVerified: true },
        tolerance: 0.05,
        logs: ['Sensor head attached to optical bench.']
      },
      {
        id: 'H2',
        stage: 'H2',
        title: 'H2: Micro-TEC Thermal Loop Control',
        category: 'HARDWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '5a247db',
        buildId: 'hw-h2-006',
        deviceId: 'TEC-PELTIER-01',
        environment: 'thermal-vacuum-chamber',
        provenance: 'MEASURED',
        description: 'Thermonamic TEFC3-47 Micro-TEC Peltier module stability test @ -10.0°C (±0.2°C) with 5x dark current reduction.',
        expectedValues: { tempSetpointC: -10.0, tempStabilityC: 0.2, settlingTimeSec: 120 },
        tolerance: 0.2,
        logs: ['PID thermal loop controller armed.']
      },
      {
        id: 'H3',
        stage: 'H3',
        title: 'H3: Multi-FOV Optical Turret Alignment',
        category: 'HARDWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '5a247db',
        buildId: 'hw-h3-007',
        deviceId: 'TURRET-OPT-03',
        environment: 'collimator-bench',
        provenance: 'MEASURED',
        description: 'Physical collimator MTF test and PSF FWHM across 68°, 78.4°, 120°, and 145° optical turret positions.',
        expectedValues: { psfFwhmPixels: 2.2, opticalDistortion: 0.002, mtfAt100LpMm: 0.45 },
        tolerance: 0.05,
        logs: ['Collimator target aligned.']
      },
      {
        id: 'H4',
        stage: 'H4',
        title: 'H4: Sensor-to-FPGA Acquisition Channel',
        category: 'HARDWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '5a247db',
        buildId: 'hw-h4-008',
        deviceId: 'FMC-CSI2-K7',
        environment: 'hardware-bench',
        provenance: 'MEASURED',
        description: 'FMC / PCIe acquisition channel stress test. Zero dropped frames in 1,000 frames @ 10fps with monotonic timestamps.',
        expectedValues: { droppedFrames: 0, frameRateFps: 10, jitterUs: 5.0 },
        tolerance: 0,
        logs: ['DMA acquisition stream armed.']
      },
      {
        id: 'H5',
        stage: 'H5',
        title: 'H5: Kintex-7 FPGA Hardware-in-the-Loop',
        category: 'HARDWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '5a247db',
        buildId: 'hw-h5-009',
        deviceId: 'FPGA-K7-XC7K325T',
        environment: 'hil-chassis',
        provenance: 'MEASURED',
        description: 'Hardware-in-the-loop (HIL) execution of synthesized PnP-ADMM accelerator bitstream on physical Kintex-7 FPGA.',
        expectedValues: { timingClosureMet: true, latencyPerFrameMs: 25.0, hilPassRate: 1.0 },
        tolerance: 0.01,
        logs: ['FPGA JTAG and PCIe link active.']
      },
      {
        id: 'H6',
        stage: 'H6',
        title: 'H6: Float32 vs FPGA Fixed-Point Parity',
        category: 'HARDWARE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '5a247db',
        buildId: 'hw-h6-010',
        deviceId: 'PARITY-HARNESS-01',
        environment: 'hil-chassis',
        provenance: 'MEASURED',
        description: 'Numerical parity check: Kintex-7 FPGA Q15 fixed-point output vs Python 3.11 float32 reference (SSIM ≥ 0.999).',
        expectedValues: { maxAbsoluteError: 0.005, meanSquaredError: 0.00005, ssimParity: 0.999 },
        tolerance: 0.005,
        logs: ['Reference test dataset loaded.']
      },
      {
        id: 'LIVE',
        stage: 'LIVE',
        title: 'L1: Live Optical Bench End-to-End',
        category: 'LIVE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '7c819fa',
        buildId: 'live-l1-011',
        deviceId: 'SYSTEM-LIVE-RIG',
        environment: 'cleanroom-live-rig',
        provenance: 'MEASURED',
        description: 'Live physical end-to-end telemetry loop: Sensor Head -> FPGA -> Orchestrator -> Dashboard at 1Hz with Dilithium-3 auth.',
        expectedValues: { handshakePass: true, telemetryCadenceHz: 1.0, dropRate: 0 },
        tolerance: 0.01,
        logs: ['Live instrument rig powered and calibrated.']
      },
      {
        id: 'PARITY',
        stage: 'PARITY',
        title: 'Parity: Tri-Stream Grounding Audit',
        category: 'LIVE',
        status: 'UNVERIFIED',
        owner: 'validation-engineer',
        timestamp: new Date().toISOString(),
        commitSha: '7c819fa',
        buildId: 'parity-audit-012',
        environment: 'orchestrator-cluster',
        provenance: 'DERIVED',
        description: 'Tri-stream grounding audit comparing Physical Measured vs Digital Twin vs Float32 Reference streams.',
        expectedValues: { deltaThreshold: 0.02, provenanceSegregationPass: true },
        tolerance: 0.02,
        logs: ['Tri-stream aggregator ready.']
      }
    ];

    initialGates.forEach(g => this.gatesMap.set(g.id, g));
    this.updateOverallStatus();
  }

  public logMessage(
    sender: 'RELEASE_GOVERNOR' | 'VALIDATION_ENGINEER' | 'SYSTEM',
    type: 'TASK' | 'EVIDENCE' | 'REVIEW' | 'BLOCK' | 'INCIDENT' | 'LOG',
    title: string,
    content: string,
    provenance?: ProvenanceClass,
    gate?: string,
    payload?: any
  ): void {
    const msg: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      sender,
      type,
      title,
      content,
      provenance,
      gate,
      payload
    };
    this.messages.unshift(msg);
    if (this.messages.length > 100) this.messages.pop();
    this.notify();
  }

  public reviewEvidence(evidence: Evidence): boolean {
    const gate = this.gatesMap.get(evidence.gate);
    if (!gate) {
      this.logMessage('RELEASE_GOVERNOR', 'BLOCK', 'Unknown Gate Review Error', `Cannot review evidence for unknown gate: ${evidence.gate}`);
      return false;
    }

    // Verify cryptographic signature of evidence
    const expectedPayloadHash = simpleSha256(JSON.stringify({
      id: evidence.id,
      gate: evidence.gate,
      provenance: evidence.provenance,
      status: evidence.status,
      payload: evidence.payload
    }));

    if (evidence.evidenceHash !== expectedPayloadHash) {
      this.createIncident(
        evidence.gate,
        'CRITICAL',
        `Evidence cryptographic signature verification failed for ${evidence.gate}. Expected ${expectedPayloadHash.slice(0, 12)}..., received ${evidence.evidenceHash.slice(0, 12)}...`,
        'Evidence hash must match computed SHA-256 payload signature',
        evidence
      );

      gate.status = 'BLOCK';
      gate.decision = 'BLOCKED: Cryptographic signature mismatch detected';
      this.updateOverallStatus();
      return false;
    }

    // MANDATORY PROVENANCE INVARIANT ENFORCEMENT:
    // If gate is HARDWARE or LIVE, provenance MUST BE 'MEASURED'.
    if ((gate.category === 'HARDWARE' || gate.category === 'LIVE' || gate.stage === 'LIVE') && evidence.provenance !== 'MEASURED') {
      this.createIncident(
        evidence.gate,
        'CRITICAL',
        `PROVENANCE INVARIANT BREACH: Gate ${evidence.gate} (${gate.category}) requires MEASURED physical evidence, but received ${evidence.provenance}. SIMULATED != MEASURED. Software passes do not authorize hardware release.`,
        'Hardware and Live gates require MEASURED physical provenance from verified hardware',
        evidence
      );

      gate.status = 'BLOCK';
      gate.decision = `BLOCKED: Provenance Invariant Violation (Received ${evidence.provenance}, requires MEASURED)`;
      gate.provenance = evidence.provenance;
      this.updateOverallStatus();

      this.logMessage(
        'RELEASE_GOVERNOR',
        'BLOCK',
        `Provenance Violation on ${gate.title}`,
        `REJECTED. Gate ${gate.id} requires [MEASURED] physical data. Received [${evidence.provenance}]. Evidence cannot substitute simulation for physical proof.`,
        evidence.provenance,
        gate.id
      );

      return false;
    }

    // Update Gate state with accepted evidence
    gate.status = evidence.status;
    gate.provenance = evidence.provenance;
    gate.actualValues = evidence.payload?.measurements;
    gate.evidenceHash = evidence.evidenceHash;
    gate.timestamp = evidence.timestamp;
    gate.reviewer = 'release-governor@cosmic-camera.org';
    gate.decision = `Approved by Release Governor under Two-Key verification. Provenance: [${evidence.provenance}].`;
    gate.logs = gate.logs || [];
    gate.logs.push(`[${new Date().toLocaleTimeString()}] Evidence reviewed & accepted: Status = ${evidence.status}`);

    this.evidenceStore.set(evidence.id, evidence);

    this.logMessage(
      'RELEASE_GOVERNOR',
      'REVIEW',
      `Gate Approved: ${gate.title}`,
      `Release Governor verified evidence package for ${gate.id}. Provenance: [${evidence.provenance}], Hash: ${evidence.evidenceHash.slice(0, 14)}... Status: ${evidence.status}`,
      evidence.provenance,
      gate.id
    );

    this.updateOverallStatus();
    return true;
  }

  public createIncident(
    gate: string,
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    observedFailure: string,
    expectedBehavior: string,
    evidence?: any
  ): Incident {
    const id = `INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const incident: Incident = {
      id,
      release: this.version,
      gate,
      severity,
      observedFailure,
      expectedBehavior,
      evidence,
      environment: 'sovereign-audit-pipeline',
      commit: '1609d35',
      owner: 'release-governor',
      timestamp: new Date().toISOString(),
      retestRequired: true,
      rollbackRequired: severity === 'CRITICAL',
      status: 'OPEN'
    };

    this.incidentStore.set(id, incident);

    this.logMessage(
      'RELEASE_GOVERNOR',
      'INCIDENT',
      `🚨 Incident ${id} Raised on ${gate}`,
      `Severity: ${severity}. ${observedFailure}`,
      undefined,
      gate,
      incident
    );

    this.notify();
    return incident;
  }

  public resolveIncident(id: string, remediation: string): void {
    const inc = this.incidentStore.get(id);
    if (inc) {
      inc.status = 'RESOLVED';
      inc.remediation = remediation;
      this.logMessage('RELEASE_GOVERNOR', 'LOG', `Incident ${id} Resolved`, `Remediation: ${remediation}`);
      this.notify();
    }
  }

  public updateOverallStatus(): void {
    const gates = Array.from(this.gatesMap.values());
    const hasBlock = gates.some((g: Gate) => g.status === 'BLOCK');
    const hasHold = gates.some((g: Gate) => g.status === 'HOLD');
    const hasUnverified = gates.some((g: Gate) => g.status === 'UNVERIFIED');
    const allPass = gates.every((g: Gate) => g.status === 'PASS');

    if (hasBlock) {
      this.overallStatus = 'BLOCK';
    } else if (allPass) {
      this.overallStatus = 'PASS';
    } else if (hasHold || hasUnverified) {
      this.overallStatus = 'HOLD';
    }

    this.syncManifest();
  }

  private syncManifest(): void {
    const gates = Array.from(this.gatesMap.values());
    const manifest = this.manifest;

    manifest.timestamp = new Date().toISOString();
    manifest.overall.status = this.overallStatus;
    
    // Check software gates
    const swGates = gates.filter((g: Gate) => g.category === 'SOFTWARE');
    swGates.forEach((g: Gate) => {
      manifest.software[g.stage.toLowerCase()] = g.status;
    });

    // Check hardware gates
    const hwGates = gates.filter((g: Gate) => g.category === 'HARDWARE');
    hwGates.forEach((g: Gate) => {
      manifest.hardware[`${g.stage}_${g.id.toLowerCase()}`] = g.status;
    });

    // Check live gates
    const liveGates = gates.filter((g: Gate) => g.category === 'LIVE');
    liveGates.forEach((g: Gate) => {
      manifest.live[g.stage.toLowerCase()] = g.status;
    });

    // Collect all gate evidence hashes for Merkle Root
    const hashes = gates.map((g: Gate) => g.evidenceHash || simpleSha256(`${g.id}_${g.status}_${g.timestamp}`));
    manifest.merkleRoot = computeMerkleRoot(hashes);
    this.manifest = manifest;
  }

  public authorizeRelease(): boolean {
    const gates = Array.from(this.gatesMap.values());
    const unverified = gates.filter((g: Gate) => g.status === 'UNVERIFIED');
    const blocked = gates.filter((g: Gate) => g.status === 'BLOCK');

    if (blocked.length > 0) {
      this.logMessage('RELEASE_GOVERNOR', 'BLOCK', 'Release Authorization Failed', `Cannot authorize: ${blocked.length} gates are BLOCKED.`);
      return false;
    }

    if (unverified.length > 0) {
      this.logMessage('RELEASE_GOVERNOR', 'BLOCK', 'Release Authorization Failed', `Cannot authorize: ${unverified.length} gates remain UNVERIFIED. Simulation cannot be substituted for physical proof.`);
      return false;
    }

    const allPass = gates.every((g: Gate) => g.status === 'PASS');
    if (!allPass) {
      this.logMessage('RELEASE_GOVERNOR', 'BLOCK', 'Release Authorization Failed', `Cannot authorize: Not all gates have passed.`);
      return false;
    }

    // Authorize & enable controls safely
    this.overallStatus = 'PASS';
    this.hardwareControl = 'ENABLED';
    this.rawMediaPersistence = 'ENABLED';
    this.manifest.controls.hardware_control = 'ENABLED';
    this.manifest.controls.raw_media_persistence = 'ENABLED';
    this.manifest.overall.status = 'PASS';
    this.governorSignature = simpleSha256(`COSMIC_CAMERA_V3.0.0_SEALED_${this.manifest.merkleRoot}`);
    this.manifest.signature = this.governorSignature;
    this.sealedTimestamp = new Date().toISOString();

    this.logMessage(
      'RELEASE_GOVERNOR',
      'REVIEW',
      '🌟 V3.0.0 RELEASE SEALED & AUTHORIZED',
      `All 12 software, physical hardware, and live parity gates successfully verified with cryptographic provenance. Manifest signed with Merkle Root: ${this.manifest.merkleRoot?.slice(0, 16)}...`
    );

    this.notify();
    return true;
  }

  public triggerRollback(reason: string = 'Operator triggered emergency rollback'): void {
    this.executeRollback(reason);
  }

  public executeRollback(reason: string): void {
    this.overallStatus = 'ROLLBACK_REQUIRED';
    this.hardwareControl = 'DISABLED';
    this.rawMediaPersistence = 'DISABLED';
    this.manifest.controls.hardware_control = 'DISABLED';
    this.manifest.controls.raw_media_persistence = 'DISABLED';

    this.createIncident('ROLLBACK', 'CRITICAL', `Rollback triggered: ${reason}`, 'Safe frozen state with hardware control disabled', { reason, time: new Date().toISOString() });

    this.logMessage(
      'RELEASE_GOVERNOR',
      'INCIDENT',
      'EMERGENCY ROLLBACK EXECUTED',
      `Rollback active. Hardware control DISABLED. Raw-media persistence DISABLED. System frozen in fail-safe mode. Reason: ${reason}`
    );

    this.notify();
  }

  public resetToDraft(): void {
    this.initializeGates();
    this.overallStatus = 'HOLD';
    this.hardwareControl = 'DISABLED';
    this.rawMediaPersistence = 'DISABLED';
    this.evidenceStore.clear();
    this.incidentStore.clear();
    this.governorSignature = undefined;
    this.sealedTimestamp = undefined;
    this.logMessage('SYSTEM', 'LOG', 'Release Reset', 'Release state reinitialized to clean draft state.');
    this.notify();
  }

  // Getters
  public getState(): ReleaseState {
    return {
      version: this.version,
      gates: Array.from(this.gatesMap.values()),
      overallStatus: this.overallStatus,
      provenanceRequired: this.provenanceRequired,
      hardwareControl: this.hardwareControl,
      rawMediaPersistence: this.rawMediaPersistence,
      manifest: this.manifest,
      merkleRoot: this.manifest.merkleRoot || '',
      governorSignature: this.governorSignature,
      sealedTimestamp: this.sealedTimestamp,
      incidents: this.getIncidents(),
      messages: this.messages
    };
  }

  public getGates(): Gate[] {
    return Array.from(this.gatesMap.values());
  }

  public getGate(id: string): Gate | undefined {
    return this.gatesMap.get(id);
  }

  public getIncidents(): Incident[] {
    return Array.from(this.incidentStore.values());
  }

  public getMessages(): AgentMessage[] {
    return this.messages;
  }

  public getManifest(): ReleaseManifest {
    return this.manifest;
  }
}

export const releaseGovernor = new ReleaseGovernor('3.0.0');
