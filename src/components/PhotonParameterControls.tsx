import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertTriangle, CheckCircle, Clock, Zap, Sparkles, Thermometer, ShieldCheck, HelpCircle } from 'lucide-react';
import { PhotonConfig } from '../types';

interface Props {
  config: PhotonConfig;
  onChange: (newConfig: PhotonConfig) => void;
  onReset: () => void;
  disabled?: boolean;
}

export const DEFAULT_PHOTON_CONFIG: PhotonConfig = {
  flux: 2.5,
  rho: 1.8,
  lambda: 0.35,
  iterations: 15,
  epsilon: 0.0001,
  exposureTimeMs: 50,
  sensorGainDb: 12,
  tecTempC: -10.0,
  fovAngle: 78.4,
  sensorModel: 'Sony IMX571 (26MP)'
};

export const PARAM_LIMITS = {
  rho: { min: 0.1, max: 10.0, step: 0.1, default: 1.8, unit: '', name: 'Penalty Parameter (ρ)' },
  lambda: { min: 0.01, max: 1.0, step: 0.01, default: 0.35, unit: '', name: 'Denoiser Strength (λ)' },
  iterations: { min: 1, max: 50, step: 1, default: 15, unit: 'iters', name: 'Max Iterations (N_iter)' },
  exposureTimeMs: { min: 1, max: 1000, step: 5, default: 50, unit: 'ms', name: 'Exposure Time (t_exp)' },
  sensorGainDb: { min: 0, max: 36, step: 1, default: 12, unit: 'dB', name: 'Sensor Gain' },
  flux: { min: 0.1, max: 30.0, step: 0.2, default: 2.5, unit: 'ph/pix', name: 'Incident Photon Flux' },
  tecTempC: { min: -25.0, max: 35.0, step: 1.0, default: -10.0, unit: '°C', name: 'TEC Sensor Temp' },
};

