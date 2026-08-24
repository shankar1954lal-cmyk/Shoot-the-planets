import { GameSettings, WeaponId } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVol: number = 0.8;
  private musicVol: number = 0.5;
  private isMusicPlaying: boolean = false;
  private musicTimer: number | null = null;
  private musicStep: number = 0;

  constructor() {
    // Lazy init audio context on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateSettings(settings: GameSettings) {
    this.sfxVol = settings.sfxVolume;
    this.musicVol = settings.musicVolume;
  }

  // --- WEAPON SHOOT SOUNDS ---
  public playShootSound(weaponId: WeaponId) {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.value = this.sfxVol;
    master.connect(this.ctx.destination);

    switch (weaponId) {
      case 'mk1': {
        // Quick laser zap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
      case 'mk2': {
        // Dual energy burst
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'square';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(600, now);
        osc1.frequency.exponentialRampToValueAtTime(100, now + 0.18);
        osc2.frequency.setValueAtTime(900, now);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 0.18);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(master);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.18);
        osc2.stop(now + 0.18);
        break;
      }
      case 'mk3': {
        // Plasma pulse triple chirp
        for (let i = 0; i < 3; i++) {
          const t = now + i * 0.03;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200 - i * 150, t);
          osc.frequency.exponentialRampToValueAtTime(200, t + 0.08);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.08);
        }
        break;
      }
      case 'mk4': {
        // Heavy vortex blast
        const osc = this.ctx.createOscillator();
        const noise = this.createNoiseBufferNode(0.2);
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        if (noise) noise.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'mk5': {
        // Cosmic Singularity Blast - heavy low sub + high cosmic sweep
        const oscLow = this.ctx.createOscillator();
        const oscHigh = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        oscLow.type = 'sine';
        oscLow.frequency.setValueAtTime(300, now);
        oscLow.frequency.exponentialRampToValueAtTime(30, now + 0.35);

        oscHigh.type = 'triangle';
        oscHigh.frequency.setValueAtTime(1800, now);
        oscHigh.frequency.exponentialRampToValueAtTime(200, now + 0.35);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        oscLow.connect(gain);
        oscHigh.connect(gain);
        gain.connect(master);

        oscLow.start(now);
        oscHigh.start(now);
        oscLow.stop(now + 0.35);
        oscHigh.stop(now + 0.35);
        break;
      }
    }
  }

  // --- PLANET EXPLOSION ---
  public playExplosionSound(isSpecial: boolean = false, isCritical: boolean = false) {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const dur = isSpecial ? 0.6 : 0.3;
    const master = this.ctx.createGain();
    master.gain.value = this.sfxVol * (isSpecial ? 1.2 : 0.9);
    master.connect(this.ctx.destination);

    // Noise explosion
    const noise = this.createNoiseBufferNode(dur);
    if (noise) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isSpecial ? 1500 : 800, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + dur);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isSpecial ? 0.6 : 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
    }

    // Sub bass thud
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(isSpecial ? 180 : 120, now);
    sub.frequency.exponentialRampToValueAtTime(20, now + dur);
    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + dur);
    sub.connect(subGain);
    subGain.connect(master);
    sub.start(now);
    sub.stop(now + dur);

    if (isSpecial) {
      // Golden shimmering arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        noteOsc.type = 'sine';
        noteOsc.frequency.value = freq;
        const t = now + 0.05 + idx * 0.06;
        noteGain.gain.setValueAtTime(0.2, t);
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        noteOsc.connect(noteGain);
        noteGain.connect(master);
        noteOsc.start(t);
        noteOsc.stop(t + 0.2);
      });
    }

    if (isCritical) {
      // High pitch sparkle chime
      const critOsc = this.ctx.createOscillator();
      const critGain = this.ctx.createGain();
      critOsc.type = 'triangle';
      critOsc.frequency.setValueAtTime(1400, now);
      critOsc.frequency.exponentialRampToValueAtTime(2200, now + 0.15);
      critGain.gain.setValueAtTime(0.3, now);
      critGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      critOsc.connect(critGain);
      critGain.connect(master);
      critOsc.start(now);
      critOsc.stop(now + 0.15);
    }
  }

  // --- COIN PICKUP SOUND ---
  public playCoinSound() {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // --- COMBO SOUND ---
  public playComboSound(comboCount: number) {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const baseFreq = 440; // A4
    const semitones = Math.min(comboCount * 2, 16);
    const freq = baseFreq * Math.pow(2, semitones / 12);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // --- HEART LOST / MISS SOUND ---
  public playMissSound() {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // --- GAME OVER SOUND ---
  public playGameOverSound() {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [400, 350, 300, 220];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      const t = now + idx * 0.15;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  // --- CLICK SOUND FOR UI ---
  public playClickSound() {
    this.initCtx();
    if (!this.ctx || this.sfxVol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // --- BACKGROUND COSMIC MUSIC SYNTHESIZER ---
  public startMusic() {
    this.initCtx();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.musicStep = 0;

    const notes = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25]; // A Minor Pentatonic
    
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || this.musicVol <= 0) return;
      const now = this.ctx.currentTime;

      // Subtle ambient bass chord
      if (this.musicStep % 16 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.value = 55; // A1
        bassGain.gain.setValueAtTime(this.musicVol * 0.15, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 2.5);
      }

      // Arpeggiator note
      if (Math.random() > 0.3) {
        const noteIndex = Math.floor(Math.random() * notes.length);
        const freq = notes[noteIndex];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(this.musicVol * 0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }

      this.musicStep++;
    }, 250);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private createNoiseBufferNode(duration: number): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.start();
    return noise;
  }
}

export const soundEngine = new SoundEngine();
