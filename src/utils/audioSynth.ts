class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscPrimary: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public ensureRunning() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number, isMuted: boolean = false) {
    this.init();
    this.volume = vol;
    if (!this.ctx || !this.masterGain) return;
    const target = isMuted ? 0 : vol;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
  }

  public playDrone(frequencyHz: '432Hz' | '528Hz' = '432Hz') {
    this.init();
    this.ensureRunning();
    this.stopDrone();
    if (!this.ctx || !this.masterGain) return;

    const fundamental = frequencyHz === '528Hz' ? 528 : 432;
    const baseFreq = fundamental / 4; // 108Hz or 132Hz

    const now = this.ctx.currentTime;
    this.oscPrimary = this.ctx.createOscillator();
    this.oscHarmonic = this.ctx.createOscillator();

    this.oscPrimary.type = 'sine';
    this.oscPrimary.frequency.setValueAtTime(baseFreq, now);

    this.oscHarmonic.type = 'triangle';
    this.oscHarmonic.frequency.setValueAtTime(baseFreq * 1.5, now); // Perfect fifth

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.25, now);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.1, now);

    this.oscPrimary.connect(gain1);
    this.oscHarmonic.connect(gain2);

    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    this.oscPrimary.start(now);
    this.oscHarmonic.start(now);
    this.isPlaying = true;
  }

  public stopDrone() {
    if (this.oscPrimary) {
      try { this.oscPrimary.stop(); } catch (_) {}
      this.oscPrimary.disconnect();
      this.oscPrimary = null;
    }
    if (this.oscHarmonic) {
      try { this.oscHarmonic.stop(); } catch (_) {}
      this.oscHarmonic.disconnect();
      this.oscHarmonic = null;
    }
    this.isPlaying = false;
  }

  public speakNarration(text: string, voiceName: string = 'Kore', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    // Pick voice if available
    const voices = window.speechSynthesis.getVoices();
    const pickedVoice = voices.find((v) => v.name.includes(voiceName) || v.lang.startsWith('en')) || voices[0];
    if (pickedVoice) utterance.voice = pickedVoice;

    utterance.onend = () => { onEnd?.(); };
    utterance.onerror = () => { onEnd?.(); };

    window.speechSynthesis.speak(utterance);
  }

  public stopNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new AudioEngine();