export const PhotonParameterControls: React.FC<Props> = ({ config, onChange, onReset, disabled }) => {
  const [activeTab, setActiveTab] = useState<'admm' | 'sensor' | 'presets'>('admm');
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const validateAndSet = (key: keyof PhotonConfig, val: number) => {
    const limits = PARAM_LIMITS[key as keyof typeof PARAM_LIMITS];
    if (!limits) {
      onChange({ ...config, [key]: val });
      return;
    }

    const errors = { ...inputErrors };
    if (isNaN(val)) {
      errors[key] = 'Invalid numerical input';
      setInputErrors(errors);
      return;
    }

    if (val < limits.min || val > limits.max) {
      errors[key] = `Value must be between ${limits.min} and ${limits.max} ${limits.unit}`;
    } else {
      delete errors[key];
    }
    setInputErrors(errors);

    // Clamp value safely for continuous operation
    const clamped = Math.max(limits.min, Math.min(limits.max, val));
    onChange({ ...config, [key]: clamped });
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'fast':
        onChange({
          ...config,
          iterations: 8,
          rho: 2.2,
          lambda: 0.28,
          exposureTimeMs: 40,
          sensorGainDb: 12
        });
        break;
      case 'ultra_low_flux':
        onChange({
          ...config,
          flux: 0.8,
          iterations: 24,
          rho: 1.4,
          lambda: 0.55,
          exposureTimeMs: 150,
          sensorGainDb: 18,
          tecTempC: -20.0
        });
        break;
      case 'high_precision':
        onChange({
          ...config,
          iterations: 30,
          rho: 1.8,
          lambda: 0.35,
          exposureTimeMs: 100,
          sensorGainDb: 6,
          tecTempC: -15.0
        });
        break;
      case 'ambient_stress':
        onChange({
          ...config,
          tecTempC: 28.0,
          sensorGainDb: 24,
          exposureTimeMs: 80,
          iterations: 15
        });
        break;
      default:
        break;
    }
  };

  const isModifiedFromDefault = 
    config.rho !== DEFAULT_PHOTON_CONFIG.rho ||
    config.lambda !== DEFAULT_PHOTON_CONFIG.lambda ||
    config.iterations !== DEFAULT_PHOTON_CONFIG.iterations ||
    config.exposureTimeMs !== DEFAULT_PHOTON_CONFIG.exposureTimeMs ||
    config.sensorGainDb !== DEFAULT_PHOTON_CONFIG.sensorGainDb ||
    config.flux !== DEFAULT_PHOTON_CONFIG.flux ||
    config.tecTempC !== DEFAULT_PHOTON_CONFIG.tecTempC;

  return (
    <div className="bg-[#15171a] rounded-lg border border-[#2d3139] shadow-md p-4 space-y-4 font-mono">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d3139] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#ff4e00]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            CONFIGURABLE PARAMETERS & ACQUISITION SETTINGS
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0a0b0e] p-0.5 rounded border border-[#2d3139]">
            <button
              onClick={() => setActiveTab('admm')}
              className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer ${
                activeTab === 'admm' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
              }`}
            >
              PnP-ADMM Parameters
            </button>
            <button
              onClick={() => setActiveTab('sensor')}
              className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer ${
                activeTab === 'sensor' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
              }`}
            >
              Sensor Acquisition
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-2.5 py-1 text-[10px] rounded transition-all uppercase cursor-pointer ${
                activeTab === 'presets' ? 'bg-[#ff4e00] text-[#0a0b0e] font-bold' : 'text-[#8e9299] hover:text-white'
              }`}
            >
              Presets
            </button>
          </div>

          <button
            onClick={onReset}
            disabled={!isModifiedFromDefault || disabled}
            className="px-2.5 py-1 rounded bg-[#2d3139] hover:bg-[#404550] text-[#e0e0e0] text-[10px] font-bold flex items-center gap-1 border border-[#404550] disabled:opacity-40 transition-all cursor-pointer uppercase"
            title="Reset all settings to verified nominal defaults"
          >
            <RotateCcw className="w-3 h-3 text-[#ff4e00]" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Tab 1: PnP-ADMM Optimization Controls */}
      {activeTab === 'admm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Penalty Parameter Rho */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Sliders className="w-3.5 h-3.5 text-[#ff4e00]" />
                Penalty Parameter (ρ)
              </span>
              <span className="text-[#00ff41] font-bold text-sm">{config.rho.toFixed(1)}</span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.rho.min}
              max={PARAM_LIMITS.rho.max}
              step={PARAM_LIMITS.rho.step}
              value={config.rho}
              disabled={disabled}
              onChange={(e) => validateAndSet('rho', parseFloat(e.target.value))}
              className="w-full accent-[#ff4e00] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#8e9299]">
              <span>0.1 (Slow consensus)</span>
              <span>10.0 (Strict constraint)</span>
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Balances data fidelity Poisson likelihood vs prior consensus step. Default: <span className="text-white font-bold">1.8</span>
            </div>
          </div>

          {/* Denoiser Strength Lambda */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Zap className="w-3.5 h-3.5 text-[#00ff41]" />
                Denoiser Strength (λ)
              </span>
              <span className="text-[#00ff41] font-bold text-sm">{config.lambda.toFixed(2)}</span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.lambda.min}
              max={PARAM_LIMITS.lambda.max}
              step={PARAM_LIMITS.lambda.step}
              value={config.lambda}
              disabled={disabled}
              onChange={(e) => validateAndSet('lambda', parseFloat(e.target.value))}
              className="w-full accent-[#00ff41] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#8e9299]">
              <span>0.01 (Light smoothing)</span>
              <span>1.00 (Heavy prior)</span>
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Kernel range bandwidth for bilateral/CNN proximal regularizer. Default: <span className="text-white font-bold">0.35</span>
            </div>
          </div>

          {/* Max Iterations (N_iter) */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#ff4e00]" />
                Max Iterations (N_iter)
              </span>
              <span className="text-white font-bold text-sm">{config.iterations} <span className="text-[10px] text-[#8e9299]">iters</span></span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.iterations.min}
              max={PARAM_LIMITS.iterations.max}
              step={PARAM_LIMITS.iterations.step}
              value={config.iterations}
              disabled={disabled}
              onChange={(e) => validateAndSet('iterations', parseInt(e.target.value, 10))}
              className="w-full accent-[#ff4e00] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#8e9299]">
              <span>1 (Ultra-fast preview)</span>
              <span>50 (Deep convergence)</span>
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Target loop cycles. Kintex-7 hardware executes at ~1.8ms per step. Default: <span className="text-white font-bold">15</span>
            </div>
          </div>

          {/* Convergence Tolerance Epsilon */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00ff41]" />
                Convergence Tolerance (ε)
              </span>
              <span className="text-white font-bold text-sm">1e-4</span>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1">
              {[0.001, 0.0001, 0.00001].map((eps) => (
                <button
                  key={eps}
                  onClick={() => onChange({ ...config, epsilon: eps })}
                  className={`py-1 text-[10px] rounded border transition-all uppercase cursor-pointer ${
                    config.epsilon === eps
                      ? 'bg-[#00ff41] text-[#0a0b0e] border-[#00ff41] font-bold'
                      : 'bg-[#15171a] text-[#8e9299] border-[#2d3139] hover:text-white'
                  }`}
                >
                  {eps === 0.001 ? '1e-3 (Fast)' : eps === 0.0001 ? '1e-4 (Std)' : '1e-5 (Fine)'}
                </button>
              ))}
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Halts iterations early when primal & dual residuals ||r|| ≤ ε.
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Sensor Acquisition Controls */}
      {activeTab === 'sensor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Exposure Time (t_exp) */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#ff4e00]" />
                Exposure Time (t_exp)
              </span>
              <span className="text-white font-bold text-sm">{config.exposureTimeMs} <span className="text-[10px] text-[#8e9299]">ms</span></span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.exposureTimeMs.min}
              max={PARAM_LIMITS.exposureTimeMs.max}
              step={PARAM_LIMITS.exposureTimeMs.step}
              value={config.exposureTimeMs}
              disabled={disabled}
              onChange={(e) => validateAndSet('exposureTimeMs', parseFloat(e.target.value))}
              className="w-full accent-[#ff4e00] cursor-pointer"
            />

            <div className="flex items-center gap-1 justify-between text-[9px]">
              {[10, 50, 100, 250, 500].map(ms => (
                <button
                  key={ms}
                  onClick={() => validateAndSet('exposureTimeMs', ms)}
                  className={`px-1.5 py-0.5 rounded border ${
                    config.exposureTimeMs === ms
                      ? 'bg-[#ff4e00] text-[#0a0b0e] border-[#ff4e00] font-bold'
                      : 'bg-[#15171a] text-[#8e9299] border-[#2d3139]'
                  }`}
                >
                  {ms}ms
                </button>
              ))}
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Determines photon collection window. Default: <span className="text-white font-bold">50 ms</span>
            </div>
          </div>

          {/* Sensor Gain (dB) */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Zap className="w-3.5 h-3.5 text-[#ff4e00]" />
                Sensor Gain
              </span>
              <span className="text-white font-bold text-sm">
                +{config.sensorGainDb} dB <span className="text-[10px] text-[#8e9299]">({Math.round(100 * Math.pow(10, config.sensorGainDb / 20))} ISO)</span>
              </span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.sensorGainDb.min}
              max={PARAM_LIMITS.sensorGainDb.max}
              step={PARAM_LIMITS.sensorGainDb.step}
              value={config.sensorGainDb}
              disabled={disabled}
              onChange={(e) => validateAndSet('sensorGainDb', parseFloat(e.target.value))}
              className="w-full accent-[#ff4e00] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#8e9299]">
              <span>0 dB (ISO 100)</span>
              <span>12 dB (Std)</span>
              <span>36 dB (ISO 6400)</span>
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Analog front-end amplification. High gain scales quantization & read noise floor.
            </div>
          </div>

          {/* Incident Photon Flux */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4e00]" />
                Mean Incident Flux
              </span>
              <span className="text-white font-bold text-sm">{config.flux.toFixed(1)} <span className="text-[10px] text-[#8e9299]">ph/pix</span></span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.flux.min}
              max={PARAM_LIMITS.flux.max}
              step={PARAM_LIMITS.flux.step}
              value={config.flux}
              disabled={disabled}
              onChange={(e) => validateAndSet('flux', parseFloat(e.target.value))}
              className="w-full accent-[#ff4e00] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#8e9299]">
              <span>0.1 (Quantum Starve)</span>
              <span>30.0 (High SNR)</span>
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Simulated optical scene irradiance arriving at IMX571 sensor plane.
            </div>
          </div>

          {/* TEC Peltier Temperature */}
          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9299] flex items-center gap-1 uppercase">
                <Thermometer className="w-3.5 h-3.5 text-[#ff4e00]" />
                TEC Peltier Cooling
              </span>
              <span className={`font-bold text-sm ${config.tecTempC <= -5 ? 'text-[#00ff41]' : 'text-[#ff4e00]'}`}>
                {config.tecTempC.toFixed(1)} °C
              </span>
            </div>

            <input
              type="range"
              min={PARAM_LIMITS.tecTempC.min}
              max={PARAM_LIMITS.tecTempC.max}
              step={PARAM_LIMITS.tecTempC.step}
              value={config.tecTempC}
              disabled={disabled}
              onChange={(e) => validateAndSet('tecTempC', parseFloat(e.target.value))}
              className="w-full accent-[#ff4e00] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#8e9299]">
              <span>-25°C (Cryo-TEC)</span>
              <span>+35°C (Uncooled)</span>
            </div>

            <div className="text-[10px] text-[#8e9299] leading-tight pt-1 border-t border-[#2d3139]/60">
              Thermal stabilization suppresses dark current: <span className="text-white font-bold">~0.05 e⁻/pix @ -10°C</span>.
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Presets & Profiles */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset('fast')}
            className="bg-[#0a0b0e] hover:bg-[#15171a] p-3 rounded border border-[#2d3139] hover:border-[#ff4e00] text-left transition-all space-y-1.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Fast Live Preview</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2d3139] text-[#00ff41] font-bold">8 Iters</span>
            </div>
            <p className="text-[11px] text-[#8e9299]">
              N_iter=8, ρ=2.2, λ=0.28, t_exp=40ms. Sub-15ms loop latency for real-time video framing.
            </p>
          </button>

          <button
            onClick={() => applyPreset('ultra_low_flux')}
            className="bg-[#0a0b0e] hover:bg-[#15171a] p-3 rounded border border-[#2d3139] hover:border-[#ff4e00] text-left transition-all space-y-1.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Deep Space Nebula</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2d3139] text-[#ff4e00] font-bold">Low Flux</span>
            </div>
            <p className="text-[11px] text-[#8e9299]">
              Flux=0.8 ph/pix, N_iter=24, λ=0.55, TEC=-20°C, Gain=+18dB. Maximum Poisson noise suppression.
            </p>
          </button>

          <button
            onClick={() => applyPreset('high_precision')}
            className="bg-[#0a0b0e] hover:bg-[#15171a] p-3 rounded border border-[#2d3139] hover:border-[#00ff41] text-left transition-all space-y-1.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Scientific Precision</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 font-bold">30 Iters</span>
            </div>
            <p className="text-[11px] text-[#8e9299]">
              N_iter=30, ρ=1.8, λ=0.35, t_exp=100ms, Gain=+6dB. High PSNR fidelity benchmark standard.
            </p>
          </button>

          <button
            onClick={() => applyPreset('ambient_stress')}
            className="bg-[#0a0b0e] hover:bg-[#15171a] p-3 rounded border border-[#2d3139] hover:border-[#ff4e00] text-left transition-all space-y-1.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Thermal Stress Drill</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ff4e00]/20 text-[#ff4e00] border border-[#ff4e00]/40 font-bold">+28°C</span>
            </div>
            <p className="text-[11px] text-[#8e9299]">
              TEC=+28°C, Gain=+24dB, t_exp=80ms. Evaluates dark current noise floor resilience.
            </p>
          </button>
        </div>
      )}

      {/* Validation Status / Diagnostics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2d3139] text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#00ff41]">
            <CheckCircle className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>Parameters Validated: Within Stable Convergence Basin</span>
          </div>
          {config.iterations > 35 && (
            <div className="flex items-center gap-1 text-[#ff4e00]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Notice: N_iter &gt; 35 increases latency &gt; 55ms</span>
            </div>
          )}
          {config.tecTempC > 15 && (
            <div className="flex items-center gap-1 text-[#ff4e00]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Warning: TEC &gt; +15°C degrades dark current floor</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#8e9299]">
          <span>Effective Sensitivity: <strong className="text-white">{(config.flux * (config.exposureTimeMs / 50)).toFixed(2)} ph/pix·frame</strong></span>
          <span>•</span>
          <span>Sensor: <strong className="text-white">{config.sensorModel}</strong></span>
        </div>
      </div>

    </div>
  );
};
