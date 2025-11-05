'use client';

import AudioPlayer from '@/components/audio/AudioPlayer';

export default function IntervalsLesson() {
  const intervals = [
    { name: 'Perfect Unison', notes: ['C4', 'C4'] },
    { name: 'Major 2nd', notes: ['C4', 'D4'] },
    { name: 'Major 3rd', notes: ['C4', 'E4'] },
    { name: 'Perfect 4th', notes: ['C4', 'F4'] },
    { name: 'Perfect 5th', notes: ['C4', 'G4'] },
    { name: 'Octave', notes: ['C4', 'C5'] },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Musical Intervals</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are Intervals?</h2>
          <p className="text-gray-700 mb-4">
            An interval is the distance between two pitches. Intervals are the building blocks
            of melodies, harmonies, and chords.
          </p>
          <p className="text-gray-700 mb-4">
            Intervals are measured in semitones (half steps). Each interval has a specific sound
            and character that makes it unique.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Intervals</h2>
          <div className="space-y-4">
            {intervals.map((interval) => (
              <div key={interval.name} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{interval.name}</h3>
                <AudioPlayer notes={interval.notes} label={`Play ${interval.name}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Interval Quality</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Intervals can be classified by their quality:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Perfect</strong>: Unison, 4th, 5th, Octave</li>
              <li><strong>Major/Minor</strong>: 2nd, 3rd, 6th, 7th</li>
              <li><strong>Augmented/Diminished</strong>: Altered versions of the above</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
