import React, { useState } from 'react';
import {
  X,
  Wand2,
  Sliders,
  Copy,
  Check,
  Music,
  Download,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { CharacterSheet, CDancePipelineConfig } from '../types';

interface PromptTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterSheet[];
  pipelineConfig: CDancePipelineConfig;
  onUpdateAudioSync: (syncSettings: Partial<CDancePipelineConfig['audioSyncSettings']>) => void;
}

export const PromptTemplateModal: React.FC<PromptTemplateModalProps> = ({
  isOpen,
  onClose,
  characters,
  pipelineConfig,
  onUpdateAudioSync,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'audio-sync' | 'export-workflow'>('templates');
  const [selectedCharId, setSelectedCharId] = useState(characters[0]?.id || 'super-puff');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono text-slate-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-glow border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/50 text-purple-300">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base md:text-lg font-bold text-white uppercase tracking-wider">
                Fine-Tune C Dance & Seedance 2.5 Integration
              </h3>
              <p className="text-xs text-slate-400">
                Prompt engineering templates, audio-driven sync settings, and export workflows for pee dub.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex gap-2 bg-black/60 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'templates' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Prompt Templates
          </button>
          <button
            onClick={() => setActiveTab('audio-sync')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'audio-sync' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audio-Driven Sync
          </button>
          <button
            onClick={() => setActiveTab('export-workflow')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'export-workflow' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Export Workflows (Pee Dub)
          </button>
        </div>

        {/* TAB 1: Prompt Templates for Dragon 9 Characters */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              {characters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCharId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCharId === c.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                      : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/80 border border-purple-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Seedance 2.5 C Dance Template [{activeChar.name}]:</span>
                </span>
                <button
                  onClick={() => handleCopy(activeChar.promptEngineeringTemplate, 'modal-template')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'modal-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'modal-template' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-black text-xs text-purple-200 leading-relaxed select-all">
                {activeChar.promptEngineeringTemplate}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <span className="text-slate-300 font-bold block">Style Anchor Tags for {activeChar.name}:</span>
              <p className="text-slate-400 leading-relaxed">{activeChar.styleAnchor}</p>
            </div>
          </div>
        )}

        {/* TAB 2: Managing Audio-Driven Sync Settings in C Dance */}
        {activeTab === 'audio-sync' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                Audio-Driven Sync Configuration in C Dance
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Feed dialogue audio tracks or music stems (up to 10 files) directly into C Dance to drive character lip sync, movement rhythm, and camera trajectory pacing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-slate-800 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Audio Sync Tolerance:</span>
                  <span className="text-cyan-400">{pipelineConfig.audioSyncSettings.syncToleranceMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={pipelineConfig.audioSyncSettings.syncToleranceMs}
                  onChange={(e) => onUpdateAudioSync({ syncToleranceMs: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Tolerates micro-delay offsets for vocal formants</span>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-slate-800 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Lip-Sync Strength:</span>
                  <span className="text-emerald-400">{Math.round(pipelineConfig.audioSyncSettings.lipSyncStrength * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={pipelineConfig.audioSyncSettings.lipSyncStrength}
                  onChange={(e) => onUpdateAudioSync({ lipSyncStrength: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Controls jaw articulation responsiveness to audio power</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Optimizing Export Workflows for Pee Dub */}
        {activeTab === 'export-workflow' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                Optimizing Export Workflows for Pee Dub
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                When finalizing delivery for dubbing, sound design, and broadcast editing (pee dub), export lossless ProRes 4444 video streams with embedded timecode metadata and 432Hz/528Hz audio stems.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-300 font-bold block">Pee Dub Best Practices Checklist:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-slate-200">2-Frame Audio Handles:</strong> Add 2-frame preroll handles on clip extension boundaries.</li>
                <li><strong className="text-slate-200">Split Dialogue Stems:</strong> Separate Super Puff dialogue tracks from 432Hz sub-bass music stems.</li>
                <li><strong className="text-slate-200">Color Profile Continuity:</strong> Export 10-bit Rec.709 or Apple ProRes 422 HQ.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
