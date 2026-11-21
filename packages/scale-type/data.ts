// SCALES
// Format: ["intervals", "name", "alias1", "alias2", ...]
const SCALES: string[][] = [
  // Basic scales
  ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
  ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
  ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],

  // Jazz common scales
  ["1P 2M 3m 3M 5P 6M", "major blues"],
  ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
  ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
  ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
  ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
  ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],

  // Modes
  ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
  ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
  ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
  ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
  ["1P 2m 3m 4P 5d 6m 7m", "locrian"],

  // 5-note scales
  ["1P 3M 4P 5P 7M", "ionian pentatonic"],
  ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
  ["1P 2M 4P 5P 6M", "ritusen"],
  ["1P 2M 4P 5P 7m", "egyptian"],
  // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
  ["1P 3M 4P 5d 7m", "neapolitan major pentatonic"],
  ["1P 3m 4P 5P 6m", "vietnamese 1"],
  ["1P 2m 3m 5P 6m", "pelog"],
  ["1P 2m 4P 5P 6m", "kumoijoshi"],
  ["1P 2M 3m 5P 6m", "hirajoshi"],
  ["1P 2m 4P 5d 7m", "iwato"],
  ["1P 2m 4P 5P 7m", "in-sen"],
  ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
  ["1P 3m 4P 6m 7m", "malkos raga"],
  ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
  ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
  ["1P 3m 4P 5P 6M", "minor six pentatonic"],
  ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
  ["1P 2M 3M 5P 6m", "flat six pentatonic"],
  ["1P 2m 3M 5P 6M", "scriabin"],
  ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
  ["1P 3M 4A 5A 7M", "lydian #5p pentatonic"],
  ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
  ["1P 3m 4P 5P 7M", "minor #7m pentatonic"],
  ["1P 3m 4d 5d 7m", "super locrian pentatonic"],

  // 6-note scales
  ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
  ["1P 2A 3M 5P 5A 7M", "augmented"],
  ["1P 2M 4P 5P 6M 7m", "piongio"],
  // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
  ["1P 2m 3M 4A 6M 7m", "prometheus neapolitan"],
  ["1P 2M 3M 4A 6M 7m", "prometheus"],
  ["1P 2m 3M 5d 6m 7m", "mystery #1"],
  ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
  ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
  ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],

  // 7-note scales
  ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
  ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
  [
    "1P 2m 2A 3M 4A 6m 7m",
    "altered",
    "super locrian",
    "diminished whole tone",
    "pomeroy",
  ],
  ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
  [
    "1P 2M 3M 4P 5P 6m 7m",
    "mixolydian b6",
    "melodic minor fifth mode",
    "hindu",
  ],
  ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
  ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
  [
    "1P 2m 3m 4P 5P 6M 7m",
    "dorian b2",
    "phrygian #6",
    "melodic minor second mode",
  ],
  [
    "1P 2m 3m 4d 5d 6m 7d",
    "ultralocrian",
    "superlocrian bb7",
    "superlocrian diminished",
  ],
  ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
  ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
  // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
  [
    "1P 2M 3m 4A 5P 6M 7m",
    "dorian #4",
    "ukrainian dorian",
    "romanian minor",
    "altered dorian",
  ],
  ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished", "lydian b3"],
  ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone", "lydian augmented #6"],
  ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
  [
    "1P 2m 3M 4P 5P 6m 7m",
    "phrygian dominant",
    "spanish",
    "phrygian major",
    "freygish",
    "spanish gypsy",
  ],
  // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
  ["1P 2m 3m 4P 5P 6m 7M", "neapolitan minor", "balinese"],
  // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
  ["1P 2m 3m 4P 5P 6M 7M", "neapolitan major"],
  ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
  [
    "1P 2m 3M 4P 5P 6m 7M",
    "double harmonic major",
    "gypsy",
    "byzantine",
    "gypsy major",
  ],
  ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
  ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
  ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
  ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
  ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
  ["1P 2m 3M 4P 5d 6m 7M", "persian"],
  ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
  [
    "1P 2M 3M 4P 5A 6M 7M",
    "major augmented",
    "major #5",
    "ionian augmented",
    "ionian #5",
  ],
  ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],

  // Modes of harmonic major (2, 3, 5, 6 and 7; 4 is lydian diminished)
  // Source: https://en.wikipedia.org/wiki/Harmonic_major_scale
  ["1P 2M 3m 4P 5d 6M 7m", "dorian b5"],
  ["1P 2m 3m 4d 5P 6m 7m", "phrygian b4"],
  ["1P 2m 3M 4P 5P 6M 7m", "mixolydian b2", "mixolydian b9"],
  ["1P 2A 3M 4A 5A 6M 7M", "lydian augmented #2", "lydian #2 #5"],
  ["1P 2m 3m 4P 5d 6m 7d", "locrian bb7"],

  // Modes of neapolitan major (3, 6 and 7; 2 is leading whole tone, 4 lydian
  // minor and 5 locrian major)
  // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
  [
    "1P 2M 3M 4A 5A 6M 7m",
    "lydian augmented dominant",
    "lydian #5 b7",
    "mixolydian #4 #5",
  ],
  [
    "1P 2M 3m 4d 5d 6m 7m",
    "locrian #2 b4",
    "half-diminished b4",
    "semilocrian b4",
  ],
  ["1P 2m 3d 4d 5d 6m 7m", "altered bb3", "superlocrian bb3"],

  // Modes of neapolitan minor (2 to 7)
  // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
  // Mode 4 is also called "hungarian gypsy", "gypsy" or "romani minor", but
  // those names also name hungarian minor and double harmonic major.
  ["1P 2M 3M 4A 5P 6A 7M", "lydian #6"],
  ["1P 2M 3M 4P 5A 6M 7m", "mixolydian augmented", "mixolydian #5"],
  ["1P 2M 3m 4A 5P 6m 7m", "aeolian #4"],
  ["1P 2m 3M 4P 5d 6m 7m", "locrian dominant", "locrian natural 3"],
  ["1P 2A 3M 4P 5P 6M 7M", "ionian #2", "major #2"],
  ["1P 2m 3d 4d 5d 6m 7d", "ultralocrian bb3", "superlocrian bb3 bb7"],

  // Modes of double harmonic major (2, 3, 6 and 7; 4 is hungarian minor and 5
  // oriental)
  // Source: https://en.wikipedia.org/wiki/Double_harmonic_scale
  ["1P 2A 3M 4A 5P 6A 7M", "lydian #2 #6"],
  ["1P 2m 3m 4d 5P 6m 7d", "ultraphrygian", "phrygian b4 bb7"],
  ["1P 2A 3M 4P 5A 6M 7M", "ionian augmented #2", "ionian #2 #5"],
  ["1P 2m 3d 4P 5d 6m 7d", "locrian bb3 bb7"],

  // 8-note scales
  ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
  ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
  ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
  ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
  ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
  ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
  ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
  ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
  ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
  [
    "1P 2m 3m 3M 4A 5P 6M 7m",
    "half-whole diminished",
    "dominant diminished",
    "messiaen's mode #2",
  ],
  ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
  ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],

  // 9-note scales
  ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
  ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],

  // 10-note scales
  ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],

  // 12-note scales
  ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"],
];

// FAMILIES
// A family is a parent scale and its modes (its rotations). Every scale type
// whose notes are a rotation of a parent gets the parent's name as `family`,
// and the parent's note it starts on as `degree`.
// Format: ["intervals", "family name"]
export const FAMILIES: string[][] = [
  ["1P 2M 3M 4P 5P 6M 7M", "major"],
  ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
  ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
  ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
  ["1P 2m 3m 4P 5P 6M 7M", "neapolitan major"],
  ["1P 2m 3m 4P 5P 6m 7M", "neapolitan minor"],
  ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major"],
  ["1P 2M 3M 5P 6M", "major pentatonic"],
];

export default SCALES;
