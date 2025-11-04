import { useEffect, useCallback, useRef, useState } from 'react';
import { ttsService } from '@/lib/tts';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentTextRef = useRef<string>('');

  const speak = useCallback((text: string, autoPlay: boolean = false) => {
    if (!text) return;

    currentTextRef.current = text;

    if (autoPlay || !ttsService.isSpeaking()) {
      setIsSpeaking(true);
      ttsService.speak(
        text,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    }
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
    setIsSpeaking(false);
  }, []);

  const replay = useCallback(() => {
    if (currentTextRef.current) {
      speak(currentTextRef.current, true);
    }
  }, [speak]);

  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  return {
    speak,
    stop,
    replay,
    isSpeaking,
  };
}
