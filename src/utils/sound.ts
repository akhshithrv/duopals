/**
 * Duolingo Tandem Web Audio Synthesizer & Speech Utilities
 * Provides tactile audio feedback (bell, XP fanfare, transition chimes) and Text-To-Speech.
 */

// Web Audio synthesizer for tactile UI sounds
class TandemSoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a cheerful chime when completing a speaking turn
  playTurnSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Play a friendly bell chime for the halfway split language switch
  playHalfwaySwitch() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    playTone(440, now, 0.4); // A4
    playTone(554.37, now + 0.15, 0.4); // C#5
    playTone(659.25, now + 0.3, 0.6); // E5
    playTone(880, now + 0.45, 0.8); // A5
  }

  // Play celebratory XP and streak fanfare
  playCompletionFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 }, // C5
      { f: 659.25, t: 0.15, d: 0.15 }, // E5
      { f: 783.99, t: 0.3, d: 0.15 }, // G5
      { f: 1046.5, t: 0.45, d: 0.5 }, // C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);
      gain.gain.setValueAtTime(0.25, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  // Play a soft click sound for button interactions
  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const sounds = new TandemSoundEffects();

// Speech Synthesis Helper supporting all languages
export function speakText(
  text: string,
  lang: string = 'es',
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return null;
  }

  window.speechSynthesis.cancel(); // Stop pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map language codes to BCP 47 speech tags
  const speechCodeMap: Record<string, string> = {
    es: 'es-ES',
    fr: 'fr-FR',
    ja: 'ja-JP',
    de: 'de-DE',
    ko: 'ko-KR',
    it: 'it-IT',
    pt: 'pt-BR',
    zh: 'zh-CN',
    en: 'en-US',
  };

  const bcpCode = speechCodeMap[lang] || lang || 'en-US';
  utterance.lang = bcpCode;
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  // Find native voice for that language
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find(
    (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()) || v.lang.toLowerCase().startsWith(bcpCode.toLowerCase())
  );
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };
  utterance.onend = () => {
    onEnd?.();
  };
  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

let currentAudioElement: HTMLAudioElement | null = null;

// Play high-fidelity AI voice audio generated by Gemini (audio/wav base64)
export function playAiVoiceAudio(
  base64Wav: string,
  onStart?: () => void,
  onEnd?: () => void
): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }

  try {
    const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
    currentAudioElement = audio;

    audio.onplay = () => {
      onStart?.();
    };
    audio.onended = () => {
      onEnd?.();
    };
    audio.onerror = (e) => {
      console.warn('Audio playback error:', e);
      onEnd?.();
    };

    audio.play().catch((err) => {
      console.warn('Autoplay may require user gesture:', err);
      onEnd?.();
    });

    return audio;
  } catch (err) {
    console.warn('Failed to play AI audio:', err);
    onEnd?.();
    return null;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
}
