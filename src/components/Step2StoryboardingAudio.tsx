import React, { useState } from 'react';
import {
  Music,
  Film,
  Play,
  Square,
  Volume2,
  Clock,
  Plus,
  Trash2,
  Sliders,
  Check,
  Copy,
  Sparkles,
  FileAudio,
  Wand2,
  ListOrdered
} from 'lucide-react';
import { StoryboardClip, AudioTrackFile } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface Step2StoryboardingAudioProps {
  clips: StoryboardClip[];
  activeClip: StoryboardClip;
  onSelectClip: (clip: StoryboardClip) => void;
  audioTracks: AudioTrackFile[];
  onAddAudioTrack: (track: AudioTrackFile) => void;
  onUpdateClip: (updatedClip: StoryboardClip) => void;
}

export const Step2StoryboardingAudio: React.FC<Step2StoryboardingAudioProps> = ({
  clips,
  activeClip,
  onSelectClip,
  audioTracks,
  onAddAudioTrack,
  onUpdateClip,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSpeakingDialogue, setIsSpeakingDialogue] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleBackgroundAudio = (freq: '432Hz' | '528Hz' = '432Hz') => {
    if (isPlayingAudio) {
      audioSynth.stopDrone();
      setIsPlayingAudio(false);
    } else {
      audioSynth.playDrone(freq);
      setIsPlayingAudio(true);
    }
  };

  const handleSpeakDialogue = (text: string) => {
    if (isSpeakingDialogue) {
      audioSynth.stopNarration();
      setIsSpeakingDialogue(false);
    } else {
      setIsSpeakingDialogue(true);
      audioSynth.speakNarration(text, 'Kore', () => setIsSpeakingDialogue(false));
    }
  };

  const handleCreateNewAudioTrack = () => {
    if (!newTrackTitle.trim()) return;
    const newTrack: AudioTrackFile = {
      id: `track-${Date.now()}`,
      fileName: newFileName.trim() || `${newTrackTitle.replace(/\s+/g, '_')}.wav`,
      title: newTrackTitle.trim(),
      type: 'dialogue',
      durationSec: 30,
      sampleRateHz: '96kHz / 24-bit',
      frequencyTarget: '432Hz',
      waveformPreview: [20, 40, 80, 60, 95, 30, 70, 85, 25, 90, 45, 75, 10, 85, 50, 20],
      clipSyncOffsetMs: 0
    };
    onAddAudioTrack(newTrack);
    setNewFileName('');
    setNewTrackTitle('');
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Step Header Banner */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Step 2: Storyboarding and Scripting
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Segment scripts into native ~30-second clips matching Seedance 2.5's generation window. Prepare up to 10 independent dialogue & audio tracks to drive rhythm, pacing, and audiovisual timing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleBackgroundAudio('432Hz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 border ${
              isPlayingAudio
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlayingAudio ? 'Stop 432Hz Track' : 'Test 432Hz Sync'}</span>
          </button>
        </div>
      </div>

      {/* 30-Second Segmented Clips Bar */}
      <div className="p-5 rounded-2xl glass-panel-glow border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            <span>30-Second Native Generation Clips (Seedance 2.5 Windows)</span>
          </span>
          <span className="text-[11px] text-slate-400">{clips.length} Clips Total</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {clips.map((clip) => {
            const isSelected = activeClip.id === clip.id;
            return (
              <button
                key={clip.id}
                onClick={() => onSelectClip(clip)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold'
                    : 'bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold block w-max mb-1">
                    Clip #{clip.clipNumber} ({clip.timecode})
                  </span>
                  <span className="text-xs text-white block truncate">{clip.sceneAction.slice(0, 30)}...</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                  <span>FLOW: {clip.motionFlowScore}</span>
                  <span>30s Max</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Active Clip Script Editor (7 cols) & Audio File Pipeline Manager (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Clip Script & Camera Trajectory Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                  ACTIVE CLIP #{activeClip.clipNumber} ({activeClip.timecode})   {activeClip.actTitle}
                </span>
                <h3 className="font-display text-base font-bold text-white">
                  Scene Action & Audio-Driven Timing
                </h3>
              </div>
              <button
                onClick={() => handleSpeakDialogue(activeClip.dialogueText)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border ${
                  isSpeakingDialogue
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-emerald-300 hover:bg-slate-800'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeakingDialogue ? 'Speaking Dialogue...' : 'Test Dialogue TTS'}</span>
              </button>
            </div>

            {/* Scene Action Input/Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold block">
                Scene Action Description (30-second clip chunk):
              </label>
              <textarea
                value={activeClip.sceneAction}
                onChange={(e) => onUpdateClip({ ...activeClip, sceneAction: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-xl bg-black/80 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Dialogue Text */}
            <div className="space-y-1.5">
              <label className="text-xs text-emerald-300 font-bold block">
                Audio Dialogue Track Line (Voice Cue):
              </label>
              <input
                type="text"
                value={activeClip.dialogueText}
                onChange={(e) => onUpdateClip({ ...activeClip, dialogueText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/80 border border-emerald-500/30 text-xs text-emerald-100 focus:border-emerald-400 focus:outline-none font-mono italic"
              />
            </div>

            {/* Camera Trajectory & Motion Flow Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 block font-bold">Camera Motion Vector:</label>
                <select
                  value={activeClip.cameraTrajectory}
                  onChange={(e) => onUpdateClip({ ...activeClip, cameraTrajectory: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-black/80 border border-slate-800 text-xs text-cyan-300 focus:outline-none"
                >
                  <option value="Pan Left-to-Right">Pan Left-to-Right</option>
                  <option value="Crane Up 45°">Crane Up 45°</option>
                  <option value="Dynamic 360 Orbit">Dynamic 360 Orbit</option>
                  <option value="Push-In Macro">Push-In Macro</option>
                  <option value="Whip Pan Snap">Whip Pan Snap</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">Motion Flow Score:</span>
                  <span className="text-cyan-400 font-bold">{activeClip.motionFlowScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={activeClip.motionFlowScore}
                  onChange={(e) => onUpdateClip({ ...activeClip, motionFlowScore: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Track File Manager (Up to 10 Files) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-emerald-400" />
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Audio-Driven Timing Pipeline
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-bold">
                {audioTracks.length} / 10 Files Max
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Feed up to 10 dialogue and stem audio files into C Dance to synchronize rhythm, dialogue lip-sync, and camera speed to audio waveforms.
            </p>

            {/* Audio Track List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {audioTracks.map((track) => (
                <div
                  key={track.id}
                  className="p-3 rounded-xl bg-black/70 border border-slate-800 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="text-white font-bold block">{track.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{track.fileName}   [{track.sampleRateHz}]</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30">
                      {track.frequencyTarget}
                    </span>
                  </div>

                  {/* Waveform Preview Bar */}
                  <div className="h-4 flex items-center justify-between gap-0.5 bg-slate-950 p-1 rounded">
                    {track.waveformPreview.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-emerald-400/80 rounded-full"
                        style={{ height: `${(h / 100) * 12}px` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Form to Register New Audio Track */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] text-emerald-300 font-bold block">
                Register New Audio Reference File:
              </span>
              <input
                type="text"
                value={newTrackTitle}
                onChange={(e) => setNewTrackTitle(e.target.value)}
                placeholder="Track Title e.g., 'SuperPuff_Bodega_Take2'"
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-slate-800 text-xs text-slate-200 font-mono"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Filename e.g., 'dialogue_02.wav'"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-slate-800 text-xs text-slate-200 font-mono"
                />
                <button
                  onClick={handleCreateNewAudioTrack}
                  disabled={audioTracks.length >= 10 || !newTrackTitle.trim()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
