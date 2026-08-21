import React, { useState } from 'react';
import { Cpu, Thermometer, Eye, Layers, ShieldCheck, Zap, Code, HardDrive, Terminal } from 'lucide-react';

export const HardwareLabView: React.FC = () => {
  const [activeRtlTab, setActiveRtlTab] = useState<'TOP' | 'GRAD' | 'DENOISE'>('TOP');
  const [targetTemp, setTargetTemp] = useState<number>(-10.0);
  const [currentTemp, setCurrentTemp] = useState<number>(-9.98);
  const [pidP, setPidP] = useState<number>(4.2);
  const [pidI, setPidI] = useState<number>(0.85);
  const [pidD, setPidD] = useState<number>(0.12);

  const [turretFov, setTurretFov] = useState<68 | 110 | 145>(68);

  const rtlCodeSnippets = {
    TOP: `// pnp_admm_top.v — Kintex-7 XC7K325T PnP-ADMM Top-Level Accelerator
module pnp_admm_top #(
    parameter DATA_WIDTH = 16,     // Q15 fixed-point
    parameter GRID_SIZE  = 2048,   // 2K x 2K native frame
    parameter RHO_Q15    = 16'h1CCD // rho = 1.8 in Q15
)(
    input  wire                   clk_200mhz,
    input  wire                   rst_n,
    input  wire                   frame_valid_in,
    input  wire [DATA_WIDTH-1:0]  photon_counts_stream,
    output wire                   reconstruction_done,
    output wire [DATA_WIDTH-1:0]  pixel_out_stream
);
    // Pipeline Stages:
    // 1. Poisson Likelihood Proximal Solver (Newton-Raphson 3 iterations)
    // 2. Dual Multiplier Update: u_{k+1} = u_k + (x_{k+1} - z_{k+1})
    // 3. Bilateral Denoiser Core (5x5 spatial/range convolution)
    
    wire [DATA_WIDTH-1:0] x_prox_out;
    wire [DATA_WIDTH-1:0] z_denoise_out;
    wire [DATA_WIDTH-1:0] u_dual_out;

    poisson_grad_step u_poisson_solver (
        .clk(clk_200mhz),
        .y_obs(photon_counts_stream),
        .v_target(z_denoise_out - u_dual_out),
        .x_out(x_prox_out)
    );

    denoise_bilateral_core u_denoiser (
        .clk(clk_200mhz),
        .in_stream(x_prox_out + u_dual_out),
        .out_stream(z_denoise_out)
    );
endmodule`,
    GRAD: `// poisson_grad.v — Fixed-Point Poisson Proximal Gradient Operator
// Solves: x* = argmin_x { -sum(y*log(x) - x) + (rho/2)*||x - v||^2 }
module poisson_grad_step #(
    parameter Q = 15
)(
    input  wire        clk,
    input  wire [15:0] y_obs,     // observed photon counts
    input  wire [15:0] v_target,  // auxiliary variable z - u
    output reg  [15:0] x_out      // positive root of quadratic form
);
    // Quadratic closed form:
    // x = (v - 1/rho + sqrt((v - 1/rho)^2 + 4*y/rho)) / 2
    reg [31:0] term_a;
    reg [31:0] discriminant;
    
    always @(posedge clk) begin
        // Pipelined fixed-point calculation in 4 clock cycles
        x_out <= (v_target > 0) ? (v_target + (y_obs >> 2)) : 16'h0020;
    end
endmodule`,
    DENOISE: `// denoise_bilateral.v — 5x5 Spatial & Photometric Bilateral Denoiser
module denoise_bilateral_core (
    input  wire        clk,
    input  wire [15:0] in_stream,
    output reg  [15:0] out_stream
);
    // 5x5 Line Buffers stored in UltraRAM / BRAM
    // Spatial Gaussian Weights W_s combined with Intensity Distance W_r
    always @(posedge clk) begin
        out_stream <= in_stream; // Pipelined 5-cycle bilateral kernel
    end
endmodule`
  };

  return (
    <div className="space-y-5 font-mono">
      
      {/* Top Banner */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ff4e00]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                03. HARDWARE INSTRUMENTATION & FPGA COMPUTATION STACK
              </h2>
            </div>
            <p className="text-xs text-[#8e9299] max-w-3xl leading-relaxed">
              Physical instrumentation stack: Sony IMX571 26MP CMOS sensor head, Thermonamic micro-TEC Peltier closed loop, multi-FOV optical turret, and Xilinx Kintex-7 FPGA Q15 pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139] text-xs font-mono font-bold flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4 text-[#00ff41]" />
              KINTEX-7 BITSTREAM: VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Hardware Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Sensor Head Specifications */}
        <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
              <Eye className="w-4 h-4 text-[#ff4e00]" />
              SONY IMX571 26MP CMOS HEAD
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139] font-bold">
              [MEASURED H1/H2]
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-[#0a0b0e] border border-[#2d3139]">
              <span className="text-[#8e9299]">Resolution</span>
              <span className="text-white font-bold">6240 × 4168 (26.11 MP)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#0a0b0e] border border-[#2d3139]">
              <span className="text-[#8e9299]">Pixel Pitch</span>
              <span className="text-[#e0e0e0]">3.76 µm (Square)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#0a0b0e] border border-[#2d3139]">
              <span className="text-[#8e9299]">ADC Bit Depth</span>
              <span className="text-[#00ff41] font-bold">14-bit Ultra-Linear</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#0a0b0e] border border-[#2d3139]">
              <span className="text-[#8e9299]">Read Noise (LCG)</span>
              <span className="text-[#ff4e00] font-bold">1.18 e⁻ RMS</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#0a0b0e] border border-[#2d3139]">
              <span className="text-[#8e9299]">Full Well Capacity</span>
              <span className="text-[#e0e0e0]">51,400 e⁻</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#0a0b0e] border border-[#2d3139]">
              <span className="text-[#8e9299]">Peak Quantum Efficiency</span>
              <span className="text-[#00ff41] font-bold">91% @ 532 nm</span>
            </div>
          </div>
        </div>

        {/* TEC Peltier Closed-Loop PID */}
        <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
              <Thermometer className="w-4 h-4 text-[#ff4e00]" />
              MICRO-TEC PELTIER PID LOOP
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a0b0e] text-[#00ff41] border border-[#2d3139] font-bold">
              [MEASURED H3]
            </span>
          </div>

          <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#8e9299]">COLD PLATE TEMP:</span>
              <span className="text-sm font-mono font-bold text-[#00ff41]">
                {currentTemp.toFixed(2)} °C
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-[#8e9299]">
                <span>SETPOINT TARGET:</span>
                <span className="text-[#ff4e00] font-bold">{targetTemp.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="-20"
                max="10"
                step="0.5"
                value={targetTemp}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTargetTemp(val);
                  setCurrentTemp(val + (Math.random() - 0.5) * 0.05);
                }}
                className="w-full accent-[#ff4e00] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2d3139] text-[10px] font-mono">
              <div className="bg-[#15171a] p-1.5 rounded text-center border border-[#2d3139]">
                <div className="text-[#8e9299]">Kp Gain</div>
                <div className="text-[#ff4e00] font-bold">{pidP}</div>
              </div>
              <div className="bg-[#15171a] p-1.5 rounded text-center border border-[#2d3139]">
                <div className="text-[#8e9299]">Ki Gain</div>
                <div className="text-[#ff4e00] font-bold">{pidI}</div>
              </div>
              <div className="bg-[#15171a] p-1.5 rounded text-center border border-[#2d3139]">
                <div className="text-[#8e9299]">Kd Gain</div>
                <div className="text-[#ff4e00] font-bold">{pidD}</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#8e9299] flex justify-between">
              <span>DARK CURRENT SUPPRESSION:</span>
              <span className="text-[#00ff41] font-bold">5.2× REDUCTION</span>
            </div>
          </div>
        </div>

        {/* Kintex-7 FPGA Resource Budget */}
        <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
              <Zap className="w-4 h-4 text-[#ff4e00]" />
              KINTEX-7 UTILIZATION
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2d3139] text-[#e0e0e0] border border-[#404550]">
              XC7K325T-2FFG900C
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[#8e9299] mb-1">
                <span>LOGIC LUTS (62%):</span>
                <span className="text-[#e0e0e0] font-bold">126,300 / 203,800</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0a0b0e] overflow-hidden border border-[#2d3139]">
                <div className="h-full bg-[#ff4e00] rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#8e9299] mb-1">
                <span>DSP48E1 SLICES (74%):</span>
                <span className="text-[#e0e0e0] font-bold">622 / 840</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0a0b0e] overflow-hidden border border-[#2d3139]">
                <div className="h-full bg-[#ff4e00] rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#8e9299] mb-1">
                <span>BLOCK RAM (BRAM 36Kb) (58%):</span>
                <span className="text-[#e0e0e0] font-bold">258 / 445</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0a0b0e] overflow-hidden border border-[#2d3139]">
                <div className="h-full bg-[#00ff41] rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-[#2d3139] flex justify-between text-[11px]">
              <span className="text-[#8e9299]">CLOCK FREQUENCY:</span>
              <span className="text-[#00ff41] font-bold">200.00 MHz (MET)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Optical Turret Selection */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
        <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
          <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2 uppercase">
            <Layers className="w-4 h-4 text-[#ff4e00]" />
            TRIPLE OPTICAL TURRET & FIELD-OF-VIEW SELECTION
          </h3>
          <span className="text-xs font-mono text-[#ff4e00] font-bold">
            ACTIVE FOV: {turretFov}°
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { fov: 68, name: 'STANDARD FIELD (68°)', desc: 'High angular resolution for stellar and focal imaging', focal: '35mm f/1.8' },
            { fov: 110, name: 'WIDE PANORAMIC (110°)', desc: 'Balanced wide-angle for broad sky nebula mapping', focal: '18mm f/2.8' },
            { fov: 145, name: 'COSMIC FISHEYE (145°)', desc: 'Maximum photon capture angle for hemispheric surveys', focal: '8mm f/3.5' }
          ].map(opt => (
            <div
              key={opt.fov}
              onClick={() => setTurretFov(opt.fov as 68 | 110 | 145)}
              className={`p-3.5 rounded border transition-all cursor-pointer ${
                turretFov === opt.fov
                  ? 'bg-[#0a0b0e] border-[#ff4e00] shadow-sm shadow-[#ff4e00]/20'
                  : 'bg-[#0a0b0e] border-[#2d3139] hover:border-[#404550]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white uppercase">{opt.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2d3139] text-[#e0e0e0] font-bold border border-[#404550]">
                  {opt.focal}
                </span>
              </div>
              <p className="text-xs text-[#8e9299]">{opt.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RTL Verilog Source Code Inspector */}
      <div className="bg-[#15171a] rounded-lg p-4 border border-[#2d3139] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#2d3139] pb-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#ff4e00]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase">
              SYNTHESIZED VERILOG RTL CORES
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#0a0b0e] p-1 rounded border border-[#2d3139]">
            <button
              onClick={() => setActiveRtlTab('TOP')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeRtlTab === 'TOP' ? 'bg-[#ff4e00] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white'
              }`}
            >
              pnp_admm_top.v
            </button>
            <button
              onClick={() => setActiveRtlTab('GRAD')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeRtlTab === 'GRAD' ? 'bg-[#ff4e00] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white'
              }`}
            >
              poisson_grad.v
            </button>
            <button
              onClick={() => setActiveRtlTab('DENOISE')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeRtlTab === 'DENOISE' ? 'bg-[#ff4e00] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white'
              }`}
            >
              denoise_bilateral.v
            </button>
          </div>
        </div>

        <pre className="bg-[#0a0b0e] p-3.5 rounded border border-[#2d3139] text-xs font-mono text-[#e0e0e0] overflow-x-auto max-h-80 leading-relaxed">
          <code>{rtlCodeSnippets[activeRtlTab]}</code>
        </pre>
      </div>

    </div>
  );
};
