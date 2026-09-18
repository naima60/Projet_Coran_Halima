// Web Audio API based Sound Generator (Beep on mistake, chime on success)

class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play the "Beep / Pip" alert sound when a word is pronounced incorrectly
   */
  public playErrorBeep(volume: number = 0.4) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Low frequency buzzer "بيب" alert
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn('AudioContext error for beep:', e);
    }
  }

  /**
   * Play a high pleasant chime when a word or verse is correctly recited
   */
  public playSuccessChime(volume: number = 0.25) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Harmonic chords (Major triad)
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(volume / (i + 1), now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.45);
      });
    } catch (e) {
      console.warn('AudioContext error for success chime:', e);
    }
  }

  /**
   * Click / Tap feedback sound
   */
  public playTapSound() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
