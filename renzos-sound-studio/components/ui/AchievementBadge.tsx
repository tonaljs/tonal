'use client';

import { Achievement } from '@/types';
import { Award } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        achievement.earned
          ? 'border-yellow-400 bg-yellow-50'
          : 'border-gray-200 bg-gray-50 opacity-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${
            achievement.earned ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-500'
          }`}
        >
          <Award size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{achievement.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          {achievement.earned && achievement.earnedDate && (
            <p className="text-xs text-gray-500 mt-2">
              Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
