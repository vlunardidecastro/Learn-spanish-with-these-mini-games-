/**
 * Web Audio API procedural sound synthesizer and Web Speech API Spanish pronunciation.
 * 100% self-contained with zero external audio assets.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Slicing chop sound (crisp knife contact on wooden cutting board)
  public playChopSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(2.5, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    // Add wooden click transient
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);

    noiseSource.connect(gain);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(t);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Stone thud (heavy basalt stone contact when ingredient drops into molcajete)
  public playThudSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.16);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Mashing sound (pestle grinding ingredients)
  public playMashSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.22);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Squeezing lime juice sound
  public playLimeSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Salt sprinkle sound
  public playSaltSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / noiseBuffer.length) * Math.PI * 4);
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2500, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(t);
  }

  // Gentle wrong item chime (supportive, gentle wobble)
  public playGentleWrongSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(280, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Step success ding (bright pleasant ascending interval)
  public playStepSuccessChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.001, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.45);
    });
  }

  // Celebratory Mariachi Guitar Fanfare (Mexican folk progression: G -> C -> D7 -> G)
  public playVictoryMariachiFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Chords: G major, C major, D7, G major with festive syncopated strums
    const chords = [
      { delay: 0.0, notes: [392.0, 493.88, 587.33, 783.99] }, // G
      { delay: 0.25, notes: [392.0, 493.88, 587.33, 783.99] }, // G
      { delay: 0.5, notes: [523.25, 659.25, 783.99, 1046.5] }, // C
      { delay: 0.8, notes: [587.33, 739.99, 880.0, 1174.66] }, // D
      { delay: 1.1, notes: [392.0, 493.88, 587.33, 783.99, 987.77] }, // Big final G!
    ];

    chords.forEach((chord) => {
      chord.notes.forEach((freq, nIdx) => {
        const strumOffset = nIdx * 0.015; // acoustic strum displacement
        const noteTime = t + chord.delay + strumOffset;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm bright acoustic guitar harmonic
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + (chord.delay > 1.0 ? 0.9 : 0.35));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 1.0);
      });
    });
  }

  // Web Speech API Native Spanish Pronunciation & Melodic Cue
  public speakSpanish(text: string, onEnd?: () => void) {
    if (this.isMuted) return;

    // First, play a crisp melodic acoustic marimba/guitar speech cue via Web Audio
    // This guarantees immediate audible feedback even if system TTS is initializing
    this.playSpeechPromptTone();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      const synth = window.speechSynthesis;
      // Resume if browser suspended audio context or speech
      if (synth.paused) {
        synth.resume();
      }
      synth.cancel(); // cancel any stale queued utterance

      const cleanText = text.replace(/[🥑🍅🧅🌿🍋🧂🔪🥣🎉]/g, '').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-MX'; // Mexican Spanish
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Select best available Spanish voice
      const voices = synth.getVoices();
      const spanishVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('es-mx') ||
          v.lang.toLowerCase().startsWith('es-us') ||
          v.lang.toLowerCase().startsWith('es-es') ||
          v.lang.toLowerCase().startsWith('es')
      );
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      // Store utterance globally to prevent Chrome garbage collector bug
      (window as any).__lastSpeechUtterance = utterance;

      // Speak synchronously without setTimeout to preserve browser user-gesture token!
      synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  // Melodic prompt tone when Spanish is spoken
  private playSpeechPromptTone() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [587.33, 880.0]; // D5 -> A5 friendly chime
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.001, t + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, t + idx * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.2);
    });
  }
}

export const soundController = new SoundController();

// Pre-warm SpeechSynthesis voices immediately when page loads
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
