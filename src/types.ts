export type PipelineStep = 1 | 2 | 3 | 4 | 5;

export type TurnaroundAngle = 'front' | 'side' | 'three-quarter' | 'back';

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '2.39:1';

export type CharacterRole = 'hero' | 'deity-mech' | 'antagonist' | 'companion' | 'environmental';

export interface CharacterSheet {
  id: string;
  name: string;
  codeName: string;
  role: CharacterRole;
  description: string;
  tagline: string;
  styleAnchor: string;
  turnaroundAngles: {
    front: string;
    side: string;
    'three-quarter': string;
    back: string;
  };
  referenceTags: string[]; // up to 30 reference tags per character to prevent identity drift
  promptEngineeringTemplate: string;
  colorPalette: { primary: string; secondary: string; accent: string };
  audioProfile: { voiceName: string; pitch: number; rate: number; defaultFrequencyHz: string };
}

export interface AudioTrackFile {
  id: string;
  fileName: string;
  title: string;
  type: 'dialogue' | 'bgm' | 'sfx' | 'stem';
  durationSec: number;
  sampleRateHz: string;
  frequencyTarget: '432Hz' | '528Hz' | 'Standard';
  waveformPreview: number[];
  clipSyncOffsetMs: number;
}

export interface StoryboardClip {
  id: string;
  clipNumber: number;
  actTitle: string;
  timeStartSec: number;
  timeEndSec: number;
  timecode: string; // e.g., "00:00 - 00:30"
  sceneAction: string;
  dialogueText: string;
  characterIds: string[];
  cameraTrajectory: 'Pan Left-to-Right' | 'Crane Up 45°' | 'Dynamic 360 Orbit' | 'Push-In Macro' | 'Whip Pan Snap';
  motionFlowScore: number; // 1.0 to 10.0
  seedance25Prompt: string;
  negativePrompt: string;
  audioTrackId?: string;
  extensionState?: {
    extendedForwardSec: number;
    extendedBackwardSec: number;
    continuityScore: number;
  };
}

export interface MultimodalReferenceSlot {
  id: string;
  type: 'character-sheet' | 'style-guide' | 'audio-reference' | 'background-plate';
  name: string;
  taggedCharacterId?: string;
  weight: number; // 0.1 to 1.0
  status: 'loaded' | 'ready' | 'pending';
  fileUrl?: string;
}

export interface CDancePipelineConfig {
  activeModel: 'Seedance 2.5 (Native 30s)' | 'Seedance 2.5 Pro (Multimodal 50 Ref)';
  multimodalSlots: MultimodalReferenceSlot[]; // up to 50 slots
  globalMotionFlow: number; // 1.0 - 10.0
  cfgScale: number; // 1.0 - 20.0
  aspectRatio: AspectRatioType;
  seed: number;
  upscaleTarget: '1080p 60fps' | '4K 60fps' | 'ProRes 422 HQ';
  audioSyncSettings: {
    syncToleranceMs: number;
    lipSyncStrength: number; // 0.0 to 1.0
    rhythmSnap: boolean;
  };
  motionBlurIntensity: number; // 0 to 100 (%) for C Dance frame interpolation
  exportFormat: 'MP4 (H.265)' | 'ProRes 4444' | 'PNG Sequence + WAV' | 'C Dance Batch Package';
}

export interface PlayerState {
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  activeClipId: string;
  activeCharacterId: string;
  renderMode: 'seedance' | 'plasma-fx' | 'character-turnaround';
  isSpeaking: boolean;
}
