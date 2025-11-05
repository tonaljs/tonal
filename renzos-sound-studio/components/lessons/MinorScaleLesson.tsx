'use client';

import AudioPlayer from '@/components/audio/AudioPlayer';

export default function MinorScaleLesson() {
  const aMinorScale = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">The Minor Scale</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is a Minor Scale?</h2>
          <p className="text-gray-700 mb-4">
            The minor scale has a darker, more melancholic sound compared to the major scale.
            Like the major scale, it contains seven notes, but with a different pattern of
            whole and half steps.
          </p>
          <p className="text-gray-700 mb-4">
            Natural minor pattern: <strong>W-H-W-W-H-W-W</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">A Natural Minor Scale</h2>
          <p className="text-gray-700 mb-4">
            The A natural minor scale is the relative minor of C major (they share the same notes):
          </p>
          <AudioPlayer notes={aMinorScale} label="A Natural Minor Scale" />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Minor Scales</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              There are three types of minor scales:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <strong>Natural Minor</strong>: The basic form following W-H-W-W-H-W-W
              </li>
              <li>
                <strong>Harmonic Minor</strong>: Raises the 7th scale degree by a half step
              </li>
              <li>
                <strong>Melodic Minor</strong>: Raises the 6th and 7th degrees ascending,
                returns to natural minor descending
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
