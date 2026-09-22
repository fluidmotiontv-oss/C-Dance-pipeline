import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  RotateCw,
  Sliders,
  CheckCircle2,
  FileJson,
  FileText,
  Copy,
  Check,
  Zap,
  Film,
  Sparkles,
  ShieldCheck,
  Layers,
  FileCode,
  Music,
  ListOrdered,
  Clock
} from 'lucide-react';
import { StoryboardClip, CDancePipelineConfig, CharacterSheet } from '../types';

interface Step4ExtensionsExportProps {
  clips: StoryboardClip[];
  activeClip: StoryboardClip;
  pipelineConfig: CDancePipelineConfig;
  characters: CharacterSheet[];
  onUpdateClipExtension: (clipId: string, forwardSec: number, backwardSec: number) => void;
  onUpdateAudioSync: (syncSettings: Partial<CDancePipelineConfig['audioSyncSettings']>) => void;
  onUpdatePipelineConfig?: (updated: Partial<CDancePipelineConfig>) => void;
}

export const Step4ExtensionsExport: React.FC<Step4ExtensionsExportProps> = ({
  clips,
  activeClip,
  pipelineConfig,
  characters,
  onUpdateClipExtension,
  onUpdateAudioSync,
  onUpdatePipelineConfig,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRenderingExport, setIsRenderingExport] = useState(false);
  const [exportProgress, setCompileProgress] = useState(0);
  const [exportReady, setExportReady] = useState(false);

  // Batch Export state
  const [batchFormat, setBatchFormat] = useState<'consolidated-json' | 'cdance-prompts' | 'edl-xml'>('consolidated-json');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateExport = () => {
    setIsRenderingExport(true);
    setCompileProgress(0);
    setExportReady(false);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setCompileProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsRenderingExport(false);
        setExportReady(true);
      }
    }, 250);
  };

  // Calculate total sequence duration including extensions
  const totalBaseSec = clips.reduce((acc, c) => acc + (c.timeEndSec - c.timeStartSec), 0);
  const totalExtensionSec = clips.reduce((acc, c) => {
    const ext = c.extensionState || { extendedForwardSec: 0, extendedBackwardSec: 0 };
    return acc + ext.extendedForwardSec + ext.extendedBackwardSec;
  }, 0);
  const totalSequenceDurationSec = totalBaseSec + totalExtensionSec;

  const formatSecToMin = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}m ${s}s`;
  };

  // Export Consolidated Master Sequence JSON File
  const handleExportConsolidatedJson = () => {
    const sequencePayload = {
      project: 'Dragon 9 Master Cartoon Animation Sequence',
      exportType: 'Consolidated Single Sequence Batch File',
      generatorEngine: 'Seedance 2.5 (via C Dance)',
      createdTimestamp: new Date().toISOString(),
      sequenceMetrics: {
        totalClipsCount: clips.length,
        baseDurationSec: totalBaseSec,
        extendedDurationSec: totalExtensionSec,
        totalSequenceDurationSec,
        formattedDuration: formatSecToMin(totalSequenceDurationSec),
        upscaleTarget: pipelineConfig.upscaleTarget,
        deliveryFormat: pipelineConfig.exportFormat,
        motionBlurIntensityPercent: pipelineConfig.motionBlurIntensity || 75,
        calculatedInterpolationSubFrames: Math.round(((pipelineConfig.motionBlurIntensity || 75) / 100) * 8)
      },
      consolidatedAudioSyncSettings: {
        syncToleranceMs: pipelineConfig.audioSyncSettings.syncToleranceMs,
        lipSyncStrength: pipelineConfig.audioSyncSettings.lipSyncStrength,
        rhythmSnap: pipelineConfig.audioSyncSettings.rhythmSnap,
        masterAudioOffsetMs: -15,
        frequencyTarget: '432Hz / 528Hz Solfeggio Harmonic Lock'
      },
      characterManifest: characters.map((c) => ({
        id: c.id,
        name: c.name,
        role: c.role,
        referenceTagsCount: c.referenceTags.length,
        styleAnchor: c.styleAnchor
      })),
      multimodalReferenceSlots: pipelineConfig.multimodalSlots,
      sequenceTimeline: clips.map((c, index) => {
        const ext = c.extensionState || { extendedForwardSec: 0, extendedBackwardSec: 0, continuityScore: 9.8 };
        return {
          sequenceOrder: index + 1,
          clipId: c.id,
          clipNumber: c.clipNumber,
          actTitle: c.actTitle,
          baseTimecode: c.timecode,
          cameraTrajectory: c.cameraTrajectory,
          sceneAction: c.sceneAction,
          dialogueText: c.dialogueText,
          seedance25Prompt: c.seedance25Prompt,
          negativePrompt: c.negativePrompt,
          audioDrivenTiming: {
            assignedTrackId: c.audioTrackId || 'track-01',
            clipSyncOffsetMs: pipelineConfig.audioSyncSettings.syncToleranceMs,
            extensionForwardSec: ext.extendedForwardSec,
            extensionBackwardSec: ext.extendedBackwardSec,
            continuityScore: ext.continuityScore
          }
        };
      })
    };

    const blob = new Blob([JSON.stringify(sequencePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_Consolidated_Master_Sequence_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Consolidated C Dance Batch Prompt File (.txt)
  const handleExportCDanceBatchPrompts = () => {
    const header = `# DRAGON 9 // SEEDANCE 2.5 C DANCE CONSOLIDATED BATCH PROMPTS
