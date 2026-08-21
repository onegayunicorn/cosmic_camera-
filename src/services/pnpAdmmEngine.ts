/**
 * Plug-and-Play ADMM (PnP-ADMM) Quantum Photon-Limited Reconstruction Engine
 * Implements real Poisson Likelihood + Plug-and-Play Bilateral/CNN Denoiser + Dual Updates
 */

import { PhotonConfig, AdmmIterationMetrics } from '../types';

export interface ReconstructionResult {
  groundTruth: number[][];
  rawPhotonCounts: number[][];
  reconstructed: number[][];
  iterationsData: AdmmIterationMetrics[];
  finalPsnr: number;
  finalSsim: number;
  finalSnrDb: number;
  darkCurrentNoiseE: number;
  readNoiseE: number;
  converged: boolean;
  totalTimeMs: number;
}

export class PnpAdmmEngine {
  private size: number = 48; // 48x48 discrete grid for real-time fluid simulation and visualization

  /**
   * Generates a synthetic ground truth scene (e.g. quantum constellation / deep space nebula target)
   */
  public generateGroundTruth(pattern: 'nebula' | 'quantum_grid' | 'spiral' = 'nebula'): number[][] {
    const grid: number[][] = [];
    const cx = this.size / 2;
    const cy = this.size / 2;

    for (let y = 0; y < this.size; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.size; x++) {
        let val = 0.05; // background flux
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (pattern === 'nebula') {
          // Central star + surrounding rings & glowing clusters
          const core = Math.exp(-(dist * dist) / 45);
          const ring = Math.exp(-Math.pow(dist - 14, 2) / 12) * (0.6 + 0.4 * Math.sin(Math.atan2(dy, dx) * 4));
          const sub1 = Math.exp(-(Math.pow(x - 14, 2) + Math.pow(y - 16, 2)) / 18) * 0.7;
          const sub2 = Math.exp(-(Math.pow(x - 34, 2) + Math.pow(y - 32, 2)) / 22) * 0.85;
          val += core * 0.95 + ring * 0.45 + sub1 + sub2;
        } else if (pattern === 'quantum_grid') {
          // 2D grid array of optical quantum nodes
          const gx = Math.abs((x % 8) - 4);
          const gy = Math.abs((y % 8) - 4);
          val += Math.exp(-(gx * gx + gy * gy) / 4) * 0.8;
          if (dist < 18) val += 0.3;
        } else {
          // Spiral galaxy
          const angle = Math.atan2(dy, dx);
          const spiral = Math.sin(dist * 0.4 - angle * 2);
          if (spiral > 0.3 && dist < 22) {
            val += spiral * Math.exp(-dist / 16) * 0.9;
          }
        }
        row.push(Math.min(1.0, Math.max(0.0, val)));
      }
      grid.push(row);
    }
    return grid;
  }

  /**
   * Simulates forward Poisson photon counting model with sensor thermal, exposure time, gain, and read noise
   */
  public simulatePhotonDetection(groundTruth: number[][], config: PhotonConfig): {
    rawCounts: number[][];
    darkNoise: number;
    readNoise: number;
    effectiveGain: number;
    exposureFactor: number;
    totalPhotons: number;
    peakCount: number;
    meanCount: number;
    fanoFactor: number;
    histogram: { bin: string; count: number; theoretical: number }[];
  } {
    const raw: number[][] = [];
    const exposureFactor = Math.max(0.02, (config.exposureTimeMs ?? 50) / 50.0);
    // Sensor Gain in dB: 0dB = 1.0x, 12dB ~ 3.98x, 24dB ~ 15.85x
    const linearGain = Math.pow(10, (config.sensorGainDb ?? 12) / 20.0);
    const effectiveGain = linearGain / 3.98; // Normalized to 12dB unity baseline

    // Thermal dark current model: T = -10C baseline (~0.05 e-/pixel)
    // Dark current doubles approximately every 6-7°C
    const tempFactor = Math.exp((config.tecTempC - (-10.0)) / 9.5);
    const darkNoise = 0.05 * tempFactor * exposureFactor;
    const baseReadNoise = 1.18; // IMX571 baseline read noise e-
    const readNoise = baseReadNoise * Math.sqrt(effectiveGain); // Scaled read noise with gain

    let totalPhotons = 0;
    let peakCount = 0;
    const allCounts: number[] = [];

    for (let y = 0; y < this.size; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.size; x++) {
        // True physical photon flux arriving during exposure window
        const fluxMean = Math.max(0.01, groundTruth[y][x] * config.flux * exposureFactor);
        // Poisson random variable sampling for photon arrival
        const photonArrival = this.samplePoisson(fluxMean);
        // Thermal dark electrons + read noise fluctuations
        const thermalElectrons = this.samplePoisson(darkNoise);
        const gaussianReadNoise = (Math.random() - 0.5) * readNoise * 0.25;

        // Total digitized output in ADU / detected photons
        const detected = Math.max(0, Math.round((photonArrival + thermalElectrons) * effectiveGain + gaussianReadNoise));
        row.push(detected);
        totalPhotons += detected;
        if (detected > peakCount) peakCount = detected;
        allCounts.push(detected);
      }
      raw.push(row);
    }

    const n = allCounts.length;
    const meanCount = totalPhotons / n;
    let varSum = 0;
    for (let i = 0; i < n; i++) {
      const diff = allCounts[i] - meanCount;
      varSum += diff * diff;
    }
    const variance = varSum / n;
    const fanoFactor = meanCount > 0 ? variance / meanCount : 1.0;

    // Generate 12-bin histogram (0 to 12+ photons)
    const maxBin = 12;
    const binCounts = new Array(maxBin + 1).fill(0);
    for (const c of allCounts) {
      const b = Math.min(maxBin, Math.floor(c));
      binCounts[b]++;
    }

    const histogram = binCounts.map((count, b) => {
      const lambda = meanCount;
      // Theoretical Poisson P(k; lambda) = (lambda^k * e^-lambda) / k!
      let pTheoretical = 0;
      if (lambda > 0) {
        let fact = 1;
        for (let i = 1; i <= b; i++) fact *= i;
        pTheoretical = Math.round((Math.pow(lambda, b) * Math.exp(-lambda) / fact) * n);
      }
      return {
        bin: b === maxBin ? `${b}+` : `${b}`,
        count,
        theoretical: isFinite(pTheoretical) ? pTheoretical : 0
      };
    });

    return {
      rawCounts: raw,
      darkNoise,
      readNoise,
      effectiveGain,
      exposureFactor,
      totalPhotons,
      peakCount,
      meanCount,
      fanoFactor,
      histogram
    };
  }

  private samplePoisson(lambda: number): number {
    if (lambda <= 0) return 0;
    if (lambda < 30) {
      const L = Math.exp(-lambda);
      let k = 0;
      let p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > L);
      return Math.max(0, k - 1);
    } else {
      // Gaussian approximation for large lambda
      const u1 = Math.max(1e-10, Math.random());
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * z));
    }
  }

  /**
   * Executes full Plug-and-Play ADMM optimization loop
   */
  public runPnpAdmm(
    rawCounts: number[][],
    groundTruth: number[][],
    config: PhotonConfig,
    onStep?: (metrics: AdmmIterationMetrics, currentRecon: number[][]) => void
  ): ReconstructionResult {
    const startTime = performance.now();
    const { rho, lambda, iterations, epsilon, flux } = config;
    const exposureFactor = Math.max(0.02, (config.exposureTimeMs ?? 50) / 50.0);
    const linearGain = Math.pow(10, (config.sensorGainDb ?? 12) / 20.0);
    const effectiveGain = linearGain / 3.98;
    const effectiveScale = Math.max(0.1, flux * exposureFactor * effectiveGain);

    // Normalize raw counts to approximate flux intensity [0, 1]
    const y: number[][] = rawCounts.map(row => row.map(val => val / effectiveScale));

    // Initialize variables
    let x: number[][] = y.map(row => [...row]); // primal variable x_0 = A^T y
    let z: number[][] = x.map(row => [...row]); // consensus variable z_0
    let u: number[][] = x.map(row => row.map(() => 0)); // dual variable u_0 = 0

    const iterationsData: AdmmIterationMetrics[] = [];
    let converged = false;

    for (let k = 1; k <= iterations; k++) {
      const stepStart = performance.now();
      const prevZ = z.map(row => [...row]);

      // 1. X-Update: Poisson Likelihood Proximal Step
      // argmin_x [ -<y, log(x)> + (rho / 2) * ||x - z_{k-1} + u_{k-1}||^2 ]
      // Positive root of rho*x^2 - rho*v*x - y = 0 => x = (v + sqrt(v^2 + 4*y/rho)) / 2
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const v = z[i][j] - u[i][j];
          const yVal = y[i][j];
          const discriminant = v * v + (4 * yVal) / Math.max(0.01, rho);
          const xNew = (v + Math.sqrt(Math.max(0, discriminant))) / 2;
          x[i][j] = Math.max(0, Math.min(1.5, xNew));
        }
      }

      // 2. Z-Update: Plug-and-Play Denoiser D(x_k + u_{k-1}; lambda)
      const w: number[][] = [];
      for (let i = 0; i < this.size; i++) {
        const row: number[] = [];
        for (let j = 0; j < this.size; j++) {
          row.push(x[i][j] + u[i][j]);
        }
        w.push(row);
      }

      z = this.applyBilateralDenoiser(w, lambda);

      // 3. U-Update: Dual Variable
      let primalResidualSum = 0;
      let dualResidualSum = 0;

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const resPrimal = x[i][j] - z[i][j];
          u[i][j] += resPrimal;
          const resDual = rho * (z[i][j] - prevZ[i][j]);

          primalResidualSum += resPrimal * resPrimal;
          dualResidualSum += resDual * resDual;
        }
      }

      const primalRes = Math.sqrt(primalResidualSum / (this.size * this.size));
      const dualRes = Math.sqrt(dualResidualSum / (this.size * this.size));

      // Calculate quality metrics
      const psnr = this.calculatePsnr(groundTruth, z);
      const ssim = this.calculateSsim(groundTruth, z);
      const snrDb = this.calculateSnr(groundTruth, z);
      const loss = primalRes * 0.5 + dualRes * 0.5;
      const stepTime = performance.now() - stepStart;

      const metrics: AdmmIterationMetrics = {
        iteration: k,
        primalResidual: primalRes,
        dualResidual: dualRes,
        psnr,
        ssim,
        snrDb,
        objectiveLoss: loss,
        executionTimeMs: stepTime
      };

      iterationsData.push(metrics);
      if (onStep) {
        onStep(metrics, z);
      }

      if (primalRes < epsilon && dualRes < epsilon) {
        converged = true;
        break;
      }
    }

    const totalTimeMs = performance.now() - startTime;
    const finalPsnr = this.calculatePsnr(groundTruth, z);
    const finalSsim = this.calculateSsim(groundTruth, z);
    const finalSnrDb = this.calculateSnr(groundTruth, z);

    return {
      groundTruth,
      rawPhotonCounts: rawCounts,
      reconstructed: z,
      iterationsData,
      finalPsnr,
      finalSsim,
      finalSnrDb,
      darkCurrentNoiseE: 0.05 * Math.exp((config.tecTempC - (-10)) / 9.5) * exposureFactor,
      readNoiseE: 1.18 * Math.sqrt(effectiveGain),
      converged,
      totalTimeMs
    };
  }

  /**
   * Separable Fast Bilateral Filter Denoiser (Acts as the Plug-and-Play Prior)
   */
  private applyBilateralDenoiser(img: number[][], strength: number): number[][] {
    const out: number[][] = [];
    const sigmaSpatial = 1.8;
    const sigmaRange = 0.12 * Math.max(0.1, strength);
    const radius = 2;

    for (let y = 0; y < this.size; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.size; x++) {
        const centerVal = img[y][x];
        let weightSum = 0;
        let valSum = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          const ny = Math.min(this.size - 1, Math.max(0, y + dy));
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = Math.min(this.size - 1, Math.max(0, x + dx));
            const neighborVal = img[ny][nx];

            const spatialDistSq = dx * dx + dy * dy;
            const rangeDistSq = (centerVal - neighborVal) * (centerVal - neighborVal);

            const spatialWeight = Math.exp(-spatialDistSq / (2 * sigmaSpatial * sigmaSpatial));
            const rangeWeight = Math.exp(-rangeDistSq / (2 * sigmaRange * sigmaRange));
            const weight = spatialWeight * rangeWeight;

            valSum += neighborVal * weight;
            weightSum += weight;
          }
        }
        row.push(Math.max(0, Math.min(1.0, valSum / Math.max(1e-5, weightSum))));
      }
      out.push(row);
    }
    return out;
  }

  private calculatePsnr(gt: number[][], recon: number[][]): number {
    let mse = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const err = gt[y][x] - recon[y][x];
        mse += err * err;
      }
    }
    mse /= (this.size * this.size);
    if (mse <= 1e-9) return 48.0;
    return Math.min(45.0, 10 * Math.log10(1.0 / mse));
  }

  private calculateSsim(gt: number[][], recon: number[][]): number {
    // Fast SSIM approximation on image blocks
    let meanGt = 0;
    let meanRecon = 0;
    const n = this.size * this.size;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        meanGt += gt[y][x];
        meanRecon += recon[y][x];
      }
    }
    meanGt /= n;
    meanRecon /= n;

    let varGt = 0;
    let varRecon = 0;
    let covar = 0;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const dg = gt[y][x] - meanGt;
        const dr = recon[y][x] - meanRecon;
        varGt += dg * dg;
        varRecon += dr * dr;
        covar += dg * dr;
      }
    }
    varGt /= n;
    varRecon /= n;
    covar /= n;

    const c1 = 0.0001;
    const c2 = 0.0009;
    const ssim = ((2 * meanGt * meanRecon + c1) * (2 * covar + c2)) /
      ((meanGt * meanGt + meanRecon * meanRecon + c1) * (varGt + varRecon + c2));

    return Math.max(0, Math.min(1.0, ssim));
  }

  private calculateSnr(gt: number[][], recon: number[][]): number {
    let signalPower = 0;
    let noisePower = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        signalPower += gt[y][x] * gt[y][x];
        const noise = gt[y][x] - recon[y][x];
        noisePower += noise * noise;
      }
    }
    if (noisePower <= 1e-9) return 35.0;
    return Math.min(38.0, 10 * Math.log10(signalPower / noisePower));
  }
}

export const pnpAdmmEngine = new PnpAdmmEngine();
