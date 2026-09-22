import { CharacterSheet, StoryboardClip, AudioTrackFile, MultimodalReferenceSlot, CDancePipelineConfig } from '../types';

export const DRAGON9_CHARACTERS: CharacterSheet[] = [
  {
    id: 'super-puff',
    name: 'Super Puff',
    codeName: 'D9-PUFF-01',
    role: 'hero',
    tagline: 'Streetwear Dragon with Chrono-Visor and Mercury Board',
    description: 'A swaggering, bilingual cyber dragon in an oversized chromatic puff hoodie with glowing chrome trims, reflective sneakers, and a 432Hz levitating mercury board.',
    styleAnchor: '4K anime styling, cel-shaded vector precision, liquid chrome jacket physics, glowing neon aqua accents',
    turnaroundAngles: {
      front: 'Frontal 0° view: Super Puff standing proud in oversized chromatic puff jacket, glowing cyan ocular visor, chrome horns swept back, hands resting on hoodie pouch.',
      side: 'Profile 90° view: Side profile highlighting the aerodynamic curved horns, fiber-optic jacket seams, and high-top reflective sneakers with mercury soles.',
      'three-quarter': '3/4 Dynamic Angle (45°): Hero perspective showcasing the articulated cybernetic snout, glowing visor HUD, and the floating mercury hoverboard hovering at ankle height.',
      back: 'Dorsal 180° view: Rear view highlighting the dragon spine ridge, pulsing neon power core logo, and trailing liquid chrome winglets.'
    },
    referenceTags: [
      'D9_SUPER_PUFF', 'OVERSIZED_PUFF_JACKET', 'CHROMATIC_MERCURY_REFLECTIONS',
      'GLOWING_CYAN_VISOR', 'BACK_SWEPT_CHROME_HORNS', 'REFLECTIVE_HIGH_TOPS',
      '432HZ_AURA', 'BILINGUAL_SWAGGER', 'CELL_SHADED_ANIME_LINES',
      'NEON_AQUA_HIGHLIGHTS', 'ULTRAVIOLET_SHADOWS', 'LIQUID_CHROME_PHYSICS',
      'AIRBORNE_MERCURY_BOARD', 'NOSTRIL_PASTEL_SMOKE', 'GOLDEN_INFINITY_PUPILS',
      'TACTICAL_POUCHES', 'FIBER_OPTIC_SEAMS', 'HIGH_COLLAR_SILHOUETTE',
      'MECHA_SNOUT_PLATE', 'FLEXIBLE_MANDIBLE', 'SOLFEGGIO_EMISSION_CORE',
      'ZERO_GRAVITY_DRIPS', 'STREETWEAR_DRAGON_ANATOMY', 'OCTAGONAL_RUNE_EMBLEM',
      'CYBERPUNK_BODEGA_STYLE', 'SHINTO_RESONANCE_CHARM', 'CHRONO_DIAL_GLOVE',
      'AERODYNAMIC_TAIL_WING', 'HIGH_CONTRAST_VECTOR', 'SEEDANCE_LOCK_SUPER_PUFF'
    ],
    promptEngineeringTemplate: `[SEEDANCE_2.5_PROMPT_TEMPLATE // SUPER_PUFF]
Subject: Super Puff, streetwear dragon in oversized chromatic puff hoodie, glowing cyan ocular visor, back-swept chrome horns, reflective sneakers.
Setting: {LOCATION_DESCRIPTION}
Action: {ACTION_DESCRIPTION}
Style: 4K anime styling, cel-shaded vector line art, liquid chrome physics, neon aqua and ultraviolet rim lighting, octane render reflections, --motion {MOTION_SCORE} --cfg {CFG_SCALE} --ar {ASPECT_RATIO} --seed {SEED}`,
    colorPalette: { primary: '#00f3ff', secondary: '#b026ff', accent: '#ffaa00' },
    audioProfile: { voiceName: 'Kore', pitch: 0.9, rate: 1.0, defaultFrequencyHz: '432Hz' }
  },
  {
    id: 'd9-titan',
    name: 'D9 Binary Titan',
    codeName: 'D9-TITAN-09',
    role: 'deity-mech',
    tagline: '54-Minute Harmonic Guardian & Matrix Sovereign',
    description: 'A massive 8-fold octagonal cybernetic dragon titan adorned with gold motherboard circuit traces, quad optical sensors, and exhaling binary code streams.',
    styleAnchor: 'Titan-scale anime mecha, gold PCB traces, quad ocular HUD sensors, streaming binary code emissions',
    turnaroundAngles: {
      front: 'Frontal 0° view: Full mecha dragon cranium with 8-fold octagonal symmetry, quad glowing optic sensors, and gold PCB circuit lines running down the snout.',
      side: 'Profile 90° view: Massive mechanical jaw hinge, hydraulic pistons, and logarithmic curved horns with glowing energy rings.',
      'three-quarter': '3/4 Dynamic Angle (45°): Impressive scale framing the open jaw cavity emitting cyan plasma laser beams and streaming binary digits.',
      back: 'Dorsal 180° view: Segmented carbon-fiber spinal vertebrae with 120kV coronal discharge arcs.'
    },
    referenceTags: [
      'D9_BINARY_TITAN', 'GOLD_PCB_CIRCUIT_TRACES', 'QUAD_OPTICAL_SENSORS',
      'OCTAGONAL_MECHA_CRANIUM', 'STREAMING_BINARY_MATRIX', '120KV_PLASMA_ARCS',
      'LOGARITHMIC_SPIRAL_HORNS', 'MOLTEN_THERMAL_CONDUITS', 'HYDRAULIC_JAW_PISTONS',
      'SOLFEGGIO_528HZ_CORE', 'CELESTIAL_INFINITY_FLOW', 'AETHER_MECHA_SCALE',
      'TITANIUM_SHIELD_PLATES', 'CORONAL_HAZO_GLOW', 'AEMIS_FORCEFIELD_GENERATOR',
      'CYBERNETIC_ROAR', 'BERNOULLI_VORTEX_NEXUS', 'VOLUMETRIC_ION_BEAM',
      'SHINTO_GONG_RESONANCE', 'PRECISION_VECTOR_MANDIBLE', 'QUAD_OCULAR_HUD',
      'ELECTRIC_PLASMA_TRAILS', 'NEURAL_EMERALD_PULSE', 'TACTICAL_TELEMETRY_RING',
      '54_MINUTE_CHRONO_LOCK', 'SEEDANCE_LOCK_D9_TITAN', 'TITAN_SCALE_COMPOSITION',
      'HIGH_VOLTAGE_LIGHTNING', 'ANIME_MECHA_MASTERPIECE', 'GOLDEN_RATIO_HORNS'
    ],
    promptEngineeringTemplate: `[SEEDANCE_2.5_PROMPT_TEMPLATE // D9_TITAN]
Subject: D9 Binary Titan, massive mecha dragon guardian, gold motherboard circuit lines, quad glowing ocular sensors, 8-fold octagonal cranium.
Setting: {LOCATION_DESCRIPTION}
Action: {ACTION_DESCRIPTION}
Style: 4K anime styling, epic scale composition, volumetric plasma lighting, high-voltage lightning arcs, streaming binary code, --motion {MOTION_SCORE} --cfg {CFG_SCALE} --ar {ASPECT_RATIO} --seed {SEED}`,
    colorPalette: { primary: '#ffaa00', secondary: '#00f3ff', accent: '#a855f7' },
    audioProfile: { voiceName: 'Fenrir', pitch: 0.75, rate: 0.95, defaultFrequencyHz: '528Hz' }
  },
  {
    id: 'aegis-sentinel',
    name: 'Aegis Drone Swarm',
    codeName: 'AEGIS-99',
    role: 'antagonist',
    tagline: 'Hexagonal Tactical Surveillance Units',
    description: 'Automated hexagonal security drones that deploy red laser net barricades, which glitch into 8-bit retro arcade games when struck by Super Puff\'s smoke ring.',
    styleAnchor: 'Hexagonal mecha drones, red targeting laser array, glassmorphic telemetry HUDs',
    turnaroundAngles: {
      front: 'Frontal 0° view: Hexagonal stealth drone with central crimson sensor eye and 6 perimeter laser lenses.',
      side: 'Profile 90° view: Sleek carbon-fiber hull with anti-gravity thruster pods.',
      'three-quarter': '3/4 Dynamic Angle (45°): Tactical swarm formation projecting red laser lattice barricades.',
      back: 'Dorsal 180° view: Rear exhaust ports and encrypted communication antennae.'
    },
    referenceTags: [
      'AEGIS_DRONE_SWARM', 'HEXAGONAL_MECHA_HULL', 'RED_TARGETING_LASERS',
      'TACTICAL_BARRIER_NET', 'GLASSMORPHIC_TELEMETRY', '8BIT_RETRO_GLITCH',
      'CARBON_FIBER_CHASSIS', 'ANTI_GRAVITY_THRUSTERS', 'CRIMSON_SENSOR_EYE',
      'SEEDANCE_LOCK_AEGIS_DRONE', 'SWARM_FORMATION_FLYING', 'CYBERPUNK_POLICE_GRID'
    ],
    promptEngineeringTemplate: `[SEEDANCE_2.5_PROMPT_TEMPLATE // AEGIS_DRONE]
Subject: Aegis hexagonal tactical security drones, red laser targeting net, carbon fiber hull.
Setting: {LOCATION_DESCRIPTION}
Action: {ACTION_DESCRIPTION}
Style: 4K anime styling, tactical HUD reticles, volumetric red laser beams, --motion {MOTION_SCORE} --cfg {CFG_SCALE}`,
    colorPalette: { primary: '#ff4d6d', secondary: '#3ddcff', accent: '#f59e0b' },
    audioProfile: { voiceName: 'Puck', pitch: 1.1, rate: 1.05, defaultFrequencyHz: 'Standard' }
  }
];

