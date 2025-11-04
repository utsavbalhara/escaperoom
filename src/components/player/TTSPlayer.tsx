'use client';

import React, { useEffect, useState } from 'react';
import { useTTS } from '@/hooks/useTTS';
import Button from '@/components/shared/Button';

interface TTSPlayerProps {
  text: string;
  autoPlay?: boolean;
  manualTrigger?: number;
}

export default function TTSPlayer({ text, autoPlay = false, manualTrigger = 0 }: TTSPlayerProps) {
  const { speak, replay, isSpeaking } = useTTS();
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (text && autoPlay && !hasPlayed) {
      speak(text, true);
      setHasPlayed(true);
    }
  }, [text, autoPlay, speak, hasPlayed]);

  // Handle manual trigger from admin
  useEffect(() => {
    if (manualTrigger > 0 && text) {
      speak(text, true);
    }
  }, [manualTrigger, text, speak]);

  return (
    <div className="card mb-6 bg-dark/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${isSpeaking ? 'bg-danger animate-pulse' : 'bg-primary/30'}`} />
          <span className="text-sm text-primary/70">
            {isSpeaking ? 'Speaking...' : 'Audio Ready'}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={replay}
          disabled={isSpeaking}
        >
          {isSpeaking ? '🔊 Playing...' : '🔊 Replay Audio'}
        </Button>
      </div>
    </div>
  );
}
