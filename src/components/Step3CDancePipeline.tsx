import React, { useState } from 'react';
import {
  Wand2,
  Layers,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Send,
  RefreshCw,
  Terminal,
  FileCode,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { StoryboardClip, MultimodalReferenceSlot, CDancePipelineConfig } from '../types';

interface Step3CDancePipelineProps {
  activeClip: StoryboardClip;
  pipelineConfig: CDancePipelineConfig;
  onUpdateConfig: (updated: Partial<CDancePipelineConfig>) => void;
  onAddMultimodalSlot: (slot: MultimodalReferenceSlot) => void;
  onRemoveMultimodalSlot: (slotId: string) => void;
}

export const Step3CDancePipeline: React.FC<Step3CDancePipelineProps> = ({
  activeClip,
  pipelineConfig,
  onUpdateConfig,
  onAddMultimodalSlot,
  onRemoveMultimodalSlot,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotType, setNewSlotType] = useState<MultimodalReferenceSlot['type']>('style-guide');
  const [customDirectives, setCustomDirectives] = useState('');
  const [isGeneratingAiPrompt, setIsGeneratingAiPrompt] = useState(false);
  const [generatedPromptData, setGeneratedPromptData] = useState<any | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddSlot = () => {
    if (!newSlotName.trim()) return;
    const newSlot: MultimodalReferenceSlot = {
      id: `slot-${Date.now()}`,
      type: newSlotType,
      name: newSlotName.trim(),
      weight: 0.85,
      status: 'loaded'
    };
    onAddMultimodalSlot(newSlot);
    setNewSlotName('');
  };

  const handleGenerateSeedancePrompt = async () => {
    setIsGeneratingAiPrompt(true);
    try {
      const res = await fetch('/api/generate-seedance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: 'Super Puff',
          sceneAction: activeClip.sceneAction,
          cameraTrajectory: activeClip.cameraTrajectory,
          motionFlowScore: pipelineConfig.globalMotionFlow,
          cfgScale: pipelineConfig.cfgScale,
          aspectRatio: pipelineConfig.aspectRatio,
          customDirectives
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedPromptData(data.data);
      }
    } catch (err) {
      console.error('Failed to generate Seedance prompt:', err);
    } finally {
      setIsGeneratingAiPrompt(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Step Header Banner */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-5 h-5 text-purple-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Step 3: Configuring the Pipeline in C Dance
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In C Dance, select Seedance 2.5 and load up to 50 multimodal references (character sheets, style guides, audio tracks). Engineer precise prompts specifying subject motion, camera trajectories, and lighting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            50 MULTIMODAL REFS MAX
          </span>
        </div>
      </div>

      {/* Main Grid: Multi-Reference Slot Manager (5 cols) & Seedance 2.5 Prompt Generator (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multimodal Reference Slot Manager (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  C Dance Multi-Reference Slots
                </h4>
              </div>
              <span className="text-xs text-purple-300 font-bold">
                {pipelineConfig.multimodalSlots.length} / 50 Active Slots
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Load style guides, character turnaround sheets, and audio reference stems to enforce consistent visual identity and rhythm across Seedance 2.5 clips.
            </p>

            {/* Form to Add New Slot */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] text-purple-300 font-bold block">
                Load New Reference into C Dance:
              </span>
              <div className="flex gap-2">
                <select
                  value={newSlotType}
                  onChange={(e) => setNewSlotType(e.target.value as any)}
                  className="px-2 py-1.5 rounded-lg bg-black border border-slate-800 text-xs text-purple-300 font-mono"
                >
                  <option value="character-sheet">Character Sheet</option>
                  <option value="style-guide">Style Guide</option>
                  <option value="audio-reference">Audio Reference</option>
                  <option value="background-plate">Background Plate</option>
                </select>
                <input
                  type="text"
                  value={newSlotName}
                  onChange={(e) => setNewSlotName(e.target.value)}
                  placeholder="Slot Name e.g. 'D9_Neon_Palette'"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-slate-800 text-xs text-slate-200 font-mono"
                />
                <button
                  onClick={handleAddSlot}
                  disabled={pipelineConfig.multimodalSlots.length >= 50 || !newSlotName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Load</span>
                </button>
              </div>
            </div>

            {/* Loaded Reference Slots List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {pipelineConfig.multimodalSlots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="p-3 rounded-xl bg-black/70 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold w-5">#{idx + 1}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">{slot.name}</span>
                      <span className="text-[10px] text-purple-400 font-mono uppercase">{slot.type}   Weight: {slot.weight}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveMultimodalSlot(slot.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Motion Direction & AI Prompt Engineering Generator (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Seedance 2.5 C Dance Prompt Generator
                </h4>
              </div>
              <span className="text-xs text-cyan-400 font-bold">
                MODEL: Seedance 2.5 Native 30s
              </span>
            </div>

            {/* C Dance Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-black/60 border border-slate-800 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Global Motion Flow:</span>
                  <span className="text-cyan-400 font-bold">{pipelineConfig.globalMotionFlow}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={pipelineConfig.globalMotionFlow}
                  onChange={(e) => onUpdateConfig({ globalMotionFlow: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">CFG Guidance:</span>
                  <span className="text-purple-400 font-bold">{pipelineConfig.cfgScale}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="20.0"
                  step="0.5"
                  value={pipelineConfig.cfgScale}
                  onChange={(e) => onUpdateConfig({ cfgScale: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block mb-1">Aspect Ratio:</span>
                <select
                  value={pipelineConfig.aspectRatio}
                  onChange={(e) => onUpdateConfig({ aspectRatio: e.target.value as any })}
                  className="w-full p-1.5 rounded-lg bg-black border border-slate-800 text-xs text-white"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Vertical Shorts</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="2.39:1">2.39:1 Anamorphic</option>
                </select>
              </div>
            </div>

            {/* Custom Directives Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold block">
                Additional Motion & Lighting Directives:
              </label>
              <input
                type="text"
                value={customDirectives}
                onChange={(e) => setCustomDirectives(e.target.value)}
                placeholder="e.g. Add 120kV bifurcated lightning bolts, increase lens flare, sweep camera 180°..."
                className="w-full p-3 rounded-xl bg-black/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:border-purple-500 focus:outline-none font-mono"
              />
            </div>

            {/* Generator Action Button */}
            <button
              onClick={handleGenerateSeedancePrompt}
              disabled={isGeneratingAiPrompt}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isGeneratingAiPrompt ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>{isGeneratingAiPrompt ? 'Synthesizing Prompt...' : 'Synthesize Seedance 2.5 C Dance Prompt'}</span>
            </button>

            {/* Prompt Output Display */}
            {generatedPromptData ? (
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-black/90 border border-purple-400/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-purple-400" />
                      <span>Synthesized Seedance 2.5 Master Prompt:</span>
                    </span>
                    <button
                      onClick={() => handleCopy(generatedPromptData.seedance25Prompt, 'cdance-gen')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'cdance-gen' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'cdance-gen' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-purple-100 font-mono leading-relaxed select-all">
                    {generatedPromptData.seedance25Prompt}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/70 border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 font-bold block">Negative Weights:</span>
                  <p className="text-slate-500">{generatedPromptData.negativePrompt}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/80 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Active Clip #{activeClip.clipNumber} Default Seedance 2.5 Command:</span>
                  </span>
                  <button
                    onClick={() => handleCopy(activeClip.seedance25Prompt, 'default-clip-prompt')}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === 'default-clip-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'default-clip-prompt' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-cyan-200 font-mono leading-relaxed select-all">
                  {activeClip.seedance25Prompt}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
