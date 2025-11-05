// Quiz Engine for generating and managing quizzes

import { QuizQuestion } from '@/types';

export class QuizEngine {
  /**
   * Generate interval quiz questions
   */
  generateIntervalQuiz(count: number = 10): QuizQuestion[] {
    const intervals = [
      { name: 'Unison', semitones: 0 },
      { name: 'Minor 2nd', semitones: 1 },
      { name: 'Major 2nd', semitones: 2 },
      { name: 'Minor 3rd', semitones: 3 },
      { name: 'Major 3rd', semitones: 4 },
      { name: 'Perfect 4th', semitones: 5 },
      { name: 'Tritone', semitones: 6 },
      { name: 'Perfect 5th', semitones: 7 },
      { name: 'Minor 6th', semitones: 8 },
      { name: 'Major 6th', semitones: 9 },
      { name: 'Minor 7th', semitones: 10 },
      { name: 'Major 7th', semitones: 11 },
      { name: 'Octave', semitones: 12 },
    ];

    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const correctInterval = intervals[Math.floor(Math.random() * intervals.length)];
      const otherIntervals = intervals
        .filter(int => int.name !== correctInterval.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctInterval, ...otherIntervals]
        .sort(() => Math.random() - 0.5)
        .map(int => int.name);

      const correctAnswer = options.indexOf(correctInterval.name);

      questions.push({
        id: `interval_${i}`,
        question: `What interval is ${correctInterval.semitones} semitones?`,
        options,
        correctAnswer,
        explanation: `${correctInterval.name} is ${correctInterval.semitones} semitones.`,
      });
    }

    return questions;
  }

  /**
   * Calculate quiz score
   */
  calculateScore(totalQuestions: number, correctAnswers: number): number {
    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  /**
   * Check if answer is correct
   */
  checkAnswer(question: QuizQuestion, selectedAnswer: number): boolean {
    return question.correctAnswer === selectedAnswer;
  }
}

export const quizEngine = new QuizEngine();
