// SCALES
// Format: ["intervals", "name", "alias1", "alias2", ...]
const SCALES: string[][] = [
  // 8-note diminished scale
  ["1P 2M 3m 4P 5d 6m 6M 7M", "whole-half diminished", "diminished"],
  ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"],

  // 7-note natural scale
  ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian", "natural first mode"],
  ["1P 2M 3m 4P 5P 6M 7m", "dorian", "natural second mode"],
  ["1P 2m 3m 4P 5P 6m 7m", "phrygian", "natural third mode"],
  ["1P 2M 3M 4A 5P 6M 7M", "lydian", "natural fourth mode"],
  ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant", "natural fifth mode"],
  ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian", "natural sixth mode"],
  ["1P 2m 3m 4P 5d 6m 7m", "locrian", "natural seventh mode"],

  // 7-note melodic scale
  ["1P 2M 3m 4P 5P 6M 7M", "melodic minor", "ionian b3", "major b3", "jazz minor", "melodic minor first mode"],
  ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian ♮6", "phrygian natural 6", "melodic minor second mode"],
  ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented", "lydian #5", "melodic minor third mode"],
  ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone", "melodic minor fourth mode"],
  ["1P 2M 3M 4P 5P 6m 7m", "melodic major", "minor dominant", "aeolian dominant", "mixolydian b6", "hindu", "melodic minor fifth mode"],
  ["1P 2M 3m 4P 5d 6m 7m", "locrian ♮2", "locrian natural 2", "aeolian b5", "minor b5", "half diminished", "melodic minor sixth mode"],
  ["1P 2m 3m 4d 5d 6m 7m", "altered", "locrian b4", "super locrian", "diminished whole tone", "pomeroy", "melodic minor seventh mode"],

  // 7-note harmonic minor scale
  ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor", "aeolian ♮7", "aeolian natural 7", "minor ♮7", "minor natural 7", "harmonic minor first mode"],
  ["1P 2m 3m 4P 5d 6M 7m", "locrian ♮6", "locrian natural 6", "harmonic minor second mode"],
  ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5", "harmonic minor third mode"],
  ["1P 2M 3m 4A 5P 6M 7m", "romanian minor", "dorian #4", "harmonic minor fourth mode"],
  ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "phrygian ♮3", "phrygian natural 3", "spanish", "phrygian major", "harmonic minor fifth mode"],
  ["1P 2A 3M 4A 5P 6M 7M", "lydian #2", "lydian #9", "harmonic minor sixth mode"],
  ["1P 2m 3m 4d 5d 6m 7d", "altered diminished", "ultralocrian", "superlocrian bb7", "locrian b4 bb7", "super locrian diminished", "harmonic minor seventh mode"],

  // 7-note harmonic major scale
  ["1P 2M 3M 4P 5P 6m 7M", "harmonic major", "ionian b6", "harmonic major first mode"],
  ["1P 2M 3m 4P 5d 6M 7m", "dorian b5", "locrian ♮2 ♮6", "locrian natural 2 natural 6", "harmonic major second mode"],
  ["1P 2m 3m 4d 5P 6m 7m", "altered ♮5", "altered natural 5", "altered dominant ♮5", "altered dominant natural 5", "phrygian b4", "harmonic major third mode"],
  ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished", "lydian b3", "melodic minor #4", "harmonic major fourth mode"],
  ["1P 2m 3M 4P 5P 6M 7m", "mixolydian b2", "harmonic major fifth mode"],
  ["1P 2A 3M 4A 5A 6M 7M", "lydian augmented #2", "lydian #2 #5", "harmonic major sixth mode"],
  ["1P 2m 3m 4P 5d 6m 7d", "locrian bb7", "harmonic major seventh mode"],

  // 7-note double harmonic scale
  ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy", "double harmonic first mode"],
  ["1P 2A 3M 4A 5P 6A 7M", "lydian #2 #6", "double harmonic second mode"],
  ["1P 2m 3m 4d 5P 6m 7d", "ultraphrygian", "double harmonic third mode"],
  ["1P 2M 3m 4A 5P 6m 7M", "double harmonic minor", "hungarian minor", "gypsy minor", "double harmonic fourth mode"],
  ["1P 2m 3M 4P 5d 6M 7m", "oriental", "double harmonic fifth mode"],
  ["1P 2A 3M 4P 5A 6M 7M", "ionian #2 #5", "double harmonic sixth mode"],
  ["1P 2m 3d 4P 5d 6m 7d", "locrian bb3 bb7", "double harmonic seventh mode"],

  // 7-note persian scale
  ["1P 2m 3M 4P 5d 6m 7M", "persian", "persian first mode"],
  ["1P 2A 3M 4P 5P 6A 7M", "ionian #2 #6", "persian second mode"],
  ["1P 2m 3d 4d 5P 6m 7d", "ultraphrygian bb3", "persian third mode"],
  ["1P 2m 3m 4A 5P 6m 7M", "todi raga", "tōḍi thaat", "todi thaat", "persian fourth mode"],
  ["1P 2M 3A 4A 5P 6A 7M", "lydian #3 #6", "persian fifth mode"],
  ["1P 2A 3M 4P 5A 6M 7m", "mixolydian augmented #2", "persian sixth mode"],
  ["1P 2m 3d 4P 5d 6d 7d", "chromatic hypophrygian inverse", "persian seventh mode"],

  // 7-note neapolitan minor scale
  ["1P 2m 3m 4P 5P 6m 7M", "neapolitan minor", "neopolitan minor", "balinese", "neapolitan minor first mode"],
  ["1P 2M 3M 4A 5P 6A 7M", "lydian #6", "neapolitan minor second mode"],
  ["1P 2M 3M 4P 5A 6M 7m", "mixolydian augmented", "neapolitan minor third mode"],
  ["1P 2M 3m 4A 5P 6m 7m", "romani minor", "aeolian #4", "neapolitan minor fourth mode"],
  ["1P 2m 3M 4P 5d 6m 7m", "locrian dominant", "neapolitan minor fifth mode"],
  ["1P 2A 3M 4P 5P 6M 7M", "ionian #2", "neapolitan minor sixth mode"],
  ["1P 2m 3d 4d 5d 6m 7d", "ultralocrian bb3", "neapolitan minor seventh mode"],

  // 7-note neapolitan major scale
  ["1P 2m 3m 4P 5P 6M 7M", "neapolitan major", "neopolitan major", "neapolitan major first mode"],
  ["1P 2M 3M 4A 5A 6A 7M", "leading whole tone", "lydian augmented #6", "neapolitan major second mode"],
  ["1P 2M 3M 4A 5A 6M 7m", "lydian augmented dominant", "neapolitan major third mode"],
  ["1P 2M 3M 4A 5P 6m 7m", "lydian dominant b6", "lydian minor", "neapolitan major fourth mode"],
  ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "major locrian", "arabic", "arabian", "neapolitan major fifth mode"],
  ["1P 2M 3m 4d 5d 6m 7m", "altered dominant #2", "half diminished b4", "neapolitan major sixth mode"],
  ["1P 2m 3d 4d 5d 6m 7m", "altered dominant bb3", "neapolitan major seventh mode"],

  // 7-note scales (other)
  ["1P 2m 3m 4d 5d 6d 7m", "flamenco", "major-phrygian"],
  ["1P 2m 3M 4A 5A 6A 7M", "enigmatic", "scala enigmatica"],

  // 6-note whole tone scale
  ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],

  // 6-note mode-based hexatonic scale
  ["1P 2M 3M 4P 5P 6M", "hexatonic major", "arezzo major", "hexatonic ionian", "natural hexatonic first mode"],
  ["1P 2M 3m 4P 5P 7m", "hexatonic minor", "hexatonic aeolian", "natural hexatonic second mode"],
  ["1P 2m 3m 4P 6m 7m", "ritsu", "natural hexatonic natural third mode"],
  ["1P 2M 3M 5P 6M 7M", "hexatonic lydian", "natural hexatonic natural fourth mode"],
  ["1P 2M 4P 5P 6M 7m", "hexatonic mixolydian", "piongio", "natural hexatonic dominant", "natural hexatonic fifth mode"],
  ["1P 3m 4P 5P 6m 7m", "hexatonic phrygian", "natural hexatonic sixth mode"],

  // 6-note augmented scale
  ["1P 2A 3M 5P 6m 7M", "augmented", "minor-third half-step"],
  ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],

  // 6-note prometheus scale
  ["1P 2M 3M 4A 6M 7m", "prometheus"],

  // 6-note tritone scale
  ["1P 2m 3M 4A 5P 7m", "tritone", "petrushka chord"],

  // 6-note blues scale
  ["1P 2M 3m 3M 5P 6M", "major blues"],
  ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],

  // 5-note pentatonic scale
  ["1P 2M 3M 5P 6M", "pentatonic major", "major pentatonic", "pentatonic", "pentatonic first mode"],
  ["1P 2M 4P 5P 7m", "egyptian", "suspended", "pentatonic second mode"],
  ["1P 3m 4P 6m 7m", "man gong", "malkos raga", "慢宮調", "pentatonic third mode"],
  ["1P 2M 4P 5P 6M", "ritsusen", "yo", "律旋", "pentatonic fourth mode"],
  ["1P 3m 4P 5P 7m", "pentatonic minor", "minor pentatonic", "vietnamese 2", "pentatonic fifth mode"],

  // 5-note hirajoshi scale
  ["1P 2M 3m 5P 6m", "hirajōshi", "hirajoshi", "hirajoshi first mode"],
  ["1P 2m 4P 5d 7m", "iwato", "hirajoshi second mode"],
  ["1P 3M 4P 6M 7M", "bhinna shadja", "hirajoshi third mode"],
  ["1P 2m 4P 5P 6m", "kumoijoshi", "sakura pentatonic", "hirajoshi fourth mode"],
  ["1P 3M 4A 5P 7M", "malashri", "lydian pentatonic", "chinese", "hirajoshi fifth mode"],

  // 5-note kumoi scale
  ["1P 2M 3m 5P 6M", "kumoi", "pentatonic b3", "kumoi first mode"],
  ["1P 2m 4P 5P 7m", "in-sen", "kokin-joshi", "kumoi second mode"],
  ["1P 3M 4A 6M 7M", "hindol raga", "kumoi third mode"],
  ["1P 2M 4P 5P 6m", "bhinna pancama raga", "kumoi fourth mode"],
  ["1P 3m 4P 5d 7m", "jayakauns raga", "locrian pentatonic", "minor seven flat five pentatonic", "kumoi fifth mode"],

  // Untriaged

  // 5-note scales
  ["1P 3M 4P 5P 7M", "ionian pentatonic"],
  ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
  ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
  ["1P 3m 4P 5P 6m", "vietnamese 1"],
  ["1P 2m 3m 5P 6m", "pelog"],
  ["1P 3m 4P 5P 6M", "minor six pentatonic"],
  ["1P 2M 3M 5P 6m", "flat six pentatonic"],
  ["1P 2m 3M 5P 6M", "scriabin"],
  ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
  ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
  ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
  ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
  ["1P 3m 4d 5d 7m", "super locrian pentatonic"],

  // 6-note scales
  ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
  ["1P 2m 3M 5d 6m 7m", "mystery #1"],
  ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],

  // 7-note scales
  ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
  ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
  ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],

  // 8-note scales
  ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
  ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
  ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
  ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
  ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
  ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
  ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
  ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
  ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
  ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
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

export default SCALES;
