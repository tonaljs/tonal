'use client';

import AudioPlayer from '@/components/audio/AudioPlayer';

export default function MajorScaleLesson() {
  const cMajorScale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">The Major Scale</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is a Major Scale?</h2>
          <p className="text-gray-700 mb-4">
            The major scale is one of the most fundamental concepts in Western music theory.
            It consists of seven notes arranged in a specific pattern of whole steps and half steps.
          </p>
          <p className="text-gray-700 mb-4">
            The pattern is: <strong>W-W-H-W-W-W-H</strong> (W = whole step, H = half step)
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">C Major Scale</h2>
          <p className="text-gray-700 mb-4">
            Let's listen to the C major scale, which contains no sharps or flats:
          </p>
          <AudioPlayer notes={cMajorScale} label="C Major Scale" />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Practice Exercise</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Try to identify the major scale pattern in other keys. Remember the formula:
              W-W-H-W-W-W-H
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Start on any note</li>
              <li>Follow the pattern of whole and half steps</li>
              <li>You should end up one octave higher on the same note</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
