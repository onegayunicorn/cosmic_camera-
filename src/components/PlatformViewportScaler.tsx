import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Watch,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { PlatformPreset } from '../types';

interface PlatformViewportScalerProps {
  children: React.ReactNode;
  activePreset: PlatformPreset;
  onChangePreset: (preset: PlatformPreset) => void;
  scaleZoom: number;
  onChangeZoom: (zoom: number) => void;
}

export const PlatformViewportScaler: React.FC<PlatformViewportScalerProps> = ({
  children,
  activePreset,
  onChangePreset,
  scaleZoom,
  onChangeZoom
}) => {
  const [mobileOrientation, setMobileOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT');

  const presets = [
    {
      id: 'RESPONSIVE_AUTO' as PlatformPreset,
      label: 'AUTO RESPONSIVE',
      icon: Layers,
      spec: 'Full Fluid Width'
    },
    {
      id: 'WINDOWS_DESKTOP' as PlatformPreset,
      label: 'WINDOWS 11 / DESKTOP',
      icon: Monitor,
      spec: '1920×1080 (16:9)'
    },
    {
      id: 'ANDROID_A17' as PlatformPreset,
      label: 'SAMSUNG A17 MOBILE',
      icon: Smartphone,
      spec: mobileOrientation === 'PORTRAIT' ? '390×844 (19.5:9)' : '844×390'
    },
    {
      id: 'WRIST_DIGITAL_TWIN' as PlatformPreset,
      label: 'WRIST DIGITAL TWIN',
      icon: Watch,
      spec: '410×502 Smartwatch'
    },
    {
      id: 'ULTRAWIDE_DOME' as PlatformPreset,
      label: 'ULTRA-WIDE DOME',
      icon: Maximize2,
      spec: '3440×1440 (21:9)'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Platform & Scaling Control Bar */}
      <div className="bg-[#121418] border border-[#2d3139] rounded-lg px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[#8e9299] font-bold mr-1">PLATFORM SCALER:</span>
          {presets.map(p => {
            const Icon = p.icon;
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChangePreset(p.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ff4e00] text-[#0a0b0e] shadow-sm'
                    : 'bg-[#1a1d22] text-[#8e9299] hover:text-[#f0f0f0] hover:bg-[#23272e]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom & Device Orientation Controls */}
        <div className="flex items-center gap-3">
          {activePreset === 'ANDROID_A17' && (
            <button
              onClick={() => setMobileOrientation(prev => (prev === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT'))}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#23272e] hover:bg-[#2d3139] text-[#00e5ff] rounded font-bold cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>{mobileOrientation}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-[#0e1013] px-2 py-0.5 rounded border border-[#262a33]">
            <span className="text-[10px] text-[#8e9299]">ZOOM:</span>
            {[75, 100, 125, 150].map(z => (
              <button
                key={z}
                onClick={() => onChangeZoom(z / 100)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  scaleZoom === z / 100
                    ? 'bg-[#00e5ff] text-[#0a0b0e]'
                    : 'text-[#8e9299] hover:text-white'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Viewport Frame Container */}
      <div className="w-full flex justify-center overflow-x-auto p-1">
        <div
          style={{
            transform: `scale(${scaleZoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
          className={`w-full transition-all ${
            activePreset === 'WINDOWS_DESKTOP'
              ? 'max-w-[1400px] border border-[#2d3139] rounded-xl p-4 bg-[#0a0b0e] shadow-2xl'
              : activePreset === 'ANDROID_A17'
              ? mobileOrientation === 'PORTRAIT'
                ? 'max-w-[420px] min-h-[860px] border-4 border-[#333] rounded-[36px] p-4 bg-[#0a0b0e] shadow-2xl'
                : 'max-w-[880px] min-h-[440px] border-4 border-[#333] rounded-[36px] p-4 bg-[#0a0b0e] shadow-2xl'
              : activePreset === 'WRIST_DIGITAL_TWIN'
              ? 'max-w-[460px] min-h-[540px] border-4 border-[#444] rounded-[48px] p-4 bg-[#0a0b0e] shadow-2xl ring-4 ring-[#00e5ff]/20'
              : activePreset === 'ULTRAWIDE_DOME'
              ? 'max-w-[1800px] border border-[#2d3139] rounded-lg p-2 bg-[#0a0b0e]'
              : 'w-full'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
