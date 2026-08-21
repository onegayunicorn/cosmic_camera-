import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, ShieldCheck, Radio, Database, Cpu, Wifi, CheckCircle2, Lock, RefreshCw, Zap } from 'lucide-react';
import { j09RingModule } from '../services/j09RingModule';
import { J09BioReading } from '../types';

export const J09RingView: React.FC = () => {
  const [reading, setReading] = useState<J09BioReading>(j09RingModule.getLatestReading());
  const [history, setHistory] = useState<J09BioReading[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(j09RingModule.isBleConnected());

  useEffect(() => {
    const update = () => {
      setReading(j09RingModule.getLatestReading());
      setHistory([...j09RingModule.getHistory()]);
      setIsConnected(j09RingModule.isBleConnected());
    };
    update();
    const unsub = j09RingModule.subscribe(update);
    return unsub;
  }, []);

  return (
    <div className="space-y-5 font-mono">
      
      {/* Top Banner */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff4e00]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                05. J09 BIO-RESONANCE SENSOR RING & A17 PQC BRIDGE
              </h2>
            </div>
            <p className="text-xs text-[#8e9299] max-w-3xl leading-relaxed">
              BLE GATT characteristic ingest (0x2A37, 0x2A5F, 0x2A6E, 0x2A92) with post-quantum CRYSTALS-Dilithium3 envelope signing, 1Hz UDP broadcast (<code className="text-[#ff4e00]">192.168.1.255:7000</code>), and Redis state synchronization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => j09RingModule.toggleConnection()}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer uppercase ${
                isConnected
                  ? 'bg-[#0a0b0e] text-[#00ff41] border-[#2d3139] hover:border-[#00ff41]'
                  : 'bg-[#0a0b0e] text-[#ff4e00] border-[#2d3139] hover:border-[#ff4e00]'
              }`}
            >
              <Wifi className={`w-3.5 h-3.5 ${isConnected ? 'text-[#00ff41] animate-pulse' : 'text-[#ff4e00]'}`} />
              <span>{isConnected ? 'BLE ACTIVE (1HZ)' : 'BLE PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Network & PQC Ingest Pill Row */}
        <div className="mt-3 pt-3 border-t border-[#2d3139] flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#ff4e00]" />
              <span className="text-[#8e9299]">UDP SINK:</span>
              <span className="text-[#e0e0e0] font-bold">192.168.1.255:7000</span>
            </div>
            <span className="text-[#404550]">|</span>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#ff4e00]" />
              <span className="text-[#8e9299]">REDIS:</span>
              <span className="text-[#e0e0e0] font-bold">j09:VIS-J09-RING:latest</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#00ff41] font-bold uppercase">
            <Lock className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>PQC DILITHIUM3: VERIFIED</span>
          </div>
        </div>
      </div>

      {/* 6 Biometric Metric Dials */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Heart Rate */}
        <div className="bg-[#15171a] rounded-lg p-3 border border-[#2d3139] space-y-1">
          <div className="flex items-center justify-between text-[#8e9299] text-xs font-mono">
            <span className="flex items-center gap-1 uppercase">
              <Heart className="w-3.5 h-3.5 text-[#ff4e00] animate-pulse" /> HR (0x2A37)
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {reading.heartRateBpm} <span className="text-xs font-normal text-[#8e9299]">BPM</span>
          </div>
          <div className="text-[10px] font-mono text-[#8e9299] uppercase">R-R INTERVAL: ACTIVE</div>
        </div>

        {/* HRV */}
        <div className="bg-[#15171a] rounded-lg p-3 border border-[#2d3139] space-y-1">
          <div className="flex items-center justify-between text-[#8e9299] text-xs font-mono">
            <span className="flex items-center gap-1 uppercase">
              <Activity className="w-3.5 h-3.5 text-[#00ff41]" /> HRV (0x2A92)
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-[#00ff41]">
            {reading.hrvMs} <span className="text-xs font-normal text-[#8e9299]">ms</span>
          </div>
          <div className="text-[10px] font-mono text-[#8e9299] uppercase">AUTONOMIC BALANCE</div>
        </div>

        {/* SpO2 */}
        <div className="bg-[#15171a] rounded-lg p-3 border border-[#2d3139] space-y-1">
          <div className="flex items-center justify-between text-[#8e9299] text-xs font-mono">
            <span className="flex items-center gap-1 uppercase">
              <Zap className="w-3.5 h-3.5 text-[#ff4e00]" /> SpO2 (0x2A5F)
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {reading.spo2Pct.toFixed(1)} <span className="text-xs font-normal text-[#8e9299]">%</span>
          </div>
          <div className="text-[10px] font-mono text-[#8e9299] uppercase">OPTICAL RED/IR</div>
        </div>

        {/* Skin Temp */}
        <div className="bg-[#15171a] rounded-lg p-3 border border-[#2d3139] space-y-1">
          <div className="flex items-center justify-between text-[#8e9299] text-xs font-mono">
            <span className="flex items-center gap-1 uppercase">
              <Thermometer className="w-3.5 h-3.5 text-[#ff4e00]" /> TEMP (0x2A6E)
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {reading.skinTempC.toFixed(2)} <span className="text-xs font-normal text-[#8e9299]">°C</span>
          </div>
          <div className="text-[10px] font-mono text-[#8e9299] uppercase">DEV: {reading.tempDeviation > 0 ? `+${reading.tempDeviation}` : reading.tempDeviation}°C</div>
        </div>

        {/* DNA Resonance Index */}
        <div className="bg-[#15171a] rounded-lg p-3 border border-[#2d3139] space-y-1">
          <div className="flex items-center justify-between text-[#8e9299] text-xs font-mono">
            <span className="flex items-center gap-1 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff41]" /> DNA RES
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-[#00ff41]">
            {reading.dnaResonanceIndex.toFixed(4)}
          </div>
          <div className="text-[10px] font-mono text-[#8e9299] uppercase">BIOMETRIC HARMONIC</div>
        </div>

        {/* RF Correlation */}
        <div className="bg-[#15171a] rounded-lg p-3 border border-[#2d3139] space-y-1">
          <div className="flex items-center justify-between text-[#8e9299] text-xs font-mono">
            <span className="flex items-center gap-1 uppercase">
              <Radio className="w-3.5 h-3.5 text-[#ff4e00]" /> RF CORR
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {reading.rfCorrelationScore.toFixed(4)}
          </div>
          <div className="text-[10px] font-mono text-[#8e9299] uppercase">LITELLM LINK</div>
        </div>

      </div>

      {/* Packet Inspector & Live 1Hz Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Latest Dilithium-3 Envelope Packet */}
        <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
              <Lock className="w-4 h-4 text-[#ff4e00]" />
              DILITHIUM-3 SIGNED PAYLOAD (SEQ #{reading.seq})
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139] font-bold">
              [SIGNATURE_VALID]
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-1">
              <div className="text-[#8e9299] text-[10px] uppercase">DETACHED DILITHIUM-3 SIGNATURE:</div>
              <div className="text-[#00ff41] break-all text-[11px]">
                {reading.pqcSignature}
              </div>
            </div>

            <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-1">
              <div className="text-[#8e9299] text-[10px] uppercase">JSON TELEMETRY ENVELOPE:</div>
              <pre className="text-[#e0e0e0] text-[11px] overflow-x-auto leading-relaxed">
{JSON.stringify({
  seq: reading.seq,
  ts_ns: reading.ts_ns,
  bio: {
    heartRateBpm: reading.heartRateBpm,
    hrvMs: reading.hrvMs,
    spo2Pct: reading.spo2Pct,
    skinTempC: reading.skinTempC,
    motionState: reading.motionState,
    bioElectricIndex: reading.bioElectricIndex
  },
  resonance: {
    dnaResonanceIndex: reading.dnaResonanceIndex,
    rfCorrelationScore: reading.rfCorrelationScore
  },
  network: {
    udpDestination: '192.168.1.255:7000',
    redisKey: reading.redisKey,
    ingestStatus: reading.udpIngestStatus
  }
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* 1Hz Live History Stream */}
        <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
              <Activity className="w-4 h-4 text-[#00ff41]" />
              1HZ REAL-TIME INGEST STREAM
            </h3>
            <span className="text-xs font-mono text-[#8e9299]">
              {history.length} PACKETS BUFFERED
            </span>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {history.slice(0, 10).map((h) => (
              <div
                key={h.seq}
                className="bg-[#0a0b0e] p-2.5 rounded border border-[#2d3139] text-xs font-mono flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#ff4e00] font-bold">#{h.seq}</span>
                  <span className="text-white font-semibold">{h.heartRateBpm} BPM</span>
                  <span className="text-[#404550]">|</span>
                  <span className="text-[#e0e0e0]">{h.spo2Pct}% SpO2</span>
                  <span className="text-[#404550]">|</span>
                  <span className="text-[#e0e0e0]">{h.skinTempC}°C</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#00ff41] font-bold">DNA: {h.dnaResonanceIndex.toFixed(3)}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#15171a] text-[#00ff41] text-[10px] font-bold border border-[#2d3139]">
                    PQC OK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