# Total Sequence Duration: ${formatSecToMin(totalSequenceDurationSec)} (${totalSequenceDurationSec}s)
# Consolidated Audio Sync Tolerance: ${pipelineConfig.audioSyncSettings.syncToleranceMs}ms
# Lip-Sync Strength: ${Math.round(pipelineConfig.audioSyncSettings.lipSyncStrength * 100)}%
# Export Target: ${pipelineConfig.upscaleTarget}
# Generated: ${new Date().toLocaleString()}
# ------------------------------------------------------------------------\n\n`;

    const body = clips
      .map((c, index) => {
        const ext = c.extensionState || { extendedForwardSec: 0, extendedBackwardSec: 0 };
        return `// SEQUENCE ITEM [${index + 1}/${clips.length}] -- CLIP #${c.clipNumber} [${c.timecode}]
// Act: ${c.actTitle} | Trajectory: ${c.cameraTrajectory} | Extensions: +${ext.extendedForwardSec}s / -${ext.extendedBackwardSec}s
// Dialogue: "${c.dialogueText}"
${c.seedance25Prompt}

NEGATIVE: ${c.negativePrompt}
\n`;
      })
      .join('---\n\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_CDance_Consolidated_Batch_Prompts_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export EDL / XML Timeline File for NLE editing (Final Cut / Premiere)
  const handleExportEdlXml = () => {
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<xmeml version="5">
  <sequence id="Dragon9_Master_Sequence">
    <name>Dragon 9 Consolidated Sequence</name>
    <duration>${totalSequenceDurationSec * 60}</duration>
    <rate><timebase>60</timebase><ntsc>FALSE</ntsc></rate>
    <media>
      <video>
        <format><samplecharacteristics><width>3840</width><height>2160</height></samplecharacteristics></format>
`;

    const xmlClips = clips
      .map((c, idx) => {
        const startFrame = idx * 1800;
        const endFrame = (idx + 1) * 1800;
        return `        <trackitem id="Clip_${c.clipNumber}">
          <name>Clip ${c.clipNumber} - ${c.actTitle}</name>
          <start>${startFrame}</start>
          <end>${endFrame}</end>
          <file id="file_${c.clipNumber}">
            <name>Dragon9_Clip_${c.clipNumber}.mp4</name>
            <pathurl>file://localhost/Dragon9_Clip_${c.clipNumber}.mp4</pathurl>
          </file>
          <logginginfo><notes>${c.seedance25Prompt}</notes></logginginfo>
        </trackitem>`;
      })
      .join('\n');

    const xmlFooter = `
      </video>
    </media>
  </sequence>
</xmeml>`;

    const blob = new Blob([xmlHeader + xmlClips + xmlFooter], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_Sequence_Timeline_${Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const extState = activeClip.extensionState || { extendedForwardSec: 0, extendedBackwardSec: 0, continuityScore: 9.8 };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Step Header Banner */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Step 4: Video Extensions and Post-Processing
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use Seedance 2.5's video extension features to expand clips forward or backward. Export all storyboard clips as a single consolidated sequence file with unified audio-driven timing settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            CONTINUITY SCORE: {extState.continuityScore}/10
          </span>
        </div>
      </div>

      {/* NEW FEATURE: Consolidated Batch Sequence Export Panel */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-amber-500/40 shadow-2xl space-y-5 bg-gradient-to-br from-[#0c0d18] via-[#090d16] to-[#080a12]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base md:text-lg font-bold text-white uppercase tracking-wider">
                  Consolidated Batch Sequence Exporter
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                  Batch Sync Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Packages all {clips.length} storyboard clips into a single sequence file with consolidated audio-driven timing, lip-sync offsets, and C Dance multimodal settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-amber-300 bg-amber-950/40 px-3.5 py-1.5 rounded-xl border border-amber-500/30">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Total Duration: <strong>{formatSecToMin(totalSequenceDurationSec)}</strong></span>
          </div>
        </div>

        {/* Consolidated Audio-Driven Timing Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-black/70 border border-slate-800 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Sequence Clips</span>
            <span className="text-white font-bold text-sm">{clips.length} Storyboard Clips</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Audio Sync Tolerance</span>
            <span className="text-cyan-300 font-bold text-sm">{pipelineConfig.audioSyncSettings.syncToleranceMs} ms</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Lip-Sync Power</span>
            <span className="text-emerald-300 font-bold text-sm">{Math.round(pipelineConfig.audioSyncSettings.lipSyncStrength * 100)}%</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Consolidated Stems</span>
            <span className="text-amber-300 font-bold text-sm">432Hz / 528Hz Harmonic</span>
          </div>
        </div>

        {/* Clip Sequence Track List Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-amber-400" />
            Consolidated Clip Timeline Track List ({clips.length} Clips Included):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {clips.map((c, index) => {
              const ext = c.extensionState || { extendedForwardSec: 0, extendedBackwardSec: 0 };
              return (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                      #{index + 1}
                    </span>
                    <div className="truncate">
                      <span className="text-white font-bold block truncate">{c.sceneAction.slice(0, 24)}...</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.timecode}   {c.cameraTrajectory}</span>
                    </div>
                  </div>
                  {(ext.extendedForwardSec > 0 || ext.extendedBackwardSec > 0) && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-bold shrink-0 border border-cyan-500/30">
                      +{ext.extendedForwardSec}s
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Batch Sequence Download Buttons */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Sequence Format:</span>
            <div className="flex bg-black/60 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setBatchFormat('consolidated-json')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  batchFormat === 'consolidated-json' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Consolidated JSON
              </button>
              <button
                onClick={() => setBatchFormat('cdance-prompts')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  batchFormat === 'cdance-prompts' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                C Dance Prompts
              </button>
              <button
                onClick={() => setBatchFormat('edl-xml')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  batchFormat === 'edl-xml' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EDL / NLE XML
              </button>
            </div>
          </div>

          {/* Action Export Button */}
          <button
            onClick={() => {
              if (batchFormat === 'consolidated-json') handleExportConsolidatedJson();
              else if (batchFormat === 'cdance-prompts') handleExportCDanceBatchPrompts();
              else if (batchFormat === 'edl-xml') handleExportEdlXml();
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Export Consolidated Sequence File</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Scene Extension Controller (6 cols) & Export Workflow Suite (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scene Extension & Audio Sync Fine-Tuner (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-amber-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Seedance 2.5 Scene Extension Engine
                </h4>
              </div>
              <span className="text-xs text-amber-300 font-bold">
                Clip #{activeClip.clipNumber} ({activeClip.timecode})
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly extend clips by adding up to +15s forward or backward without losing character pose or background lighting continuity.
            </p>

            {/* Extension Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/60 border border-slate-800 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    Extend Forward:
                  </span>
                  <span className="text-amber-400 font-bold">+{extState.extendedForwardSec}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={extState.extendedForwardSec}
                  onChange={(e) =>
                    onUpdateClipExtension(
                      activeClip.id,
                      parseInt(e.target.value, 10),
                      extState.extendedBackwardSec
                    )
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    Extend Backward:
                  </span>
                  <span className="text-cyan-400 font-bold">-{extState.extendedBackwardSec}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={extState.extendedBackwardSec}
                  onChange={(e) =>
                    onUpdateClipExtension(
                      activeClip.id,
                      extState.extendedForwardSec,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Audio Sync Settings Fine-Tuner */}
            <div className="p-4 rounded-xl bg-black/80 border border-slate-800 space-y-3">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                Audio-Driven Sync & Lip-Sync Calibrator:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sync Tolerance:</span>
                    <span className="text-cyan-300 font-bold">{pipelineConfig.audioSyncSettings.syncToleranceMs} ms</span>
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
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lip-Sync Strength:</span>
                    <span className="text-emerald-400 font-bold">{Math.round(pipelineConfig.audioSyncSettings.lipSyncStrength * 100)}%</span>
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
                </div>
              </div>
            </div>

            {/* C Dance Motion Blur & Optical Flow Interpolation Calibrator */}
            <div className="p-4 rounded-xl bg-black/80 border border-purple-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-300 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  C Dance Motion Blur & Frame Interpolation:
                </span>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                  {pipelineConfig.motionBlurIntensity || 75}% INTENSITY
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={pipelineConfig.motionBlurIntensity || 75}
                  onChange={(e) =>
                    onUpdatePipelineConfig?.({
                      motionBlurIntensity: parseInt(e.target.value, 10)
                    })
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />

                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Calculated Sub-Frames:
                  </span>
                  <span className="text-purple-200 font-bold">
                    {Math.round(((pipelineConfig.motionBlurIntensity || 75) / 100) * 8)} Interpolation Sub-Frames (120fps Smooth Vector)
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Interpolates high-velocity character movement (Super Puff hoverboard flips & Titan mecha turns) for silky smooth 60fps/120fps motion streak rendering.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upscaling & Export Workflow Suite (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Post-Processing & Master Render
                </h4>
              </div>
              <span className="text-xs text-amber-300 font-bold">
                C DANCE READY
              </span>
            </div>

            {/* Export Format Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">Resolution Upscale Target:</label>
                <select
                  value={pipelineConfig.upscaleTarget}
                  onChange={(e) => onUpdateAudioSync({} /* trigger update */)}
                  className="w-full p-2.5 rounded-xl bg-black border border-slate-800 text-xs text-amber-300 font-mono"
                >
                  <option value="4K 60fps">4K Ultra HD (60fps)</option>
                  <option value="1080p 60fps">1080p Full HD (60fps)</option>
                  <option value="ProRes 422 HQ">Apple ProRes 422 HQ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">Delivery Output Format:</label>
                <select
                  value={pipelineConfig.exportFormat}
                  onChange={(e) => onUpdateAudioSync({} /* trigger update */)}
                  className="w-full p-2.5 rounded-xl bg-black border border-slate-800 text-xs text-white font-mono"
                >
                  <option value="C Dance Batch Package">C Dance Batch Package (.json)</option>
                  <option value="MP4 (H.265)">MP4 (H.265 High Profile)</option>
                  <option value="ProRes 4444">ProRes 4444 (Alpha Channel)</option>
                  <option value="PNG Sequence + WAV">PNG Sequence + WAV Audio</option>
                </select>
              </div>
            </div>

            {/* Simulate Export Action */}
            <div className="pt-2">
              {isRenderingExport ? (
                <div className="p-4 rounded-xl bg-black/80 border border-amber-500/40 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Rendering & Upscaling Master Stream...</span>
                    <span className="text-amber-400 font-bold">{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-amber-400 h-full transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              ) : exportReady ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Master Export Package Ready!</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    4K 60fps Render   50 Multimodal Refs Preserved   Audio Offsets Calibrated
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleExportConsolidatedJson}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase transition-all flex items-center gap-1.5"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      <span>Download Consolidated JSON</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSimulateExport}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Execute C Dance 4K Export Pipeline</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
