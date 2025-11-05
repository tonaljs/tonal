// Lesson data and curriculum

import { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: 'major-scale',
    title: 'Major Scale',
    description: 'Learn about the major scale and its construction',
    content: 'The major scale is one of the most important scales in Western music...',
    difficulty: 'beginner',
  },
  {
    id: 'intervals',
    title: 'Musical Intervals',
    description: 'Understanding intervals and their importance in music',
    content: 'An interval is the distance between two pitches...',
    difficulty: 'beginner',
  },
  {
    id: 'minor-scale',
    title: 'Minor Scale',
    description: 'Explore the minor scale and its variations',
    content: 'The minor scale has a darker, more somber quality...',
    difficulty: 'intermediate',
  },
  {
    id: 'chords',
    title: 'Basic Chords',
    description: 'Introduction to major and minor chords',
    content: 'Chords are built by stacking intervals...',
    difficulty: 'intermediate',
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}

export function getLessonsByDifficulty(difficulty: Lesson['difficulty']): Lesson[] {
  return lessons.filter(lesson => lesson.difficulty === difficulty);
}
