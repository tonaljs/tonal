// Type definitions for Renzo's Sound Studio

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface UserProgress {
  lessonsCompleted: string[];
  quizScores: Record<string, number>;
  achievements: Achievement[];
  currentStreak: number;
}

export interface AudioNote {
  note: string;
  octave: number;
  duration: number;
}

export interface Scale {
  name: string;
  notes: string[];
  intervals: number[];
}

export interface Chord {
  name: string;
  notes: string[];
  type: 'major' | 'minor' | 'diminished' | 'augmented';
}
