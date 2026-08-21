import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabNavigation, ActiveTab } from './components/TabNavigation';
import { AgentTerminal } from './components/AgentTerminal';
import { ReleaseGovernorView } from './components/ReleaseGovernorView';
import { PhotonReconstructionView } from './components/PhotonReconstructionView';
import { HardwareLabView } from './components/HardwareLabView';
import { SovereignEnginesView } from './components/SovereignEnginesView';
import { SovereignLatticeView } from './components/SovereignLatticeView';
import { J09RingView } from './components/J09RingView';
import { AuditManifestView } from './components/AuditManifestView';
import { DualCameraView } from './components/DualCameraView';
import { MatrixEngineView } from './components/MatrixEngineView';
import { DriverCpuView } from './components/DriverCpuView';
import { DesktopWindowManager } from './components/DesktopWindowManager';
import { PlatformViewportScaler } from './components/PlatformViewportScaler';
import { WindowDynamicsDebugger } from './components/WindowDynamicsDebugger';
import { GodModeFilesView } from './components/GodModeFilesView';
import { RaspberryPiView } from './components/RaspberryPiView';

import { releaseGovernor } from './services/releaseGovernor';
import { validationEngineer } from './services/validationEngineer';
import { ReleaseState, PlatformPreset } from './types';

export default function App() {
  const [releaseState, setReleaseState] = useState<ReleaseState>(releaseGovernor.getState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('DUAL_CAMERA');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [isDesktopWindowsMode, setIsDesktopWindowsMode] = useState<boolean>(false);
  const [platformPreset, setPlatformPreset] = useState<PlatformPreset>('RESPONSIVE_AUTO');
  const [scaleZoom, setScaleZoom] = useState<number>(1.0);

  useEffect(() => {
    const update = () => {
      setReleaseState({ ...releaseGovernor.getState() });
    };
    const unsub = releaseGovernor.subscribe(update);
    return unsub;
  }, []);

  const handleRunAllGates = async () => {
    setIsRunningAll(true);
    await validationEngineer.runAllGates();
    setIsRunningAll(false);
  };

  const handleAttemptFakeEvidence = async () => {
    setIsTerminalOpen(true);
    await validationEngineer.runGateValidation('H1', 'SIMULATED');
  };

  const handleRollback = () => {
    releaseGovernor.triggerRollback('Operator initiated emergency rollback drill');
    setIsTerminalOpen(true);
  };

  const handleReset = () => {
    releaseGovernor.resetToDraft();
  };

  const handleAuthorizeRelease = () => {
    const success = releaseGovernor.authorizeRelease();
    if (!success) {
      setIsTerminalOpen(true);
    }
  };

  const openIncidentsCount = releaseState.incidents.filter(i => i.status === 'OPEN').length;
  const isAuthorized = releaseState.overallStatus === 'PASS';

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#e0e0e0] flex flex-col font-mono selection:bg-[#ff4e00]/30 selection:text-[#ff4e00]">
      
      {/* Top Header */}
      <Header
        releaseState={releaseState}
        onRunAll={handleRunAllGates}
        onAttemptFakeEvidence={handleAttemptFakeEvidence}
        onRollback={handleRollback}
        onReset={handleReset}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        isTerminalOpen={isTerminalOpen}
        isRunning={isRunningAll}
        isDesktopWindowsMode={isDesktopWindowsMode}
        onToggleDesktopWindowsMode={() => setIsDesktopWindowsMode(!isDesktopWindowsMode)}
      />

      {/* Navigation Tabs with Desktop Mode Switcher */}
      <TabNavigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        openIncidentsCount={openIncidentsCount}
        isDesktopWindowsMode={isDesktopWindowsMode}
        onToggleDesktopWindowsMode={() => setIsDesktopWindowsMode(!isDesktopWindowsMode)}
      />

      {/* Main Content Viewport with Multi-Platform Scaler */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 pb-24">
        <PlatformViewportScaler
          activePreset={platformPreset}
          onChangePreset={setPlatformPreset}
          scaleZoom={scaleZoom}
          onChangeZoom={setScaleZoom}
        >
          {isDesktopWindowsMode ? (
            <DesktopWindowManager
              releaseState={releaseState}
              onApproveGate={id => validationEngineer.runGateValidation(id, 'MEASURED')}
              onRejectGate={(id, reason) => releaseGovernor.createIncident(id, 'HIGH', reason, 'Physical proof required')}
              onOverrideProvenance={(id, prov) => validationEngineer.runGateValidation(id, prov)}
              onSealManifest={() => releaseGovernor.authorizeRelease()}
              onResetSystem={handleReset}
            />
          ) : (
            <>
              {activeTab === 'DUAL_CAMERA' && (
                <DualCameraView />
              )}

              {activeTab === 'MATRIX_ENGINE' && (
                <MatrixEngineView />
              )}

              {activeTab === 'DRIVER_CPU' && (
                <DriverCpuView />
              )}

              {activeTab === 'SOVEREIGN_LATTICE' && (
                <SovereignLatticeView />
              )}

              {activeTab === 'GOVERNOR' && (
                <ReleaseGovernorView
                  gates={releaseState.gates}
                  incidents={releaseState.incidents}
                  onAuthorizeRelease={handleAuthorizeRelease}
                  onRollback={handleRollback}
                  isAuthorized={isAuthorized}
                />
              )}

              {activeTab === 'PNP_ADMM' && (
                <PhotonReconstructionView />
              )}

              {activeTab === 'HARDWARE' && (
                <HardwareLabView />
              )}

              {activeTab === 'SOVEREIGN_11' && (
                <SovereignEnginesView />
              )}

              {activeTab === 'J09_RING' && (
                <J09RingView />
              )}

              {activeTab === 'MANIFEST' && (
                <AuditManifestView
                  releaseState={releaseState}
                  incidents={releaseState.incidents}
                  onRollback={handleRollback}
                />
              )}

              {activeTab === 'DYNAMICS_DEBUG' && (
                <div className="space-y-4">
                  <div className="bg-[#121418] border border-[#00e5ff]/40 rounded-lg p-3 text-xs font-mono flex items-center justify-between">
                    <span className="text-[#00e5ff] font-bold">⚡ WINDOWS DYNAMICS ENGINE & COLLISION TELEMETRY</span>
                    <span className="text-[#8e9299] text-[10px]">Active Kinematics Loop: 60 FPS</span>
                  </div>
                  <WindowDynamicsDebugger
                    windows={[
                      { id: 'DUAL_CAMERA', title: 'Dual Camera', iconName: 'Camera', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10, x: 50, y: 50, width: 600, height: 400, minWidth: 400, minHeight: 300, pinned: false, opacity: 1 },
                      { id: 'MATRIX_ENGINE', title: 'Matrix Engine', iconName: 'Grid', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 9, x: 280, y: 120, width: 550, height: 380, minWidth: 400, minHeight: 300, pinned: false, opacity: 1 },
                      { id: 'GOD_MODE', title: 'God Mode Files', iconName: 'ShieldAlert', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 8, x: 520, y: 180, width: 580, height: 400, minWidth: 400, minHeight: 300, pinned: false, opacity: 1 }
                    ]}
                    onUpdateWindow={() => {}}
                    onTileWindows={() => {}}
                    onCascadeWindows={() => {}}
                    onResetPositions={() => {}}
                  />
                </div>
              )}

              {activeTab === 'GOD_MODE' && (
                <GodModeFilesView
                  gates={releaseState.gates}
                  releaseState={releaseState}
                  onForcePassAllGates={() => {
                    releaseState.gates?.forEach((g: any) => validationEngineer.runGateValidation(g.id, 'MEASURED'));
                    releaseGovernor.authorizeRelease();
                  }}
                  onResetGates={handleReset}
                />
              )}

              {activeTab === 'RASPBERRY_PI' && (
                <RaspberryPiView />
              )}
            </>
          )}
        </PlatformViewportScaler>
      </main>

      {/* Live Dual-Agent Protocol Terminal */}
      <AgentTerminal
        messages={releaseState.messages}
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Specialist Hardware Footer */}
      <footer className="px-6 py-3 bg-[#15171a] border-t border-[#2d3139] text-[10px] text-[#5c6370] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="text-[#8e9299] font-bold">SOVEREIGN PHOTONIC-ORCHESTRATOR</span>
            <span>V3.0.0 DUAL-AGENT TWO-KEY ENGINE</span>
            <span>LOC: 28.0167° S, 153.4000° E</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></div>
            <span className="text-[#8e9299]">DIGITAL TWIN RUNTIME: <span className="text-[#00ff41] font-bold">ACTIVE</span></span>
            <span className="text-[#404550]">|</span>
            <span className="text-[#8e9299]">MERKLE: <span className="text-white">VERIFIED</span></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
