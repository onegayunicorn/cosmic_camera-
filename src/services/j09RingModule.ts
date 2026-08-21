import { J09BioReading } from '../types';
import { generateDilithiumSignature, verifyDilithiumSignature } from '../utils/crypto';

export class J09RingModule {
  private seq: number = 1048576;
  private isScanning: boolean = true;
  private isConnected: boolean = true;
  private latestReading: J09BioReading;
  private history: J09BioReading[] = [];
  private redisStore: Map<string, any> = new Map();
  private listeners: Array<() => void> = [];
  private timer: any = null;

  constructor() {
    this.latestReading = this.generateSampleReading();
    this.startHeartbeat();
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

  private startHeartbeat(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isConnected) {
        this.emitTelemetry();
      }
    }, 1000);
  }

  public stop(): void {
    if (this.timer) clearInterval(this.timer);
  }

  public toggleConnection(): void {
    this.isConnected = !this.isConnected;
    this.notify();
  }

  private generateSampleReading(): J09BioReading {
    this.seq++;
    const now = Date.now();
    const ts_ns = now * 1_000_000;

    const baseHr = 68 + Math.sin(now / 5000) * 8 + (Math.random() - 0.5) * 2;
    const baseHrv = 62 + Math.cos(now / 6000) * 12 + (Math.random() - 0.5) * 3;
    const spo2 = 98.4 + (Math.random() - 0.5) * 0.8;
    const skinTemp = 36.52 + (Math.random() - 0.5) * 0.18;
    const tempDev = skinTemp - 36.5;
    const bioElectric = 0.84 + Math.sin(now / 8000) * 0.1;
    const motion: 'STILL' | 'ACTIVE' | 'SLEEP' = Math.random() > 0.8 ? 'ACTIVE' : 'STILL';

    // Compute DNA resonance index: weighted sum
    const normHrv = Math.min(1.0, baseHrv / 100);
    const normSpo2Dev = Math.max(0, 1.0 - Math.abs(spo2 - 98.0) / 5.0);
    const normTempDev = Math.max(0, 1.0 - Math.abs(tempDev) / 1.5);
    const dnaResIndex = Math.min(1.0, Math.max(0.0,
      normHrv * 0.40 +
      normSpo2Dev * 0.25 +
      normTempDev * 0.20 +
      bioElectric * 0.15
    ));

    const rfCorr = Math.min(1.0, Math.max(0.0, 0.89 + Math.sin(now / 7000) * 0.08 + (Math.random() - 0.5) * 0.02));

    const rawPayloadString = JSON.stringify({
      seq: this.seq,
      ts_ns,
      hr: baseHr.toFixed(1),
      hrv: baseHrv.toFixed(1),
      spo2: spo2.toFixed(1),
      temp: skinTemp.toFixed(2),
      bio: bioElectric.toFixed(3),
      dnaRes: dnaResIndex.toFixed(4)
    });

    const pqcSignature = generateDilithiumSignature(rawPayloadString);
    const pqcVerified = verifyDilithiumSignature(rawPayloadString, pqcSignature);

    const reading: J09BioReading = {
      seq: this.seq,
      ts_ns,
      heartRateBpm: Math.round(baseHr),
      hrvMs: Math.round(baseHrv),
      spo2Pct: parseFloat(spo2.toFixed(1)),
      skinTempC: parseFloat(skinTemp.toFixed(2)),
      tempDeviation: parseFloat(tempDev.toFixed(2)),
      bioElectricIndex: parseFloat(bioElectric.toFixed(3)),
      motionState: motion,
      dnaResonanceIndex: parseFloat(dnaResIndex.toFixed(4)),
      rfCorrelationScore: parseFloat(rfCorr.toFixed(4)),
      pqcSignature,
      pqcVerified,
      udpIngestStatus: 'DELIVERED',
      redisKey: `j09:VIS-J09-RING:latest`
    };

    return reading;
  }

  private emitTelemetry(): void {
    const reading = this.generateSampleReading();
    this.latestReading = reading;
    this.history.unshift(reading);
    if (this.history.length > 50) this.history.pop();

    // Update Redis simulated keys
    this.redisStore.set(`j09:VIS-J09-RING:latest`, reading);
    this.redisStore.set(`j09:updates:stream`, { ts: reading.ts_ns, payload: reading });

    this.notify();
  }

  public getLatestReading(): J09BioReading {
    return this.latestReading;
  }

  public getHistory(): J09BioReading[] {
    return this.history;
  }

  public getRedisStore(): Map<string, any> {
    return this.redisStore;
  }

  public isBleConnected(): boolean {
    return this.isConnected;
  }
}

export const j09RingModule = new J09RingModule();
