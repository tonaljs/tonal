'use client';

import Link from 'next/link';
import { Music, BookOpen, Target, Award } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: 'Interactive Lessons',
      description: 'Learn music theory with audio examples and step-by-step explanations',
      link: '/lessons',
    },
    {
      icon: <Target size={32} />,
      title: 'Practice Quizzes',
      description: 'Test your knowledge with interactive quizzes and get instant feedback',
      link: '/practice',
    },
    {
      icon: <Award size={32} />,
      title: 'Track Progress',
      description: 'Earn achievements and track your learning journey',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500 rounded-full">
              <Music size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Renzo's Sound Studio
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Learn music theory through interactive lessons and engaging practice
          </p>
          <Link
            href="/lessons"
            className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Why Learn Music Theory?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">🎵 Understand Music Better</h3>
              <p>Learn how your favorite songs are constructed and why they sound the way they do.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎸 Improve Your Skills</h3>
              <p>Whether you play an instrument or sing, theory helps you improve faster.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✍️ Compose Better</h3>
              <p>Create your own music with confidence using theoretical knowledge.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎼 Communicate Effectively</h3>
              <p>Speak the universal language of musicians around the world.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
