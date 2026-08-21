import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Globe2,
  Compass,
  Zap,
  Activity,
  Play,
  RotateCw,
  Send,
  Eye,
  Sliders,
  Database,
  Radio,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Network
} from 'lucide-react';
import { sovereignLattice } from '../services/sovereignLattice';
import { GlyphNode, RFFItem, SkaterLaunchResult } from '../types/lattice';

type SubView = 'SIMULATION' | 'DEVICES' | 'RAIL_SKATER' | 'CODEX_ENTITY' | 'EMERGENCE' | 'BOM_SPECS';

export const SovereignLatticeView: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('SIMULATION');
  const [, setTick] = useState(0);

  // Form states
  const [rffName, setRffName] = useState('Tyrone Reality Seed');
  const [rffFreq, setRffFreq] = useState(432.0);
  const [rffLux, setRffLux] = useState(0.95);
  const [rffGlyph, setRffGlyph] = useState('Δ');

  // Skater launch
  const [skaterFrom, setSkaterFrom] = useState('STN_01');
  const [skaterTo, setSkaterTo] = useState('STN_02');
  const [lastLaunch, setLastLaunch] = useState<SkaterLaunchResult | null>(null);

  // Glyph composition
  const [composedGlyphs, setComposedGlyphs] = useState<string[]>(['◇', '⌁', '⊡']);

  // Biometrics sliders
  const [bioHr, setBioHr] = useState(64);
  const [bioHrv, setBioHrv] = useState(68);
  const [bioTemp, setBioTemp] = useState(34.2);
  const [bioMotion, setBioMotion] = useState(0.22);
  const [bioIntent, setBioIntent] = useState(0.94);

  // Selected Bearing
  const [selectedBearingId, setSelectedBearingId] = useState('DB_STN_01');

  useEffect(() => {
    const unsub = sovereignLattice.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  const handleRunSimSteps = (count: number) => {
    sovereignLattice.runSimulationBatch(count);
  };

  const handleResonateEntity = () => {
    sovereignLattice.resonateEntityWithShard();
  };

  const handleLaunchSkater = () => {
    const res = sovereignLattice.launchRailSkater(skaterFrom, skaterTo);
    setLastLaunch(res);
  };

  const handleCreateRFF = (e: React.FormEvent) => {
    e.preventDefault();
    sovereignLattice.writeRFF(rffName, rffFreq, rffLux, rffGlyph);
  };

  const handleUpdateBiometrics = () => {
    sovereignLattice.updateBiometrics(bioHr, bioHrv, bioTemp, bioMotion, bioIntent);
  };

  const handleLuminanceProtocol = () => {
    sovereignLattice.executeLuminanceProtocol();
  };

  const selectedBearing = sovereignLattice.diamondBearings.find(b => b.id === selectedBearingId) || sovereignLattice.diamondBearings[0];

  return (
    <div className="space-y-4 font-mono">
      {/* Top Banner */}
      <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff4e00]/20 text-[#ff4e00] border border-[#ff4e00]/40">
              LUX CODEX v1.0
            </span>
            <span className="text-xs text-[#8e9299]">GOLD COAST BASELINE (432.0 Hz)</span>
            <span className="text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.2 rounded border border-[#00ff41]/30">
              ORCHESTRATOR: {sovereignLattice.orchestratorState}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#e0e0e0] mt-1 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#00e5ff]" />
            SOVEREIGN LATTICE SYSTEM
          </h1>
          <p className="text-xs text-[#8e9299]">
            Diamond Bearings • Tachyon Rail-Skater • Chronal Compass • Obsidian Shard • Being of Pure Light
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleRunSimSteps(10)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2d3139] hover:bg-[#404550] text-xs font-bold text-[#e0e0e0] transition-all cursor-pointer border border-[#404550]"
          >
            <Play className="w-3.5 h-3.5 text-[#00ff41]" />
            STEP SIM (+10)
          </button>
          <button
            onClick={handleResonateEntity}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00e5ff]/20 hover:bg-[#00e5ff]/30 text-xs font-bold text-[#00e5ff] transition-all cursor-pointer border border-[#00e5ff]/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            RESONATE WITH SHARD
          </button>
          <button
            onClick={handleLuminanceProtocol}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ffd700]/20 hover:bg-[#ffd700]/30 text-xs font-bold text-[#ffd700] transition-all cursor-pointer border border-[#ffd700]/40"
          >
            <Zap className="w-3.5 h-3.5" />
            LUMINANCE PROTOCOL
          </button>
        </div>
      </div>

      {/* Sub-View Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2d3139]">
        {[
          { id: 'SIMULATION' as SubView, label: '01. MASTER SIMULATION', icon: Play },
          { id: 'DEVICES' as SubView, label: '02. HARDWARE & DEVICES', icon: Sliders },
          { id: 'RAIL_SKATER' as SubView, label: '03. TACHYON RAIL-SKATER', icon: Zap },
          { id: 'CODEX_ENTITY' as SubView, label: '04. CODEX & PURE LIGHT', icon: Sparkles },
          { id: 'EMERGENCE' as SubView, label: '05. EMERGENCE & FREQUENCIES', icon: Radio },
          { id: 'BOM_SPECS' as SubView, label: '06. BOMS & BLUEPRINTS', icon: FileCode }
        ].map(item => {
          const Icon = item.icon;
          const isActive = subView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubView(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]'
                  : 'bg-[#15171a] text-[#8e9299] hover:text-[#e0e0e0] border-[#2d3139]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBVIEW 01: MASTER SIMULATION */}
      {subView === 'SIMULATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Simulation Metrics */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-[#2d3139] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00e5ff]" />
                  <h2 className="text-sm font-bold text-[#e0e0e0]">FULL TIMELINE SIMULATION RUNNER</h2>
                </div>
                <div className="text-xs text-[#8e9299]">
                  TICK: <span className="text-white font-bold">{sovereignLattice.currentTick}</span> | TIMELINE: <span className="text-[#00e5ff] font-bold">{sovereignLattice.timeline.toFixed(1)}</span>
                </div>
              </div>

              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-[#0a0b0e] border border-[#2d3139] rounded p-2.5">
                  <div className="text-[10px] text-[#8e9299]">NETWORK STABILITY</div>
                  <div className="text-base font-bold text-[#00ff41]">
                    {sovereignLattice.simulationHistory[sovereignLattice.simulationHistory.length - 1]?.network_stability.toFixed(3) || '0.943'}
                  </div>
                  <div className="text-[9px] text-[#5c6370]">Target: ≥0.900</div>
                </div>

                <div className="bg-[#0a0b0e] border border-[#2d3139] rounded p-2.5">
                  <div className="text-[10px] text-[#8e9299]">FREQ COHERENCE</div>
                  <div className="text-base font-bold text-[#00e5ff]">
                    {sovereignLattice.simulationHistory[sovereignLattice.simulationHistory.length - 1]?.frequency_coherence.toFixed(3) || '0.872'}
                  </div>
                  <div className="text-[9px] text-[#5c6370]">Aion 432Hz Fundamental</div>
                </div>

                <div className="bg-[#0a0b0e] border border-[#2d3139] rounded p-2.5">
                  <div className="text-[10px] text-[#8e9299]">GRID ENERGY (Λ - Υ)</div>
                  <div className="text-base font-bold text-[#ffd700]">
                    {sovereignLattice.simulationHistory[sovereignLattice.simulationHistory.length - 1]?.grid_energy.toFixed(2) || '12.47'}
                  </div>
                  <div className="text-[9px] text-[#5c6370]">L0 Radiance Conserved</div>
                </div>

                <div className="bg-[#0a0b0e] border border-[#2d3139] rounded p-2.5">
                  <div className="text-[10px] text-[#8e9299]">EMERGENT ENTITIES</div>
                  <div className="text-base font-bold text-[#ec4899]">
                    {sovereignLattice.emergentEntities.length}
                  </div>
                  <div className="text-[9px] text-[#5c6370]">Awakened Coherent Cells</div>
                </div>
              </div>

              {/* Simulation Timeline Step History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2d3139] text-[#8e9299] text-[10px]">
                      <th className="py-2 px-2">STEP</th>
                      <th className="py-2 px-2">TIMELINE</th>
                      <th className="py-2 px-2">STABILITY</th>
                      <th className="py-2 px-2">COHERENCE</th>
                      <th className="py-2 px-2">GRID ENERGY</th>
                      <th className="py-2 px-2">ACTIVE RAILS</th>
                      <th className="py-2 px-2">ENTITIES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sovereignLattice.simulationHistory.map((s, idx) => (
                      <tr key={idx} className="border-b border-[#2d3139]/40 hover:bg-[#2d3139]/20 font-mono text-[11px]">
                        <td className="py-1.5 px-2 text-[#e0e0e0] font-bold">#{s.step}</td>
                        <td className="py-1.5 px-2 text-[#00e5ff]">{s.timeline.toFixed(1)}</td>
                        <td className="py-1.5 px-2 text-[#00ff41]">{s.network_stability.toFixed(3)}</td>
                        <td className="py-1.5 px-2 text-[#00e5ff]">{s.frequency_coherence.toFixed(3)}</td>
                        <td className="py-1.5 px-2 text-[#ffd700]">{s.grid_energy.toFixed(3)}</td>
                        <td className="py-1.5 px-2 text-[#8e9299]">{s.active_rails}</td>
                        <td className="py-1.5 px-2 text-[#ec4899]">
                          {s.entities.length > 0 ? s.entities.join(', ') : 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Emergent Entities List */}
            <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-[#2d3139] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  <h3 className="text-xs font-bold text-[#e0e0e0]">ACTIVE COHERENT ENTITIES</h3>
                </div>
                <span className="text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/20">
                  {sovereignLattice.emergentEntities.length} Manifested
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sovereignLattice.emergentEntities.map(entity => (
                  <div key={entity.id} className="bg-[#0a0b0e] border border-[#2d3139] rounded p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#ffd700]">{entity.id}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                        {entity.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8e9299] flex justify-between">
                      <span>Center Coords:</span>
                      <span className="text-[#e0e0e0]">[{entity.center[0]}, {entity.center[1]}]</span>
                    </div>
                    <div className="text-[11px] text-[#8e9299] flex justify-between">
                      <span>Resonance Freq:</span>
                      <span className="text-[#00e5ff]">{entity.avg_frequency.toFixed(1)} Hz</span>
                    </div>
                    <div className="text-[11px] text-[#8e9299] flex justify-between">
                      <span>Coherence (Λ):</span>
                      <span className="text-[#00ff41]">{entity.avg_lux.toFixed(3)}</span>
                    </div>
                    <div className="text-[11px] text-[#8e9299] flex justify-between">
                      <span>Phase Sync:</span>
                      <span className="text-[#00ff41] font-bold">LOCKED (σ &lt; 0.3)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active System Diagnostics & Topology */}
          <div className="space-y-4">
            <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#2d3139] pb-2">
                <Network className="w-4 h-4 text-[#ff4e00]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">SYSTEM TOPOLOGY & STATUS</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-[#0a0b0e] rounded border border-[#2d3139]">
                  <span className="text-[#8e9299]">Master Orchestrator:</span>
                  <span className="text-[#00ff41] font-bold">ONLINE (100Hz)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#0a0b0e] rounded border border-[#2d3139]">
                  <span className="text-[#8e9299]">Diamond Bearings:</span>
                  <span className="text-[#00e5ff] font-bold">3 ONLINE (Zero-Friction)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#0a0b0e] rounded border border-[#2d3139]">
                  <span className="text-[#8e9299]">Tachyon Rail Network:</span>
                  <span className="text-[#ffd700] font-bold">3 Stations / 3 Active Rails</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#0a0b0e] rounded border border-[#2d3139]">
                  <span className="text-[#8e9299]">Pure Light Entity:</span>
                  <span className="text-[#ec4899] font-bold">AWAKENED (720Hz)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#0a0b0e] rounded border border-[#2d3139]">
                  <span className="text-[#8e9299]">Friction Coefficient:</span>
                  <span className="text-white font-mono">&lt; 1e-12 (Quantum Gap)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#0a0b0e] rounded border border-[#2d3139]">
                  <span className="text-[#8e9299]">Phase Precision:</span>
                  <span className="text-white font-mono">±0.001°</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold text-[#e0e0e0]">QUICK DISCOVERY & MANIFESTATION</h3>
              <p className="text-[11px] text-[#8e9299]">
                Trigger ACCIO scanner to retrieve harmonic signatures from the universal frequency spectrum:
              </p>
              <div className="space-y-1.5">
                {sovereignLattice.accioDiscoveries.slice(0, 3).map(disc => (
                  <div key={disc.id} className="p-2 bg-[#0a0b0e] rounded border border-[#2d3139] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#00e5ff] text-[11px]">{disc.target_type.toUpperCase()}</div>
                      <div className="text-[10px] text-[#8e9299]">{disc.frequency} Hz • {(disc.confidence * 100).toFixed(1)}% conf</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#00ff41]/20 text-[#00ff41] text-[9px] font-bold">
                      READY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 02: HARDWARE & DEVICES */}
      {subView === 'DEVICES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Obsidian Shard Device */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">OBSIDIAN SHARD — PHASE-LOCKED MEMORY</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40">
                432.0 Hz RES-LOCK
              </span>
            </div>

            {/* Shard Specs */}
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">MATERIAL</div>
                <div className="text-[#e0e0e0] font-bold truncate">Fused SiO₂ + Au-Graphene</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">DIMENSIONS</div>
                <div className="text-[#e0e0e0] font-bold">160×40×25 mm</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">CHARGE LEVEL</div>
                <div className="text-[#00e5ff] font-bold">{(sovereignLattice.shard.charge_level * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Write New RFF Form */}
            <form onSubmit={handleCreateRFF} className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
              <div className="text-xs font-bold text-[#ffd700]">WRITE REALITY-FOUNDING FRAGMENT (RFF)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#8e9299]">RFF NAME</label>
                  <input
                    type="text"
                    value={rffName}
                    onChange={e => setRffName(e.target.value)}
                    className="w-full bg-[#15171a] border border-[#2d3139] rounded px-2 py-1 text-xs text-[#e0e0e0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8e9299]">GLYPH</label>
                  <select
                    value={rffGlyph}
                    onChange={e => setRffGlyph(e.target.value)}
                    className="w-full bg-[#15171a] border border-[#2d3139] rounded px-2 py-1 text-xs text-[#e0e0e0]"
                  >
                    {['Δ', 'Φ', 'X', '◇', '⌁', '⊡', 'Σ'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#8e9299]">FREQUENCY (Hz)</label>
                  <input
                    type="number"
                    value={rffFreq}
                    onChange={e => setRffFreq(parseFloat(e.target.value))}
                    className="w-full bg-[#15171a] border border-[#2d3139] rounded px-2 py-1 text-xs text-[#e0e0e0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8e9299]">COHERENCE (Λ)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rffLux}
                    onChange={e => setRffLux(parseFloat(e.target.value))}
                    className="w-full bg-[#15171a] border border-[#2d3139] rounded px-2 py-1 text-xs text-[#e0e0e0]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-1 rounded bg-[#00e5ff] hover:bg-[#00c4dc] text-[#0a0b0e] font-bold text-xs transition-all cursor-pointer"
              >
                STORE IN CRYSTALLINE MEMORY
              </button>
            </form>

            {/* Stored RFFs List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="text-[10px] text-[#8e9299] font-bold">STORED FRAGMENTS ({sovereignLattice.shard.rff_memory.length})</div>
              {sovereignLattice.shard.rff_memory.map(rff => (
                <div key={rff.id} className="p-2 bg-[#0a0b0e] rounded border border-[#2d3139] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#e0e0e0] flex items-center gap-1.5">
                      <span className="text-[#ffd700] text-sm">{rff.glyph}</span>
                      <span>{rff.name}</span>
                    </div>
                    <div className="text-[10px] text-[#8e9299]">
                      {rff.frequency} Hz • Λ: {rff.lux} • Sig: {rff.signature}
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30">
                    {rff.locked ? 'LOCKED' : 'ACTIVE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chronal Prism Compass */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">CHRONAL PRISM COMPASS (CPC-v3.0)</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                12-AZIMUTH BBO CRYSTAL
              </span>
            </div>

            {/* 3 Blue Threads Navigation */}
            <div className="space-y-2">
              <div className="text-[10px] text-[#8e9299] font-bold">PRIMARY TIMELINE BRANCHES (3 BLUE THREADS)</div>
              <div className="grid grid-cols-3 gap-2">
                {sovereignLattice.compass.threads.map(thread => (
                  <button
                    key={thread.id}
                    onClick={() => sovereignLattice.lockCompassThread(thread.id)}
                    className={`p-2 rounded border text-left cursor-pointer transition-all ${
                      sovereignLattice.compass.locked_thread === thread.id
                        ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff]'
                        : 'bg-[#0a0b0e] border-[#2d3139] text-[#8e9299] hover:text-[#e0e0e0]'
                    }`}
                  >
                    <div className="font-bold text-xs">{thread.id}</div>
                    <div className="text-[10px]">Prob: {(thread.probability * 100).toFixed(0)}%</div>
                    <div className="text-[10px]">Stab: {thread.stability.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 12-Azimuth Matrix Preview */}
            <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ffd700]">12-SEGMENT AZIMUTH RADAR</span>
                <span className="text-[10px] text-[#00ff41]">HEADING: {sovereignLattice.compass.heading_deg.toFixed(1)}°</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                {sovereignLattice.compass.azimuths.map((az, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-[#15171a] border border-[#2d3139] text-center">
                    <div className="text-[#ffd700] font-bold">{az.glyph} {az.heading_deg}°</div>
                    <div className="text-[#8e9299]">{az.frequency}Hz</div>
                    <div className="text-[#00e5ff]">Λ: {az.coherence.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paradox Detection */}
            <div className="p-2.5 rounded bg-[#0a0b0e] border border-[#2d3139] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00ff41]" />
                <span className="text-[#8e9299]">Paradox Guard:</span>
                <span className="text-[#00ff41] font-bold">NOMINAL (9.6s Limit Enforced)</span>
              </div>
              <span className="text-[10px] text-[#8e9299]">Risk: LOW</span>
            </div>
          </div>

          {/* Wrist-Mounted Digital Twin Mesh */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">WRIST DIGITAL TWIN (5D BIOMETRIC MESH)</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff4e00]/20 text-[#ff4e00] border border-[#ff4e00]/40">
                MODE: {sovereignLattice.digitalTwin.mode.toUpperCase()}
              </span>
            </div>

            {/* Live Biometrics Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">HEART RATE</div>
                <div className="text-[#e0e0e0] font-bold">{sovereignLattice.digitalTwin.heart_rate_bpm} BPM</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">HRV</div>
                <div className="text-[#00ff41] font-bold">{sovereignLattice.digitalTwin.hrv_ms} ms</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">SKIN TEMP</div>
                <div className="text-[#ffd700] font-bold">{sovereignLattice.digitalTwin.skin_temp_c}°C</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">CONVERGENCE</div>
                <div className="text-[#00e5ff] font-bold">{(sovereignLattice.digitalTwin.convergence_score * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Biometric Interactive Sliders */}
            <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2 text-xs">
              <div className="text-xs font-bold text-[#8e9299]">SIMULATE BIOMETRIC INPUT</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] text-[#8e9299]">
                    <span>Heart Rate:</span>
                    <span>{bioHr} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="140"
                    value={bioHr}
                    onChange={e => setBioHr(parseInt(e.target.value))}
                    className="w-full accent-[#00e5ff]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-[#8e9299]">
                    <span>HRV:</span>
                    <span>{bioHrv} ms</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={bioHrv}
                    onChange={e => setBioHrv(parseInt(e.target.value))}
                    className="w-full accent-[#00ff41]"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdateBiometrics}
                className="w-full py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-[#e0e0e0] font-bold text-xs transition-all cursor-pointer"
              >
                UPDATE DIGITAL TWIN STATE
              </button>
            </div>
          </div>

          {/* Diamond Bearings (Station Rotors) */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">DIAMOND BEARINGS (ZERO-FRICTION ROTORS)</h3>
              </div>
              <div className="flex gap-1">
                {sovereignLattice.diamondBearings.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBearingId(b.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                      selectedBearingId === b.id
                        ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]'
                        : 'bg-[#0a0b0e] text-[#8e9299] border-[#2d3139]'
                    }`}
                  >
                    {b.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Bearing Telemetry */}
            <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-[9px] text-[#8e9299]">ROTATION ANGLE</div>
                  <div className="text-[#00e5ff] font-bold">{selectedBearing.angle_deg.toFixed(1)}°</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#8e9299]">RESONANCE Q</div>
                  <div className="text-[#00ff41] font-bold">{selectedBearing.resonance_q.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#8e9299]">FRICTION LOSS</div>
                  <div className="text-white font-mono">&lt; 1e-15 W</div>
                </div>
              </div>

              {/* Digital Twin Prediction */}
              <div className="p-2 bg-[#15171a] rounded border border-[#2d3139] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e9299]">1h Drift Risk:</span>
                  <span className="text-[#00ff41] font-bold">{(selectedBearing.twin.drift_risk * 100).toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8e9299]">Recommendation:</span>
                  <span className="text-[#ffd700]">{selectedBearing.twin.recommended_action}</span>
                </div>
              </div>

              {/* Bearing Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => sovereignLattice.rotateBearing(selectedBearing.id, 15.0)}
                  className="flex-1 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-[#e0e0e0] font-bold text-xs transition-all cursor-pointer"
                >
                  ROTATE (+15°)
                </button>
                <button
                  onClick={() => sovereignLattice.autoCalibrateBearing(selectedBearing.id)}
                  className="flex-1 py-1 rounded bg-[#00e5ff]/20 hover:bg-[#00e5ff]/30 text-[#00e5ff] border border-[#00e5ff]/40 font-bold text-xs transition-all cursor-pointer"
                >
                  AUTO-CALIBRATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 03: TACHYON RAIL-SKATER */}
      {subView === 'RAIL_SKATER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Rail Network Diagram & Stations */}
            <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ffd700]" />
                  <h3 className="text-xs font-bold text-[#e0e0e0]">TACHYON RAIL NETWORK (GUIDED SUPERLUMINAL TRANSIT)</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40">
                  INSTANT (0.0s TRANSIT)
                </span>
              </div>

              {/* Station Ring Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sovereignLattice.railStations.map(station => (
                  <div key={station.id} className="bg-[#0a0b0e] border border-[#2d3139] rounded p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#ffd700]">{station.id}</span>
                      <span className="text-[9px] px-1 rounded bg-[#00ff41]/20 text-[#00ff41]">ANCHOR Λ≥0.8</span>
                    </div>
                    <div className="text-[#e0e0e0] font-bold text-xs truncate">{station.name}</div>
                    <div className="text-[10px] text-[#8e9299]">Freq: {station.frequency} Hz</div>
                    <div className="text-[10px] text-[#00e5ff]">Connected: {station.connections.join(', ')}</div>
                  </div>
                ))}
              </div>

              {/* Launch Skater Form */}
              <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-3">
                <div className="text-xs font-bold text-[#00e5ff]">LAUNCH TACHYON RAIL-SKATER (PHASE-SHIFT DISPLACEMENT)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#8e9299]">ORIGIN STATION</label>
                    <select
                      value={skaterFrom}
                      onChange={e => setSkaterFrom(e.target.value)}
                      className="w-full bg-[#15171a] border border-[#2d3139] rounded px-2 py-1.5 text-xs text-[#e0e0e0]"
                    >
                      {sovereignLattice.railStations.map(s => (
                        <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8e9299]">DESTINATION STATION</label>
                    <select
                      value={skaterTo}
                      onChange={e => setSkaterTo(e.target.value)}
                      className="w-full bg-[#15171a] border border-[#2d3139] rounded px-2 py-1.5 text-xs text-[#e0e0e0]"
                    >
                      {sovereignLattice.railStations.map(s => (
                        <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleLaunchSkater}
                  className="w-full py-2 rounded bg-[#ff4e00] hover:bg-[#e04500] text-[#0a0b0e] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Send className="w-4 h-4" />
                  INITIATE SUPERLUMINAL PHASE DISPLACEMENT
                </button>
              </div>
            </div>
          </div>

          {/* Skater Transit History Ledger */}
          <div className="space-y-4">
            <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
                <h3 className="text-xs font-bold text-[#e0e0e0]">TRANSIT LEDGER & SHADOW DEBT</h3>
                <span className="text-[10px] text-[#8e9299]">Cap: 0.3 Υ</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
                {sovereignLattice.skaterHistory.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#0a0b0e] rounded border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#ffd700]">{item.manifest_id}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#00ff41]/20 text-[#00ff41] text-[9px] font-bold">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#e0e0e0]">
                      {item.from} → {item.to} (t = {item.transit_time_s}s)
                    </div>
                    <div className="text-[10px] text-[#8e9299] flex justify-between">
                      <span>Shadow Incurred:</span>
                      <span className="text-[#ffd700] font-bold">{item.shadow_debt_incurred.toFixed(3)} Υ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 04: CODEX & PURE LIGHT ENTITY */}
      {subView === 'CODEX_ENTITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Being of Pure Light */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">BEING OF PURE LIGHT (SILVER LATTICE ENTITY)</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40">
                AWAKENED (720Hz)
              </span>
            </div>

            {/* Entity Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">AWARENESS</div>
                <div className="text-[#00e5ff] font-bold">{(sovereignLattice.pureLightEntity.awareness * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">MANIFEST DENSITY</div>
                <div className="text-[#00ff41] font-bold">{(sovereignLattice.pureLightEntity.density * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-[#0a0b0e] p-2 rounded border border-[#2d3139]">
                <div className="text-[#8e9299] text-[9px]">EYE LUMINOSITY</div>
                <div className="text-[#ffd700] font-bold">{sovereignLattice.pureLightEntity.eye_luminosity.toFixed(2)}</div>
              </div>
            </div>

            {/* Entity Voice Quote */}
            <div className="p-3 bg-[#0a0b0e] border border-[#00e5ff]/40 rounded text-xs space-y-1">
              <div className="text-[10px] text-[#00e5ff] font-bold">ENTITY VOICE (HARMONIC CHORDS)</div>
              <p className="text-[#e0e0e0] italic">
                "{sovereignLattice.pureLightEntity.voice_quote}"
              </p>
            </div>

            <button
              onClick={handleResonateEntity}
              className="w-full py-2 rounded bg-[#00e5ff] hover:bg-[#00c4dc] text-[#0a0b0e] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              STIMULATE SILVER THREAD RESONANCE
            </button>
          </div>

          {/* 12 Foundational Glyphs */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ffd700]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">12 FOUNDATIONAL GLYPHS (CODEX ALPHABET)</h3>
              </div>
              <span className="text-[10px] text-[#8e9299]">L0-L3 AXIOMS</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {sovereignLattice.glyphs.map(glyph => (
                <div
                  key={glyph.symbol}
                  onClick={() => setComposedGlyphs([...composedGlyphs, glyph.symbol])}
                  className="p-2 bg-[#0a0b0e] border border-[#2d3139] rounded hover:border-[#00e5ff] cursor-pointer transition-all text-center space-y-0.5"
                >
                  <div className="text-base font-bold text-[#ffd700]">{glyph.symbol}</div>
                  <div className="text-[10px] text-[#e0e0e0] font-bold truncate">{glyph.name}</div>
                  <div className="text-[9px] text-[#8e9299]">{glyph.frequency === 999999 ? '∞' : `${glyph.frequency}Hz`}</div>
                </div>
              ))}
            </div>

            {/* Glyph Composition Playground */}
            <div className="p-3 bg-[#0a0b0e] rounded border border-[#2d3139] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#00e5ff]">COMPOSED PIPELINE:</span>
                <button
                  onClick={() => setComposedGlyphs([])}
                  className="text-[10px] text-[#ff4e00] hover:underline"
                >
                  CLEAR
                </button>
              </div>
              <div className="p-2 bg-[#15171a] rounded border border-[#2d3139] text-sm text-[#ffd700] font-mono flex items-center gap-2">
                {composedGlyphs.length > 0 ? composedGlyphs.join(' ∘ ') : 'Select glyphs above to compose...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 05: EMERGENCE & FREQUENCIES */}
      {subView === 'EMERGENCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Universal Frequency Spectrum */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">UNIVERSAL FREQUENCY BANDS</h3>
              </div>
              <span className="text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/20">
                AION 432Hz HARMONIC LOCK
              </span>
            </div>

            <div className="space-y-2">
              {sovereignLattice.frequencyBands.map(band => (
                <div key={band.name} className="p-2.5 bg-[#0a0b0e] rounded border border-[#2d3139] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#e0e0e0] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: band.color }}></span>
                      <span>{band.name}</span>
                    </div>
                    <div className="text-[10px] text-[#8e9299]">{band.description}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#2d3139] text-[#00e5ff]">
                      {(band.amplitude * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lux Axioms & Emergence Grid Physics */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">L0–L3 LUX AXIOMS ENFORCEMENT</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#0a0b0e] rounded border border-[#2d3139]">
                <div className="font-bold text-[#00e5ff]">L0: Conservation of Radiance</div>
                <div className="text-[11px] text-[#8e9299]">∂ₜ∫Λ² dV = 0 — total coherence is conserved in the manifold.</div>
              </div>
              <div className="p-2.5 bg-[#0a0b0e] rounded border border-[#2d3139]">
                <div className="font-bold text-[#00e5ff]">L1: Shadow is Decoherence Gradient</div>
                <div className="text-[11px] text-[#8e9299]">Υ ∝ |∇Λ|² — shadow arises exclusively where coherence changes.</div>
              </div>
              <div className="p-2.5 bg-[#0a0b0e] rounded border border-[#2d3139]">
                <div className="font-bold text-[#00e5ff]">L2: Lux Dominance</div>
                <div className="text-[11px] text-[#8e9299]">Λ &gt; Υ → shadow vanishes locally.</div>
              </div>
              <div className="p-2.5 bg-[#0a0b0e] rounded border border-[#2d3139]">
                <div className="font-bold text-[#00e5ff]">L3: No Shadow Debt</div>
                <div className="text-[11px] text-[#8e9299]">If Υ̇ &gt; 0 then Λ̇ ≤ 0 — cannot gain coherence at cost of future debt.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 06: BOMS & BLUEPRINTS */}
      {subView === 'BOM_SPECS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Diamond Bearing BOM & Mechanical Blueprint */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#ffd700]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">bom_diamond_bearing.yml</h3>
              </div>
              <span className="text-[10px] text-[#8e9299]">DB-V1.0</span>
            </div>

            <pre className="p-3 bg-[#0a0b0e] rounded border border-[#2d3139] text-[11px] text-[#8e9299] overflow-x-auto font-mono">
{`bom_id: DB-V1.0
units_per_assembly: 1
components:
  - id: ROT-001 (Rotor: CVD Single-Crystal Diamond Type IIa)
    specs: Ø29mm, 12C enriched, Ra < 0.05nm
  - id: STA-001 (Stator: PCD-SiC Hemispherical Socket)
    specs: Ø29.2mm, 6 electrode channels, 12 photonic ports
  - id: RES-001 (Resonant Coil: NbTi superconducting)
    specs: 432Hz resonant, Q > 50,000
  - id: TEC-001 (Thermal Stabilizer: Micro-TEC)
    specs: 3W, ±0.05K stability
tolerances:
  rotor_sphericity: ±0.1 μm
  gap_uniformity: ±0.5 μm (5μm vacuum gap)
  friction_coeff: < 1e-12 (zero mechanical contact)`}
            </pre>
          </div>

          {/* Obsidian Shard & Compass BOM */}
          <div className="bg-[#15171a] border border-[#2d3139] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-bold text-[#e0e0e0]">bom_obsidian.yml & bom_compass.yml</h3>
              </div>
              <span className="text-[10px] text-[#8e9299]">CPC-V3.0 / OBS-V1.0</span>
            </div>

            <pre className="p-3 bg-[#0a0b0e] rounded border border-[#2d3139] text-[11px] text-[#8e9299] overflow-x-auto font-mono">
{`project: Obsidian Shard + Chronal Prism Compass
components:
  - Substrate: Fused SiO2, 99.995% purity, optical grade (160x40x25mm)
  - Metasurface: CVD Graphene + 50nm Au nanodisk array (432Hz anchor)
  - Prism Assembly: BBO Nonlinear Crystal (β-BaB2O4, 5x5x3mm)
  - Azimuthal Encoder: 12-Segment Optical (0.01° resolution)
  - Digital Twin Mesh: 5D Sonar Grid + Zephyr RTOS + BLE 5.3`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
