'use client';

import { useState } from 'react';
import Link from 'next/link';
import { lessons } from '@/lib/data/lessons';
import { BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import MajorScaleLesson from '@/components/lessons/MajorScaleLesson';
import IntervalsLesson from '@/components/lessons/IntervalsLesson';
import MinorScaleLesson from '@/components/lessons/MinorScaleLesson';
import ChordsLesson from '@/components/lessons/ChordsLesson';

const lessonComponents: Record<string, React.ComponentType> = {
  'major-scale': MajorScaleLesson,
  'intervals': IntervalsLesson,
  'minor-scale': MinorScaleLesson,
  'chords': ChordsLesson,
};

export default function LessonPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const LessonComponent = selectedLesson ? lessonComponents[selectedLesson] : null;

  if (selectedLesson && LessonComponent) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft size={20} />
              Back to Lessons
            </button>
          </div>
        </div>
        <LessonComponent />
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
          <h1 className="text-4xl font-bold mb-4">Music Theory Lessons</h1>
          <p className="text-gray-600 text-lg">
            Choose a lesson to begin your music theory journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson.id)}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {lesson.completed ? (
                    <CheckCircle size={24} className="text-green-500" />
                  ) : (
                    <BookOpen size={24} className="text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                  <p className="text-gray-600 mb-3">{lesson.description}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-700'
                          : lesson.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
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
