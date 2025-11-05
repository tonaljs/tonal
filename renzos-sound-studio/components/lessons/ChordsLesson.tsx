'use client';

import AudioPlayer from '@/components/audio/AudioPlayer';

export default function ChordsLesson() {
  const chords = [
    { name: 'C Major', notes: ['C4', 'E4', 'G4'] },
    { name: 'A Minor', notes: ['A3', 'C4', 'E4'] },
    { name: 'F Major', notes: ['F3', 'A3', 'C4'] },
    { name: 'G Major', notes: ['G3', 'B3', 'D4'] },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Basic Chords</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are Chords?</h2>
          <p className="text-gray-700 mb-4">
            A chord is formed when three or more notes are played simultaneously. Chords provide
            the harmonic foundation for most Western music.
          </p>
          <p className="text-gray-700 mb-4">
            The most basic type of chord is a <strong>triad</strong>, which consists of three notes:
            the root, the third, and the fifth.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Chords</h2>
          <div className="space-y-4">
            {chords.map((chord) => (
              <div key={chord.name} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{chord.name}</h3>
                <AudioPlayer notes={chord.notes} label={`Play ${chord.name}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Major vs Minor Chords</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              The difference between major and minor chords lies in the third:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Major Chord</strong>: Root + Major 3rd (4 semitones) + Perfect 5th (7 semitones)
              </li>
              <li>
                <strong>Minor Chord</strong>: Root + Minor 3rd (3 semitones) + Perfect 5th (7 semitones)
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Major chords tend to sound bright and happy, while minor chords sound more somber and sad.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
