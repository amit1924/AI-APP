import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

const VoiceHandler = ({ onTranscript, onListeningChange }) => {
  const { settings } = useChat();
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (
      !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = settings.language;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript?.(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onListeningChange?.(false);
    };

    recognitionRef.current.onend = () => {
      onListeningChange?.(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings.language, onTranscript, onListeningChange]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      onListeningChange?.(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      onListeningChange?.(false);
    }
  };

  // This component doesn't render anything
  return null;
};

export default VoiceHandler;
