import { TTS_VOICE_SETTINGS } from '@/constants';

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      // Handle voice loading for Chrome
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  private selectVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // Try to find a female voice
    let voice = this.voices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria')
    );

    // Fallback to Google voices
    if (!voice) {
      voice = this.voices.find(v =>
        v.name.includes('Google') && !v.name.includes('Male')
      );
    }

    // Fallback to any English voice
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith('en'));
    }

    return voice || this.voices[0] || null;
  }

  speak(text: string, onEnd?: () => void, onStart?: () => void): void {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.selectVoice();

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = TTS_VOICE_SETTINGS.rate;
    utterance.pitch = TTS_VOICE_SETTINGS.pitch;
    utterance.volume = TTS_VOICE_SETTINGS.volume;

    if (onStart) {
      utterance.onstart = onStart;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

// Export singleton instance
export const ttsService = new TTSService();
