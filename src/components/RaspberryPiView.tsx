import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Radio,
  Sliders,
  Terminal,
  Zap,
  Flame,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Camera,
  Activity,
  Layers,
  Sparkles,
  Wifi,
  HardDrive,
  Maximize2
} from 'lucide-react';
import { RPiModel, RPiGpioPin, RPiI2cDevice, RPiCameraRibbonState, RPiSystemTelemetry } from '../types';

export const RaspberryPiView: React.FC = () => {
  // RPi Telemetry State
  const [telemetry, setTelemetry] = useState<RPiSystemTelemetry>({
    model: 'RPI_5_8GB',
    soc: 'Broadcom BCM2712 Quad-Core Cortex-A76 @ 2.4 GHz',
    cpuTempC: 42.4,
    throttleState: 'NORMAL',
    armFreqMhz: 2400,
    gpuFreqMhz: 900,
    ramUsageMb: 2180,
    totalRamMb: 8192,
    gpuMemorySplitMb: 512,
    fanSpeedRpm: 2850,
    uartBaud: 115200,
    gpioPins: [
      { pinNumber: 1, bcmNumber: null, name: '3V3 PWR', type: '3V3_PWR', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'NONE', description: '3.3V Power Rail' },
      { pinNumber: 2, bcmNumber: null, name: '5V PWR', type: '5V_PWR', direction: 'ALT_FUNC', state: 'HIGH', voltage: 5.0, pull: 'NONE', description: '5.0V Main Rail' },
      { pinNumber: 3, bcmNumber: 2, name: 'GPIO 2 (SDA)', type: 'I2C_SDA', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'I2C1 Data' },
      { pinNumber: 4, bcmNumber: null, name: '5V PWR', type: '5V_PWR', direction: 'ALT_FUNC', state: 'HIGH', voltage: 5.0, pull: 'NONE', description: '5.0V Main Rail' },
      { pinNumber: 5, bcmNumber: 3, name: 'GPIO 3 (SCL)', type: 'I2C_SCL', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'I2C1 Clock' },
      { pinNumber: 6, bcmNumber: null, name: 'GND', type: 'GND', direction: 'ALT_FUNC', state: 'LOW', voltage: 0.0, pull: 'NONE', description: 'Ground' },
      { pinNumber: 7, bcmNumber: 4, name: 'GPIO 4 (GPCLK0)', type: 'GPIO', direction: 'OUT', state: 'LOW', voltage: 0.0, pull: 'DOWN', description: '1-Wire / General IO' },
      { pinNumber: 8, bcmNumber: 14, name: 'GPIO 14 (TXD)', type: 'UART_TX', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'UART0 Serial TX' },
      { pinNumber: 9, bcmNumber: null, name: 'GND', type: 'GND', direction: 'ALT_FUNC', state: 'LOW', voltage: 0.0, pull: 'NONE', description: 'Ground' },
      { pinNumber: 10, bcmNumber: 15, name: 'GPIO 15 (RXD)', type: 'UART_RX', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'UART0 Serial RX' },
      { pinNumber: 11, bcmNumber: 17, name: 'GPIO 17', type: 'GPIO', direction: 'OUT', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'Trigger Pulse A' },
      { pinNumber: 12, bcmNumber: 18, name: 'GPIO 18 (PWM0)', type: 'PWM0', direction: 'OUT', state: 'PWM', voltage: 3.3, pwmDutyPercent: 85, pull: 'DOWN', description: 'Hardware PWM Fan Control' },
      { pinNumber: 13, bcmNumber: 27, name: 'GPIO 27', type: 'GPIO', direction: 'OUT', state: 'LOW', voltage: 0.0, pull: 'DOWN', description: 'J09 BLE Sync Strobe' },
      { pinNumber: 14, bcmNumber: null, name: 'GND', type: 'GND', direction: 'ALT_FUNC', state: 'LOW', voltage: 0.0, pull: 'NONE', description: 'Ground' },
      { pinNumber: 15, bcmNumber: 22, name: 'GPIO 22', type: 'GPIO', direction: 'IN', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'Laser Interlock IN' },
      { pinNumber: 16, bcmNumber: 23, name: 'GPIO 23', type: 'GPIO', direction: 'OUT', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'Metasurface Gate B' },
      { pinNumber: 17, bcmNumber: null, name: '3V3 PWR', type: '3V3_PWR', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'NONE', description: '3.3V Power Rail' },
      { pinNumber: 18, bcmNumber: 24, name: 'GPIO 24', type: 'GPIO', direction: 'OUT', state: 'LOW', voltage: 0.0, pull: 'DOWN', description: 'General IO' },
      { pinNumber: 19, bcmNumber: 10, name: 'GPIO 10 (MOSI)', type: 'SPI_MOSI', direction: 'ALT_FUNC', state: 'LOW', voltage: 0.0, pull: 'NONE', description: 'SPI0 Master Out' },
      { pinNumber: 20, bcmNumber: null, name: 'GND', type: 'GND', direction: 'ALT_FUNC', state: 'LOW', voltage: 0.0, pull: 'NONE', description: 'Ground' },
      { pinNumber: 21, bcmNumber: 9, name: 'GPIO 9 (MISO)', type: 'SPI_MISO', direction: 'ALT_FUNC', state: 'LOW', voltage: 0.0, pull: 'NONE', description: 'SPI0 Master In' },
      { pinNumber: 22, bcmNumber: 25, name: 'GPIO 25', type: 'GPIO', direction: 'IN', state: 'LOW', voltage: 0.0, pull: 'DOWN', description: 'Shutter Sync Input' },
      { pinNumber: 23, bcmNumber: 11, name: 'GPIO 11 (SCLK)', type: 'SPI_SCLK', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'NONE', description: 'SPI0 Clock (32MHz)' },
      { pinNumber: 24, bcmNumber: 8, name: 'GPIO 8 (CE0)', type: 'SPI_CE0', direction: 'ALT_FUNC', state: 'HIGH', voltage: 3.3, pull: 'UP', description: 'SPI0 Chip Enable 0' }
    ],
    i2cDevices: [
      { addressHex: '0x3C', deviceType: 'SSD1306 128x64 OLED Display', bus: 1, status: 'ONLINE', dataRegister: '0x00..0xFF' },
      { addressHex: '0x68', deviceType: 'MPU6050 6-Axis IMU Sensor', bus: 1, status: 'DMA_TRANSFER', dataRegister: 'ACCEL_X: 0.02g' },
      { addressHex: '0x76', deviceType: 'BME280 Temp/Humidity/Pressure', bus: 1, status: 'ONLINE', dataRegister: '24.2C / 1013hPa' }
    ],
    cameraRibbon: {
      cameraType: 'PI_CAM_V3_IMX708_AUTOFOCUS',
      csiPort: 'CSI_0',
      resolution: '4608×2592 (12MP HDR)',
      framerate: 60,
      autofocusMode: 'CONTINUOUS',
      focusDistanceMeters: 0.85,
      rawBayerLaneWidth: 4,
      dmaThroughputMbps: 1840,
      active: true
    },
    serialLogs: [
      '[RPi5-BCM2712] Bootloader init: PCIe 2.0 x1 GEN2 active (J09 Bridge Mapped)',
      '[libcamera-apps] IMX708 detected on /dev/video0 via 4-lane MIPI CSI-2',
      '[rpicam-vid] Output stream locked: 4608x2592 @ 60fps YUV420 DMA-BUF',
      '[i2c-1] Bus probe: 0x3C (OLED), 0x68 (IMU), 0x76 (BME280) initialized',
      '[gpio] GPIO 18 hardware PWM duty locked to 85% (Fan RPM: 2850)'
    ]
  });

  const [selectedPinNumber, setSelectedPinNumber] = useState<number>(12);
  const [terminalInput, setTerminalInput] = useState('vcgencmd measure_temp');

  // Toggle GPIO pin state
  const handleTogglePin = (pinNum: number) => {
    setTelemetry(prev => ({
      ...prev,
      gpioPins: prev.gpioPins.map(pin => {
        if (pin.pinNumber === pinNum && (pin.type === 'GPIO' || pin.type.startsWith('PWM'))) {
          const nextState = pin.state === 'HIGH' ? 'LOW' : 'HIGH';
          return {
            ...pin,
            state: nextState,
            voltage: nextState === 'HIGH' ? 3.3 : 0.0
          };
        }
        return pin;
      })
    }));
  };

  // Run Terminal Command
  const handleRunCommand = (cmd: string) => {
    let output = `pi@sovereign-rpi5:~ $ ${cmd}`;
    if (cmd.includes('measure_temp')) {
      output += `\ntemp=42.4'C (Target: < 65'C)`;
    } else if (cmd.includes('get_throttled')) {
      output += `\nthrottled=0x0 (Under-voltage: NO, Throttling: NO, Frequency Capped: NO)`;
    } else if (cmd.includes('pinout')) {
      output += `\nRaspberry Pi 5 Model B Rev 1.0 (8GB RAM)\nBCM2712 Quad-Core Cortex-A76 @ 2.4GHz | 40-Pin Header active`;
    } else if (cmd.includes('rpicam')) {
      output += `\n[rpicam-hello] Sensor: Sony IMX708 [4608x2592] | 4-lane MIPI CSI-2 | Frame Latency: 4.1ms`;
    } else {
      output += `\nCommand executed successfully with exit code 0`;
    }

    setTelemetry(prev => ({
      ...prev,
      serialLogs: [...prev.serialLogs.slice(-15), output]
    }));
    setTerminalInput('');
  };

  const selectedPin = telemetry.gpioPins.find(p => p.pinNumber === selectedPinNumber) || telemetry.gpioPins[0];

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Top Header & Model Selector */}
      <div className="bg-[#12151b] border border-[#2d3340] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#ff4e00]/15 border border-[#ff4e00]/40 rounded-lg text-[#ff4e00]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wide">RASPBERRY PI 5 / CM4 HARDWARE INTEGRATION</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#46d369]/20 text-[#46d369] border border-[#46d369]/30">
                MIPI CSI-2 & GPIO ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#8e9299] mt-0.5">
              40-Pin interactive GPIO header, MIPI CSI camera ribbon interface, I2C/SPI bus scanners & UART hardware console
            </p>
          </div>
        </div>

        {/* Model Presets */}
        <div className="flex items-center gap-2">
          {(['RPI_5_8GB', 'RPI_CM4_DUAL_CSI', 'RPI_4_B', 'RPI_ZERO_2_W'] as RPiModel[]).map(m => (
            <button
              key={m}
              onClick={() => setTelemetry(t => ({ ...t, model: m }))}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border ${
                telemetry.model === m
                  ? 'bg-[#ff4e00] text-black border-[#ff4e00] shadow-sm'
                  : 'bg-[#1b202a] text-[#8e9299] hover:text-white border-[#3b4252]'
              }`}
            >
              {m.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Hardware Telemetry Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">SOC TEMP</span>
          <div className="text-lg font-bold text-[#46d369] flex items-baseline gap-1 mt-0.5">
            {telemetry.cpuTempC}°C
          </div>
          <div className="text-[9px] text-[#8e9299]">Fan: {telemetry.fanSpeedRpm} RPM</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">ARM CLOCK</span>
          <div className="text-lg font-bold text-[#00e5ff] flex items-baseline gap-1 mt-0.5">
            {telemetry.armFreqMhz} <span className="text-[10px] text-[#8e9299]">MHz</span>
          </div>
          <div className="text-[9px] text-[#46d369]">GPU: {telemetry.gpuFreqMhz} MHz</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">RAM LOAD</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-0.5">
            {telemetry.ramUsageMb} <span className="text-[10px] text-[#8e9299]">/ {telemetry.totalRamMb} MB</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">GPU Split: {telemetry.gpuMemorySplitMb} MB</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">CSI RIBBON</span>
          <div className="text-lg font-bold text-[#b388ff] flex items-baseline gap-1 mt-0.5">
            4-LANE <span className="text-[10px] text-[#8e9299]">MIPI</span>
          </div>
          <div className="text-[9px] text-[#00e5ff]">{telemetry.cameraRibbon.dmaThroughputMbps} Mbps</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">I2C BUS 1</span>
          <div className="text-lg font-bold text-[#ffb300] flex items-baseline gap-1 mt-0.5">
            3 <span className="text-[10px] text-[#8e9299]">DEVICES</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">0x3C, 0x68, 0x76</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">THROTTLE STATE</span>
          <div className="text-lg font-bold text-[#46d369] flex items-baseline gap-1 mt-0.5">
            0x0 <span className="text-[10px] text-[#46d369]">OK</span>
          </div>
          <div className="text-[9px] text-[#46d369]">No Under-voltage</div>
        </div>
      </div>

      {/* Main 2-Column: 40-Pin GPIO Matrix + Camera/Bus Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 40-Pin Interactive GPIO Header */}
        <div className="lg:col-span-6 bg-[#12151b] border border-[#262b36] rounded-xl p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[#232834] pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ff4e00]" />
              <span className="font-bold text-white uppercase">40-PIN EXPANSION HEADER MATRIX</span>
            </div>
            <span className="text-[10px] text-[#8e9299]">Click GPIO Pin to Toggle Output</span>
          </div>

          {/* Interactive Pin List (Odd/Even Columns) */}
          <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {telemetry.gpioPins.map(pin => {
              const isSelected = pin.pinNumber === selectedPinNumber;
              const isPower = pin.type.includes('PWR');
              const isGround = pin.type === 'GND';
              const isHigh = pin.state === 'HIGH' || pin.state === 'PWM';

              return (
                <div
                  key={pin.pinNumber}
                  onClick={() => {
                    setSelectedPinNumber(pin.pinNumber);
                    if (pin.type === 'GPIO' || pin.type.startsWith('PWM')) {
                      handleTogglePin(pin.pinNumber);
                    }
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-white shadow-sm'
                      : isPower
                      ? 'bg-[#ff4e00]/10 border-[#ff4e00]/30 text-[#ff8a65]'
                      : isGround
                      ? 'bg-[#181c24] border-[#262b36] text-[#8e9299]'
                      : 'bg-[#181c24] border-[#262b36] text-[#c0c6d0] hover:border-[#3b4252]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 text-[10px] font-bold text-[#8e9299] shrink-0 font-mono">
                      {pin.pinNumber}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-[11px] truncate block">{pin.name}</span>
                      <span className="text-[8px] text-[#8e9299] truncate block">{pin.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${
                      isHigh ? 'bg-[#46d369] shadow-sm shadow-[#46d369]' : 'bg-[#2b303c]'
                    }`} />
                    <span className="text-[9px] font-bold font-mono">
                      {pin.state}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Pin Details & PWM Slider */}
          <div className="bg-[#0a0c10] border border-[#232834] p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white font-bold">PIN {selectedPin.pinNumber}: {selectedPin.name}</span>
              <span className="text-[#00e5ff] font-bold">{selectedPin.voltage}V | {selectedPin.pull} PULL</span>
            </div>
            <div className="text-[10px] text-[#8e9299]">{selectedPin.description}</div>
            {selectedPin.type.startsWith('PWM') && (
              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-[#8e9299] mb-1">
                  <span>HARDWARE PWM DUTY CYCLE:</span>
                  <span className="text-[#ff4e00] font-bold">{selectedPin.pwmDutyPercent || 85}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedPin.pwmDutyPercent || 85}
                  onChange={e => {
                    const duty = Number(e.target.value);
                    setTelemetry(prev => ({
                      ...prev,
                      gpioPins: prev.gpioPins.map(p => (p.pinNumber === selectedPin.pinNumber ? { ...p, pwmDutyPercent: duty } : p))
                    }));
                  }}
                  className="w-full accent-[#ff4e00]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: MIPI CSI Camera Ribbon & Serial Console */}
        <div className="lg:col-span-6 space-y-4">
          {/* MIPI CSI Camera Ribbon Interface */}
          <div className="bg-[#12151b] border border-[#262b36] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#232834] pb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#00e5ff]" />
                <span className="font-bold text-white uppercase">MIPI CSI-2 CAMERA RIBBON INTERFACE</span>
              </div>
              <span className="px-2 py-0.5 bg-[#00e5ff]/20 text-[#00e5ff] rounded text-[9px] font-bold border border-[#00e5ff]/40">
                {telemetry.cameraRibbon.csiPort}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#0a0c10] p-2 rounded border border-[#232834]">
                <span className="text-[#8e9299] block">SENSOR:</span>
                <span className="text-white font-bold">{telemetry.cameraRibbon.cameraType}</span>
              </div>
              <div className="bg-[#0a0c10] p-2 rounded border border-[#232834]">
                <span className="text-[#8e9299] block">RESOLUTION & FPS:</span>
                <span className="text-[#46d369] font-bold">{telemetry.cameraRibbon.resolution} @ {telemetry.cameraRibbon.framerate}fps</span>
              </div>
            </div>

            {/* Simulated Live Libcamera Ribbon Stream */}
            <div className="relative w-full h-[140px] bg-[#0a0c10] border border-[#232834] rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="text-center space-y-1 z-10">
                <span className="px-2.5 py-1 bg-[#46d369]/20 text-[#46d369] rounded font-bold text-[10px] border border-[#46d369]/40 inline-flex items-center gap-1.5">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>LIBCAMERA RAW BAYER STREAM ACTIVE</span>
                </span>
                <div className="text-[10px] text-[#8e9299] mt-1">
                  AF Distance: {telemetry.cameraRibbon.focusDistanceMeters}m | IMX708 HDR Pipeline Locked
                </div>
              </div>
            </div>
          </div>

          {/* UART Hardware Serial Console */}
          <div className="bg-[#12151b] border border-[#262b36] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#232834] pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#46d369]" />
                <span className="font-bold text-white uppercase">UART SERIAL CONSOLE & VCGENCMD</span>
              </div>
              <span className="text-[10px] text-[#8e9299]">{telemetry.uartBaud} Baud</span>
            </div>

            <div className="h-[120px] overflow-y-auto bg-[#0a0c10] border border-[#232834] rounded-lg p-2.5 space-y-1 text-[10px] font-mono text-[#46d369]">
              {telemetry.serialLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">{log}</div>
              ))}
            </div>

            {/* Quick Command Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {['vcgencmd measure_temp', 'vcgencmd get_throttled', 'pinout', 'rpicam-hello'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => handleRunCommand(cmd)}
                  className="px-2 py-0.5 bg-[#1b202a] hover:bg-[#282f3c] text-[#00e5ff] rounded text-[9px] font-bold border border-[#00e5ff]/30 cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
