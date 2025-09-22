export class VoiceRecognition {
  constructor(settings) {
    this.settings = settings;
    this.recognition = null;
    this.isListening = false;
  }

  startRecognition(onResult, onError, onStart, onEnd) {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Your browser does not support speech recognition.');
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = this.settings.language;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.start();
  }

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isSupported() {
    return 'webkitSpeechRecognition' in window;
  }
}
