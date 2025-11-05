// Storage Engine for persisting user progress and preferences

import { UserProgress, Achievement } from '@/types';

const STORAGE_KEYS = {
  USER_PROGRESS: 'renzo_user_progress',
  PREFERENCES: 'renzo_preferences',
} as const;

export class StorageEngine {
  /**
   * Save user progress to localStorage
   */
  saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  /**
   * Load user progress from localStorage
   */
  loadProgress(): UserProgress | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  /**
   * Mark a lesson as completed
   */
  completLesson(lessonId: string): void {
    const progress = this.loadProgress() || this.getDefaultProgress();

    if (!progress.lessonsCompleted.includes(lessonId)) {
      progress.lessonsCompleted.push(lessonId);
      this.saveProgress(progress);
    }
  }

  /**
   * Save quiz score
   */
  saveQuizScore(quizId: string, score: number): void {
    const progress = this.loadProgress() || this.getDefaultProgress();
    progress.quizScores[quizId] = score;
    this.saveProgress(progress);
  }

  /**
   * Award achievement
   */
  awardAchievement(achievementId: string, achievement: Achievement): void {
    const progress = this.loadProgress() || this.getDefaultProgress();

    const existingIndex = progress.achievements.findIndex(a => a.id === achievementId);

    if (existingIndex === -1) {
      progress.achievements.push({ ...achievement, earned: true, earnedDate: new Date() });
      this.saveProgress(progress);
    }
  }

  /**
   * Get default progress object
   */
  private getDefaultProgress(): UserProgress {
    return {
      lessonsCompleted: [],
      quizScores: {},
      achievements: [],
      currentStreak: 0,
    };
  }

  /**
   * Reset all progress (useful for testing)
   */
  resetProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
  }
}

export const storageEngine = new StorageEngine();
