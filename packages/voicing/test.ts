import { Voicing, VoiceLeading, enharmonicEquivalent } from './index';
import { VoicingDictionary } from './data';
const { lefthand, triads } = VoicingDictionary;
const { topNoteDiff } = VoiceLeading;

describe('search', () => {
  test('C major triad inversions', () => {
    expect(Voicing.search('C', ['C3', 'C5'], triads)).toEqual([
      ['C3', 'E3', 'G3'],
      ['C4', 'E4', 'G4'],
      ['E3', 'G3', 'C4'],
      ['E4', 'G4', 'C5'],
      ['G3', 'C4', 'E4'],
    ]);
  });
  // here, we override range and dictionary
  test('C^7 lefthand', () => {
    expect(Voicing.search('C^7', ['E3', 'D5'], lefthand)).toEqual([
      ['E3', 'G3', 'B3', 'D4'],
      ['E4', 'G4', 'B4', 'D5'],
      ['B3', 'D4', 'E4', 'G4'],
    ]);
  });
  // this shows that even symbols that are not part of chord-type could be used, as long as they are present in the dictionary
  test('Cminor7 lefthand', () => {
    expect(Voicing.search('Cminor7', ['Eb3', 'D5'], { minor7: ['3m 5P 7m 9M', '7m 9M 10m 12P'] })).toEqual([
      ['Eb3', 'G3', 'Bb3', 'D4'],
      ['Eb4', 'G4', 'Bb4', 'D5'],
      ['Bb3', 'D4', 'Eb4', 'G4'],
    ]);
  });
});

describe('get', () => {
  test('get', () => {
    // all default => pretty useless but
    expect(Voicing.get('Dm7')).toEqual(['F3', 'A3', 'C4', 'E4']);
    // without lastVoicing
    expect(Voicing.get('Dm7', ['F3', 'A4'], lefthand, topNoteDiff)).toEqual(['F3', 'A3', 'C4', 'E4']);
    // with lastVoicing
    expect(Voicing.get('Dm7', ['F3', 'A4'], lefthand, topNoteDiff, ['C4', 'E4', 'G4', 'B4'])).toEqual([
      'C4',
      'E4',
      'F4',
      'A4',
    ]);
  });
});

describe('VoiceLeading', () => {
  test('topNoteDiff', () => {
    expect(
      topNoteDiff(
        [
          ['F3', 'A3', 'C4', 'E4'],
          ['C4', 'E4', 'F4', 'A4'],
        ],
        ['C4', 'E4', 'G4', 'B4']
      )
    ).toEqual(['C4', 'E4', 'F4', 'A4']);
  });
});

test('enharmonicEquivalent', () => {
  expect(enharmonicEquivalent('F2', 'E#')).toBe('E#2');
  expect(enharmonicEquivalent('B2', 'Cb')).toBe('Cb3');
  expect(enharmonicEquivalent('C2', 'B#')).toBe('B#1');
});

test('sequence', () => {
  expect(Voicing.sequence(['C', 'F', 'G'], ['F3', 'A4'], triads, VoiceLeading.topNoteDiff)).toEqual([
    ['C4', 'E4', 'G4'], // root position
    ['A3', 'C4', 'F4'], // first inversion (F4 closest to G4)
    ['B3', 'D4', 'G4'], // first inversion (G4 closest to F4)
  ]);
});

/*
test('analyze', () => {
  expect(Voicing.analyze(['C4', 'E4', 'G4', 'B4'])).toEqual({
    topNote: 'B4',
    bottomNote: 'C4',
    midiAverage: 85.4, // did not check :)
    // many more values possible
  });
})

test('analyzeTransition', () => {
  expect(Voicing.analyzeTransition(['C4', 'E4', 'G4', 'B4'], ['D4', 'F4', 'A4', 'C5'])).toEqual({
    topNoteDiff: 1,
    bottomNoteDiff: 2,
    movement: 5
  })
})
test('intervalSets', () => {
  expect(Voicing.intervalSets('M7', lefthand)).toEqual([['3M 5P 7M 9M', '7M 9M 10M 12P']]);
  // could also be used with chord symbol (ignore root)
  expect(Voicing.intervalSets('CM7', lefthand)).toEqual([['3M 5P 7M 9M', '7M 9M 10M 12P']]);
})

test('searchSets', () => {
  expect(
    Voicing.searchSets(
      [
        ['1P', '3M', '5P'],
        ['3M', '5P', '8P'],
      ],
      ['C3', 'G4'],
      'C'
    )
  ).toEqual([
    ['C3', 'E3', 'G3'],
    ['E3', 'G3', 'C4'],
    ['C4', 'E4', 'G4'],
  ]);
}) */