export const INITIAL_AUDIO_TRACKS: AudioTrackFile[] = [
  {
    id: 'track-01',
    fileName: '528Hz_Solfeggio_DNA_Drone.wav',
    title: '528Hz Solfeggio DNA Healing Drone',
    type: 'bgm',
    durationSec: 180,
    sampleRateHz: '96kHz / 24-bit',
    frequencyTarget: '528Hz',
    waveformPreview: [15, 32, 58, 85, 98, 70, 45, 20, 38, 65, 92, 80, 50, 25, 40, 78],
    clipSyncOffsetMs: 0
  },
  {
    id: 'track-02',
    fileName: '432Hz_Theta_Wave_Restorative.wav',
    title: '432Hz Theta Wave Mind Restorative',
    type: 'bgm',
    durationSec: 240,
    sampleRateHz: '96kHz / 24-bit',
    frequencyTarget: '432Hz',
    waveformPreview: [12, 28, 45, 62, 78, 90, 65, 42, 22, 35, 58, 82, 95, 70, 40, 18],
    clipSyncOffsetMs: -120
  },
  {
    id: 'track-03',
    fileName: 'SuperPuff_Dialogue_Bodega_Cut.wav',
    title: 'Super Puff Dialogue Track: "Earth Clocks Running Out"',
    type: 'dialogue',
    durationSec: 30,
    sampleRateHz: '48kHz Mono Voice',
    frequencyTarget: '432Hz',
    waveformPreview: [5, 45, 95, 20, 85, 10, 75, 90, 15, 60, 100, 30, 80, 25, 65, 10],
    clipSyncOffsetMs: 15
  },
  {
    id: 'track-04',
    fileName: 'High_Voltage_Sports_Phonk_808.wav',
    title: 'High Voltage Phonk 808 Slipstream Beat',
    type: 'stem',
    durationSec: 120,
    sampleRateHz: '96kHz Lossless',
    frequencyTarget: '432Hz',
    waveformPreview: [90, 20, 88, 15, 95, 30, 85, 10, 92, 25, 89, 18, 96, 22, 84, 12],
    clipSyncOffsetMs: 0
  }
];

