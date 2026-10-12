class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check saved preference
    const saved = localStorage.getItem('grammar_safari_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('grammar_safari_muted', String(this.muted));
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    localStorage.setItem('grammar_safari_muted', String(val));
  }

  // Play a single synthesized tone with ADSR envelope
  private playTone(freq: number, type: OscillatorType, duration: number, delay: number = 0, gainLevel: number = 0.15) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  }

  public playCorrect() {
    if (this.muted) return;
    // Pleasant major triad arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    this.playTone(523.25, 'triangle', 0.18, 0, 0.2);
    this.playTone(659.25, 'triangle', 0.18, 0.08, 0.22);
    this.playTone(783.99, 'triangle', 0.22, 0.16, 0.25);
    this.playTone(1046.50, 'sine', 0.45, 0.24, 0.28);
  }

  public playWrong() {
    if (this.muted) return;
    // Soft, friendly gentle descending "wobble"
    this.initCtx();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playClick() {
    if (this.muted) return;
    this.playTone(800, 'sine', 0.04, 0, 0.08);
  }

  public playStreak() {
    if (this.muted) return;
    // Fast sparkly burst
    [659, 880, 1174, 1567].forEach((f, i) => {
      this.playTone(f, 'sine', 0.15, i * 0.06, 0.15);
    });
  }

  public playStar() {
    if (this.muted) return;
    this.playTone(987.77, 'sine', 0.25, 0, 0.2);
    this.playTone(1318.51, 'sine', 0.35, 0.08, 0.22);
  }

  public playLevelUp() {
    if (this.muted) return;
    // Grand cheerful fanfare
    const chords = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.50, d: 0.45 }
    ];
    chords.forEach((note, idx) => {
      this.playTone(note.f, 'triangle', note.d, idx * 0.1, 0.25);
    });
    // Add harmony chord at end
    setTimeout(() => {
      this.playTone(1318.51, 'sine', 0.5, 0, 0.18);
    }, 300);
  }
}

export const sound = new SoundController();
