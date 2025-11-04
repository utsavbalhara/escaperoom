import React from 'react';
import RoboticText from '@/components/shared/RoboticText';

interface QuestionDisplayProps {
  questionText: string;
}

export default function QuestionDisplay({ questionText }: QuestionDisplayProps) {
  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold text-secondary mb-4">CHALLENGE:</h3>
      <RoboticText size="lg" className="leading-relaxed whitespace-pre-wrap">
        {questionText}
      </RoboticText>
    </div>
  );
}