export const INITIAL_STORYBOARD_CLIPS: StoryboardClip[] = [
  {
    id: 'clip-01',
    clipNumber: 1,
    actTitle: 'Act I: Cosmic Bodega',
    timeStartSec: 0,
    timeEndSec: 30,
    timecode: '00:00 - 00:30',
    sceneAction: 'Slow macro push-in on an iridescent corner bodega at 3 AM. Rain-slicked asphalt mirrors flickering neon bodega signs in turquoise and magenta as steam billows from holographic manholes.',
    dialogueText: 'Yo, check the readout. Earth clocks running out of battery... but we running on Dragon 9 time.',
    characterIds: ['super-puff'],
    cameraTrajectory: 'Push-In Macro',
    motionFlowScore: 8.8,
    seedance25Prompt: 'Ultra-wide cinematic opening, 4K anime styling, Seedance 2.5 video diffusion, iridescent bodega deli bathed in glowing neon aqua and ultraviolet fluorescent tubes, wet asphalt puddles reflecting cyan street signs, volumetric smoke rings drifting through air, liquid chrome physics on counter trims, slow steady camera push-in, octane render quality, hyper-detailed cyberpunk streetwear aesthetic, 60fps silky smooth motion flow --motion 8.8 --cfg 7.5 --ar 16:9 --seed 432108',
    negativePrompt: 'blurry, jittery camera, photorealistic human face, lowres, choppy frames, muddy shadows, oversaturated pixelation, watermark, text glitches',
    audioTrackId: 'track-03',
    extensionState: { extendedForwardSec: 0, extendedBackwardSec: 0, continuityScore: 9.8 }
  },
  {
    id: 'clip-02',
    clipNumber: 2,
    actTitle: 'Act I: Cosmic Bodega',
    timeStartSec: 30,
    timeEndSec: 60,
    timecode: '00:30 - 01:00',
    sceneAction: 'Super Puff pauses mid-chew and reaches a clawed hand into empty space. Thin air shimmers with glassmorphic coordinate grids as if grasping an invisible dimensional dial.',
    dialogueText: 'Fifty-four minutes to the hour. Twenty-six point six six cycles per spin. If the sub don\'t hit at 432, don\'t even bother pressing play.',
    characterIds: ['super-puff'],
    cameraTrajectory: 'Dynamic 360 Orbit',
    motionFlowScore: 9.1,
    seedance25Prompt: 'Cinematic medium close-up, Seedance 2.5 video diffusion, 4K anime styling, streetwear dragon claw grasping an invisible dimensional dial in thin air, refractive glassmorphism UI widgets blooming around fingertips, volumetric cyan laser particles orbiting wrist armor, high contrast cel-shaded reflections, liquid chrome fluid droplets suspended in zero gravity, camera arc orbit 45 degrees, hyper-fluid motion flow --motion 9.1 --cfg 8.0 --ar 16:9 --seed 542666',
    negativePrompt: 'static, low detail, deformed claw anatomy, jerky camera, flat lighting, artifacts, compression noise',
    audioTrackId: 'track-02',
    extensionState: { extendedForwardSec: 5, extendedBackwardSec: 0, continuityScore: 9.6 }
  },
  {
    id: 'clip-03',
    clipNumber: 3,
    actTitle: 'Act I: Cosmic Bodega',
    timeStartSec: 60,
    timeEndSec: 90,
    timecode: '01:00 - 01:30',
    sceneAction: 'As Super Puff twists the invisible dial clockwise, a seismic click echoes. Reality glitches like an old-school CRT TV, peeling back physical matter to reveal a boundless starry void.',
    dialogueText: 'Ahora mira cómo le doy la vuelta a este vacío. Watch the frequency snap right into the pocket.',
    characterIds: ['super-puff'],
    cameraTrajectory: 'Whip Pan Snap',
    motionFlowScore: 9.4,
    seedance25Prompt: 'Epic visual transformation, Seedance 2.5 video diffusion, CRT scanline peel effect revealing cosmic starry nebula behind a bodega, 4K anime vector precision, liquid chrome physics as floating soda cans melt into reflective mercury spheres, pastel galaxy smoke swirling from dragon nostrils, volumetric lighting shafts piercing reality tear, 60fps dynamic motion flow --motion 9.4 --cfg 8.5 --ar 16:9 --seed 987654',
    negativePrompt: 'dull colors, static, low quality, photorealistic skin, blurry edges, bad framing, text overlays',
    audioTrackId: 'track-01',
    extensionState: { extendedForwardSec: 0, extendedBackwardSec: 0, continuityScore: 9.7 }
  },
  {
    id: 'clip-04',
    clipNumber: 4,
    actTitle: 'Act II: Skyline Pursuit',
    timeStartSec: 90,
    timeEndSec: 120,
    timecode: '01:30 - 02:00',
    sceneAction: 'Super Puff steps onto the edge of an obsidian skyscraper rooftop. A deck of pure liquid mercury forms beneath his sneakers, locking into an aerodynamic hoverboard.',
    dialogueText: 'They set their clocks to Greenwich. I set mine to the frequency of chrome.',
    characterIds: ['super-puff'],
    cameraTrajectory: 'Crane Up 45°',
    motionFlowScore: 9.6,
    seedance25Prompt: 'High-octane action opening, Seedance 2.5 video diffusion, 4K anime styling, cyberpunk streetwear dragon jumping off skyscraper on levitating liquid mercury hoverboard, fiber-optic seams pulsing with cyan and magenta energy on oversized jacket, rain-slicked futuristic skyline, camera diving downwards in 60fps kinematic tracking, motion blur, octane render reflections, intense kinetic flow --motion 9.6 --cfg 8.5 --ar 16:9 --seed 778899',
    negativePrompt: 'choppy motion, low framerate, static background, photorealistic human skin, muddy textures, artifacts',
    audioTrackId: 'track-04',
    extensionState: { extendedForwardSec: 7, extendedBackwardSec: 0, continuityScore: 9.9 }
  },
  {
    id: 'clip-05',
    clipNumber: 5,
    actTitle: 'Act II: Skyline Pursuit',
    timeStartSec: 120,
    timeEndSec: 150,
    timecode: '02:00 - 02:30',
    sceneAction: 'Aegis security drones surround the slipstream corridor, projecting red geometric barrier laser nets. Super Puff blows a holographic 8-bit smoke ring that hacks the drone HUDs.',
    dialogueText: 'High-tech surveillance... hacked with an 8-bit smoke ring. Dale gas!',
    characterIds: ['super-puff', 'aegis-sentinel'],
    cameraTrajectory: 'Pan Left-to-Right',
    motionFlowScore: 9.3,
    seedance25Prompt: 'Comedic cyber action gag, Seedance 2.5 video diffusion, holographic smoke ring transforming drone HUD into 8-bit retro pixel arcade game, drones bumping into each other in comedic choreography, anime streetwear dragon zooming away on liquid chrome board, vibrant pixels mixing with 4K anime vector lines, humorous timing, fluid motion --motion 9.3 --cfg 8.2 --ar 16:9 --seed 334455',
    negativePrompt: 'serious tone, realistic blood, broken anatomy, artifacts, low quality textures',
    audioTrackId: 'track-04',
    extensionState: { extendedForwardSec: 0, extendedBackwardSec: 0, continuityScore: 9.5 }
  },
  {
    id: 'clip-06',
    clipNumber: 6,
    actTitle: 'Act III: Sub-Bass Shrine',
    timeStartSec: 150,
    timeEndSec: 180,
    timecode: '02:30 - 03:00',
    sceneAction: 'Super Puff lands on the stone pathway of a cybernetic Shinto shrine. Floating matte-black torii gates hover in mid-air amidst glowing fiber-optic bamboo.',
    dialogueText: 'Respect the ancestors... but don\'t sleep on the sub frequencies. In this temple, enlightenment comes at thirty-eight hertz.',
    characterIds: ['super-puff', 'd9-titan'],
    cameraTrajectory: 'Push-In Macro',
    motionFlowScore: 8.9,
    seedance25Prompt: 'Ethereal environment establishing shot, Seedance 2.5 video diffusion, ancient cybernetic Shinto shrine amidst glowing fiber-optic bamboo forest, floating matte black torii gates with liquid chrome ribbons, volumetric teal mist, 4K anime architectural precision, peaceful sacred atmosphere, slow steady forward tracking, cel-shaded precision, serene spiritual flow --motion 8.9 --cfg 7.8 --ar 16:9 --seed 123456',
    negativePrompt: 'western architecture, jittery camera, flat textures, low detail, muddy lighting, oversaturated bloom',
    audioTrackId: 'track-02',
    extensionState: { extendedForwardSec: 10, extendedBackwardSec: 0, continuityScore: 9.8 }
  }
];

