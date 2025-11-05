'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target } from 'lucide-react';
import IntervalQuiz from '@/components/quiz/IntervalQuiz';

export default function PracticePage() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  const quizzes = [
    {
      id: 'intervals',
      title: 'Interval Recognition',
      description: 'Test your ability to identify musical intervals',
      difficulty: 'beginner',
    },
    {
      id: 'scales',
      title: 'Scale Identification',
      description: 'Identify major and minor scales (Coming Soon)',
      difficulty: 'intermediate',
      disabled: true,
    },
    {
      id: 'chords',
      title: 'Chord Recognition',
      description: 'Recognize different chord types (Coming Soon)',
      difficulty: 'intermediate',
      disabled: true,
    },
  ];

  if (activeQuiz === 'intervals') {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <button
              onClick={() => setActiveQuiz(null)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft size={20} />
              Back to Practice
            </button>
          </div>
        </div>
        <div className="py-8">
          <IntervalQuiz />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Practice Quizzes</h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge and track your progress
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => !quiz.disabled && setActiveQuiz(quiz.id)}
              disabled={quiz.disabled}
              className={`p-6 bg-white rounded-xl shadow-lg transition-all text-left ${
                quiz.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-xl cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target size={24} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-3">{quiz.description}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quiz.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
