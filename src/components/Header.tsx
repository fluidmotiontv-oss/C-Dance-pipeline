import React from 'react';
import {
  Film,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  FileText,
  Wand2,
  Download,
  Zap,
  UserCheck,
  Music,
  Maximize2
} from 'lucide-react';
import { PipelineStep, PlayerState } from '../types';

interface HeaderProps {
  activeStep: PipelineStep;
  setActiveStep: (step: PipelineStep) => void;
  playerState: PlayerState;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onOpenFineTuneModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeStep,
  setActiveStep,
  playerState,
  onTogglePlay,
  onToggleMute,
  onOpenFineTuneModal,
}) => {
  const steps: { id: PipelineStep; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 1,
      label: '1. Asset Prep & Sheets',
      sub: 'Lock Character & 30 Ref Tags',
      icon: <UserCheck className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 2,
      label: '2. Storyboard & Audio',
      sub: '30s Clips & Audio Tracks',
      icon: <Music className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 3,
      label: '3. C Dance Pipeline',
      sub: '50 Multimodal Refs & Prompts',
      icon: <Wand2 className="w-4 h-4 text-purple-400" />
    },
    {
      id: 4,
      label: '4. Extensions & Export',
      sub: 'Continuity & 4K Output',
      icon: <Download className="w-4 h-4 text-amber-400" />
    },
    {
      id: 5,
      label: '5. 60FPS Live Viewport',
      sub: 'Real-Time Render Studio',
      icon: <Film className="w-4 h-4 text-sky-400" />
    }
  ];

  return (
    <header className="p-4 rounded-2xl glass-panel-glow border border-cyan-500/30 flex flex-col lg:flex-row items-center justify-between gap-4 font-mono shadow-xl">
      {/* Brand Title */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border border-cyan-400/50 flex items-center justify-center font-bold text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.25)]">
            <Zap className="w-5 h-5 text-cyan-300 animate-pulse fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm md:text-base font-bold tracking-tight text-white uppercase">
                Dragon 9 <span className="text-cyan-400 font-light">Seedance 2.5 Studio</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                C Dance Pipeline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">
              Cartoon Animation Pipeline   30s Native Generation   50 Multimodal Refs
            </p>
          </div>
        </div>

        {/* Fine-Tune Quick Action Button */}
        <button
          onClick={onOpenFineTuneModal}
          className="lg:hidden px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/50 text-purple-300 text-xs font-bold"
        >
          Fine-Tune
        </button>
      </div>

      {/* 5-Step Pipeline Navigation Bar */}
      <nav className="flex items-center gap-1 md:gap-1.5 bg-[#050811] p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,243,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {step.icon}
              <div className="text-left">
                <span className="block font-bold">{step.label}</span>
                <span className="text-[9px] text-slate-500 block hidden xl:block">{step.sub}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Audio & Fine-Tune Modal Actions */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={onOpenFineTuneModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-300 text-xs font-bold transition-all shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Fine-Tune Templates</span>
        </button>

        <button
          onClick={onToggleMute}
          className={`p-2 rounded-xl border transition-all ${
            playerState.isMuted
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-cyan-300'
          }`}
          title={playerState.isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {playerState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};