export const INITIAL_MULTIMODAL_SLOTS: MultimodalReferenceSlot[] = [
  {
    id: 'slot-01',
    type: 'character-sheet',
    name: 'Super Puff 360° Character Sheet',
    taggedCharacterId: 'super-puff',
    weight: 0.95,
    status: 'loaded'
  },
  {
    id: 'slot-02',
    type: 'character-sheet',
    name: 'D9 Binary Titan Mecha Turnaround',
    taggedCharacterId: 'd9-titan',
    weight: 0.9,
    status: 'loaded'
  },
  {
    id: 'slot-03',
    type: 'style-guide',
    name: 'Dragon 9 4K Cel-Shaded Style Guide (Neon Aqua + Obsidian)',
    weight: 0.85,
    status: 'loaded'
  },
  {
    id: 'slot-04',
    type: 'audio-reference',
    name: '432Hz Solfeggio Sub-Bass Audio Sync Track',
    weight: 0.8,
    status: 'ready'
  },
  {
    id: 'slot-05',
    type: 'background-plate',
    name: 'Iridescent Cyber Bodega 3D Environment Plate',
    weight: 0.75,
    status: 'loaded'
  }
];

export const DEFAULT_PIPELINE_CONFIG: CDancePipelineConfig = {
  activeModel: 'Seedance 2.5 Pro (Multimodal 50 Ref)',
  multimodalSlots: INITIAL_MULTIMODAL_SLOTS,
  globalMotionFlow: 9.2,
  cfgScale: 8.0,
  aspectRatio: '16:9',
  seed: 432108,
  upscaleTarget: '4K 60fps',
  audioSyncSettings: {
    syncToleranceMs: 15,
    lipSyncStrength: 0.92,
    rhythmSnap: true
  },
  motionBlurIntensity: 75,
  exportFormat: 'C Dance Batch Package'
};
