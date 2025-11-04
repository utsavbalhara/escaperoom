'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';

interface HintButtonProps {
  hintText: string;
}

export default function HintButton({ hintText }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="mb-6">
      <Button
        variant="secondary"
        size="md"
        onClick={() => setShowHint(!showHint)}
        className="w-full"
      >
        {showHint ? '🔒 Hide Hint' : '💡 Show Hint'}
      </Button>

      {showHint && (
        <div className="card mt-4 bg-secondary/10 border-secondary">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-lg font-bold text-secondary mb-2">HINT:</h4>
              <RoboticText size="md" className="text-secondary">
                {hintText}
              </RoboticText>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
