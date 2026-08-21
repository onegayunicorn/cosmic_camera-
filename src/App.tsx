import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabNavigation, ActiveTab } from './components/TabNavigation';
import { AgentTerminal } from './components/AgentTerminal';
import { ReleaseGovernorView } from './components/ReleaseGovernorView';
import { PhotonReconstructionView } from './components/PhotonReconstructionView';
import { HardwareLabView } from './components/HardwareLabView';
import { SovereignEnginesView } from './components/SovereignEnginesView';
import { J09RingView } from './components/J09RingView';
import { AuditManifestView } from './components/AuditManifestView';

import { releaseGovernor } from './services/releaseGovernor';
import { validationEngineer } from './services/validationEngineer';
import { ReleaseState } from './types';

export default function App() {
  const [releaseState, setReleaseState] = useState<ReleaseState>(releaseGovernor.getState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('GOVERNOR');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);

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
    // Attempting to submit SIMULATED evidence for physical hardware dark current gate (H1)
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
      />

      {/* Navigation Tabs */}
      <TabNavigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        openIncidentsCount={openIncidentsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 pb-24">
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
