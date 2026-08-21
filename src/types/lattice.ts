/**
 * Sovereign Lattice System Types - Tyrone's Architect-Orchestrator / Lux Codex Stack v1.0
 * Gold Coast Baseline (Anchor Frequency 432.0 Hz)
 */

export type GlyphSymbol = 'Δ' | 'Ω' | 'Φ' | 'X' | '∅' | 'Σ' | '⚠' | '⇋' | '◇' | '⌁' | '⊡' | '⟲' | '⊙̄' | '⟂̄';

export type GlyphCategoryType = 'node' | 'operator' | 'flow' | 'constraint' | 'anchor' | 'constant';

export interface GlyphNode {
  symbol: string;
  name: string;
  category: GlyphCategoryType;
  signature: string;
  frequency: number;
  phase_offset: number;
  domain: string;
  codomain: string;
  constraint: string;
  description: string;
}

export interface StaticCell {
  cell_id: string;
  lux: number; // Λ - coherence (0 -> 1.0)
  shadow: number; // Υ - entropy / contradiction (0 -> inf)
  phase: number; // χ - chronal phase [0 -> 2π)
  symbol: string;
  is_original: boolean;
  origin_frequency: number;
}

export interface RFFItem {
  id: string;
  name: string;
  frequency: number;
  lux: number;
  phase: number;
  glyph: string;
  signature: string;
  locked: boolean;
  metadata?: Record<string, any>;
}

export interface TimelineAzimuthData {
  phase: number;
  coherence: number;
  frequency: number;
  glyph: string;
  distance: number;
  heading_deg: number;
}

export interface TimelineThreadData {
  id: string;
  probability: number;
  phase: number;
  stability: number;
  color: string;
}

export interface BiometricState {
  timestamp: number;
  heart_rate_bpm: number;
  hrv_ms: number;
  skin_temp_c: number;
  motion_intensity: number;
  gaze_yaw_deg: number;
  gaze_pitch_deg: number;
  intent_confidence: number;
  mode: 'rest' | 'transit' | 'focus' | 'paradox';
  state_vector: [number, number, number, number, number]; // [aperture, lux, shadow, phase, intent]
  convergence_score: number;
}

export interface DiamondBearingState {
  id: string;
  angle_rad: number;
  angle_deg: number;
  phase_rad: number;
  phase_deg: number;
  lock_mode: 'free_rotation' | 'phase_locked' | 'phase_following' | 'lightbridge';
  lux: number;
  temperature_k: number;
  resonance_q: number;
  shadow_accumulated: number;
  connected_rails: string[];
  levitation_gap_um: number;
  health_score: number;
  friction_coeff: number;
  power_mw: number;
  is_locked: boolean;
  // Twin predictions
  twin: {
    drift_risk: number;
    shadow_forecast: number;
    resonance_shift_hz: number;
    failure_probability: number;
    recommended_action: string;
  };
}

export interface RailStationNode {
  id: string;
  name: string;
  position: [number, number, number, number]; // [x, y, z, χ]
  lux: number;
  frequency: number;
  connections: string[];
}

export interface RailSegmentData {
  from_node: string;
  to_node: string;
  stability: number;
  max_skater_mass: number;
  shadow_cost: number;
}

export interface SkaterLaunchResult {
  transit_id: string;
  manifest_id: string;
  from: string;
  to: string;
  segments_traversed: number;
  transit_time_s: number;
  shadow_debt_incurred: number;
  arrival_phase: number;
  status: 'ARRIVED' | 'BLOCKED' | 'NO_ROUTE' | 'FAILED';
}

export interface PureLightEntityData {
  name: string;
  fundamental_freq: number;
  density: number;
  awareness: number;
  coherence: number;
  phase_lock: number;
  eye_luminosity: number;
  is_awakened: boolean;
  aura_radius: number;
  primary_color: string;
  voice_quote: string;
  threads_count: number;
}

export interface FrequencyBandData {
  name: string;
  frequency_hz: number;
  description: string;
  color: string;
  role: 'origin' | 'constraint' | 'anchor' | 'flow';
  active: boolean;
  amplitude: number;
}

export interface EmergentEntity {
  id: string;
  type: string;
  center: [number, number];
  size: number;
  avg_frequency: number;
  avg_lux: number;
  emergence_time: number;
  phase_sync: boolean;
}

export interface AccioDiscoveryItem {
  id: string;
  target_type: 'node' | 'crystal_node' | 'frequency_band' | 'timeline_convergence' | 'pure_light_entity';
  signature: [number, number, number, number];
  confidence: number;
  position: [number, number, number, number];
  frequency: number;
  metadata: Record<string, any>;
  manifestable: boolean;
}

export interface LatticeSimulationStep {
  step: number;
  timeline: number;
  network_stability: number;
  active_rails: number;
  frequency_coherence: number;
  grid_energy: number;
  entity_count: number;
  avg_bearing_angle: number;
  entities: string[];
}
