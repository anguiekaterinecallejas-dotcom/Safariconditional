class SpeechController {
  private slowMode: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    const saved = localStorage.getItem('grammar_safari_slow_speech');
    if (saved !== null) {
      this.slowMode = saved === 'true';
    }
  }

  public isSlowMode(): boolean {
    return this.slowMode;
  }

  public toggleSlowMode(): boolean {
    this.slowMode = !this.slowMode;
    localStorage.setItem('grammar_safari_slow_speech', String(this.slowMode));
    return this.slowMode;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = this.slowMode ? 0.75 : 0.95;
    utterance.pitch = 1.05; // Slightly friendly, high-clarity pitch

    // Try finding an English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const speech = new SpeechController();
