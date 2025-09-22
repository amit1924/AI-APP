export class SpeechService {
  constructor(settings) {
    this.settings = settings;
  }

  speakText(text) {
    if ('speechSynthesis' in window && this.settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.settings.language;
      window.speechSynthesis.speak(utterance);
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
