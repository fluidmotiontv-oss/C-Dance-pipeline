import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Step1CharacterSheets } from './components/Step1CharacterSheets';
import { Step2StoryboardingAudio } from './components/Step2StoryboardingAudio';
import { Step3CDancePipeline } from './components/Step3CDancePipeline';
import { Step4ExtensionsExport } from './components/Step4ExtensionsExport';
import { LiveAnimationStudio } from './components/LiveAnimationStudio';
import { PromptTemplateModal } from './components/PromptTemplateModal';

import {
  PipelineStep,
  CharacterSheet,
  StoryboardClip,
  AudioTrackFile,
  MultimodalReferenceSlot,
  CDancePipelineConfig,
  PlayerState
} from './types';

import {
  DRAGON9_CHARACTERS,
  INITIAL_STORYBOARD_CLIPS,
  INITIAL_AUDIO_TRACKS,
  DEFAULT_PIPELINE_CONFIG
} from './data/pipelineData';

import { audioSynth } from './utils/audioSynth';

export default function App() {
  const [activeStep, setActiveStep] = useState<PipelineStep>(1);

  // Characters & Reference Tagging
  const [characters, setCharacters] = useState<CharacterSheet[]>(DRAGON9_CHARACTERS);
  const [activeCharacter, setActiveCharacter] = useState<CharacterSheet>(DRAGON9_CHARACTERS[0]);

  // Storyboard Clips & Audio Files
  const [clips, setClips] = useState<StoryboardClip[]>(INITIAL_STORYBOARD_CLIPS);
  const [activeClip, setActiveClip] = useState<StoryboardClip>(INITIAL_STORYBOARD_CLIPS[0]);
  const [audioTracks, setAudioTracks] = useState<AudioTrackFile[]>(INITIAL_AUDIO_TRACKS);

  // C Dance Pipeline Config & Multimodal Slots
  const [pipelineConfig, setPipelineConfig] = useState<CDancePipelineConfig>(DEFAULT_PIPELINE_CONFIG);

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTimeSec: 0,
    durationSec: 180,
    playbackRate: 1.0,
    volume: 0.8,
    isMuted: false,
    activeClipId: INITIAL_STORYBOARD_CLIPS[0].id,
    activeCharacterId: DRAGON9_CHARACTERS[0].id,
    renderMode: 'seedance',
    isSpeaking: false
  });

  // Modal State
  const [isFineTuneModalOpen, setIsFineTuneModalOpen] = useState(false);

  // Handlers for Step 1: Character Tags
  const handleUpdateCharacterTags = (charId: string, tags: string[]) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === charId ? { ...c, referenceTags: tags } : c))
    );
    if (activeCharacter.id === charId) {
      setActiveCharacter((prev) => ({ ...prev, referenceTags: tags }));
    }
  };

  const handleAddCharacterTag = (charId: string, newTag: string) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          if (c.referenceTags.includes(newTag)) return c;
          return { ...c, referenceTags: [...c.referenceTags, newTag] };
        }
        return c;
      })
    );
    if (activeCharacter.id === charId) {
      if (!activeCharacter.referenceTags.includes(newTag)) {
        setActiveCharacter((prev) => ({ ...prev, referenceTags: [...prev.referenceTags, newTag] }));
      }
    }
  };

  // Handlers for Step 2: Storyboard Clips & Audio Tracks
  const handleAddAudioTrack = (track: AudioTrackFile) => {
    setAudioTracks((prev) => [...prev, track]);
  };

  const handleUpdateClip = (updatedClip: StoryboardClip) => {
    setClips((prev) => prev.map((c) => (c.id === updatedClip.id ? updatedClip : c)));
    if (activeClip.id === updatedClip.id) {
      setActiveClip(updatedClip);
    }
  };

  // Handlers for Step 3: C Dance Multimodal Slots
  const handleAddMultimodalSlot = (slot: MultimodalReferenceSlot) => {
    setPipelineConfig((prev) => ({
      ...prev,
      multimodalSlots: [...prev.multimodalSlots, slot]
    }));
  };

  const handleRemoveMultimodalSlot = (slotId: string) => {
    setPipelineConfig((prev) => ({
      ...prev,
      multimodalSlots: prev.multimodalSlots.filter((s) => s.id !== slotId)
    }));
  };

  const handleUpdatePipelineConfig = (updated: Partial<CDancePipelineConfig>) => {
    setPipelineConfig((prev) => ({ ...prev, ...updated }));
  };

  // Handlers for Step 4: Extension & Audio Sync
  const handleUpdateClipExtension = (clipId: string, forwardSec: number, backwardSec: number) => {
    setClips((prev) =>
      prev.map((c) => {
        if (c.id === clipId) {
          return {
            ...c,
            extensionState: {
              extendedForwardSec: forwardSec,
              extendedBackwardSec: backwardSec,
              continuityScore: Math.min(10, 9.5 + (forwardSec + backwardSec) * 0.03)
            }
          };
        }
        return c;
      })
    );
  };

  const handleUpdateAudioSync = (syncSettings: Partial<CDancePipelineConfig['audioSyncSettings']>) => {
    setPipelineConfig((prev) => ({
      ...prev,
      audioSyncSettings: {
        ...prev.audioSyncSettings,
        ...syncSettings
      }
    }));
  };

  // Transport Player Controls
  const handleTogglePlay = useCallback(() => {
    setPlayerState((prev) => {
      const nextPlay = !prev.isPlaying;
      if (nextPlay) {
        audioSynth.playDrone('432Hz');
      } else {
        audioSynth.stopDrone();
      }
      return { ...prev, isPlaying: nextPlay };
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    setPlayerState((prev) => {
      const nextMute = !prev.isMuted;
      audioSynth.setVolume(prev.volume, nextMute);
      return { ...prev, isMuted: nextMute };
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Cyber Ambient Blur */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-6">
        {/* Top Header */}
        <Header
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          playerState={playerState}
          onTogglePlay={handleTogglePlay}
          onToggleMute={handleToggleMute}
          onOpenFineTuneModal={() => setIsFineTuneModalOpen(true)}
        />

        {/* Step 1: Asset Preparation & Character Sheets */}
        {activeStep === 1 && (
          <Step1CharacterSheets
            characters={characters}
            activeCharacter={activeCharacter}
            onSelectCharacter={setActiveCharacter}
            onUpdateCharacterTags={handleUpdateCharacterTags}
            onAddCharacterTag={handleAddCharacterTag}
          />
        )}

        {/* Step 2: Storyboarding and Scripting */}
        {activeStep === 2 && (
          <Step2StoryboardingAudio
            clips={clips}
            activeClip={activeClip}
            onSelectClip={setActiveClip}
            audioTracks={audioTracks}
            onAddAudioTrack={handleAddAudioTrack}
            onUpdateClip={handleUpdateClip}
          />
        )}

        {/* Step 3: Configuring the Pipeline in C Dance */}
        {activeStep === 3 && (
          <Step3CDancePipeline
            activeClip={activeClip}
            pipelineConfig={pipelineConfig}
            onUpdateConfig={handleUpdatePipelineConfig}
            onAddMultimodalSlot={handleAddMultimodalSlot}
            onRemoveMultimodalSlot={handleRemoveMultimodalSlot}
          />
        )}

        {/* Step 4: Video Extensions and Post-Processing */}
        {activeStep === 4 && (
          <Step4ExtensionsExport
            clips={clips}
            activeClip={activeClip}
            pipelineConfig={pipelineConfig}
            characters={characters}
            onUpdateClipExtension={handleUpdateClipExtension}
            onUpdateAudioSync={handleUpdateAudioSync}
            onUpdatePipelineConfig={handleUpdatePipelineConfig}
          />
        )}

        {/* Step 5: Live 60FPS Animation Studio Viewport */}
        {activeStep === 5 && (
          <LiveAnimationStudio
            activeClip={activeClip}
            playerState={playerState}
            onTogglePlay={handleTogglePlay}
            onSelectNextClip={() => {
              const idx = clips.findIndex((c) => c.id === activeClip.id);
              if (idx < clips.length - 1) setActiveClip(clips[idx + 1]);
            }}
            onSelectPrevClip={() => {
              const idx = clips.findIndex((c) => c.id === activeClip.id);
              if (idx > 0) setActiveClip(clips[idx - 1]);
            }}
          />
        )}

        {/* Fine-Tune Modal for Prompt Templates, Audio-Driven Sync, and Pee Dub Exports */}
        <PromptTemplateModal
          isOpen={isFineTuneModalOpen}
          onClose={() => setIsFineTuneModalOpen(false)}
          characters={characters}
          pipelineConfig={pipelineConfig}
          onUpdateAudioSync={handleUpdateAudioSync}
        />

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
          <span>DRAGON 9 CARTOON PIPELINE // SEEDANCE 2.5 (VIA C DANCE)</span>
          <span>4K ANIME STYLING   50 MULTIMODAL REFS   AUDIO-DRIVEN SYNC</span>
        </footer>
      </div>
    </div>
  );
}
