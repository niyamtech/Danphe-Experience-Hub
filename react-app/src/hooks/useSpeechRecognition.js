import { useCallback, useEffect, useRef, useState } from 'react';

export const useSpeechRecognition = ({ keywords = [], onMatch } = {}) => {
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const latest = event.results[event.results.length - 1][0].transcript.trim();
        setTranscript((prev) => `${prev}\n${latest}`.trim());
        const normalized = latest.toLowerCase();
        if (keywords.length) {
          keywords.forEach((word) => {
            if (normalized.includes(word.toLowerCase())) {
              onMatch?.(word, latest);
            }
          });
        }
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [keywords, onMatch]);

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setTranscript('');
      setIsListening(true);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, start, stop, transcript };
};
