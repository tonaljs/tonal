'use client';

import { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { audioEngine } from '@/lib/audio/audioEngine';

interface AudioPlayerProps {
  notes: string[];
  label?: string;
}

export default function AudioPlayer({ notes, label }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    await audioEngine.playSequence(notes, 0.5);
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
      <button
        onClick={handlePlay}
        disabled={isPlaying}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        aria-label={isPlaying ? 'Playing' : 'Play'}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="flex items-center gap-2">
        <Volume2 size={20} className="text-gray-600" />
        {label && <span className="text-sm font-medium">{label}</span>}
      </div>
      <div className="text-sm text-gray-600">{notes.join(' - ')}</div>
    </div>
  );
}
