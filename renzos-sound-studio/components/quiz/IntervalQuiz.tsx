'use client';

import { useState, useEffect } from 'react';
import { quizEngine } from '@/lib/quiz/quizEngine';
import { storageEngine } from '@/lib/storage/storageEngine';
import { QuizQuestion } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

export default function IntervalQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const newQuestions = quizEngine.generateIntervalQuiz(10);
    setQuestions(newQuestions);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = quizEngine.checkAnswer(currentQuestion, answerIndex);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        const finalScore = quizEngine.calculateScore(questions.length, score + (isCorrect ? 1 : 0));
        storageEngine.saveQuizScore('interval-quiz', finalScore);
        setShowResult(true);
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  if (showResult) {
    const finalScore = quizEngine.calculateScore(questions.length, score);
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-blue-600 mb-4">{finalScore}%</p>
        <p className="text-gray-600">You got {score} out of {questions.length} correct</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const showFeedback = selectedAnswer !== null;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                showFeedback
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showFeedback && isCorrect && <CheckCircle className="text-green-500" />}
                {showFeedback && isSelected && !isCorrect && <XCircle className="text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
}
