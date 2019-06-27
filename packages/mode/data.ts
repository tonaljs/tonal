// [name, pcset, fifths, triad, seventh, alias?]
type ModeDefinition = [string, number, number, string, string, string?];

const DATA: ModeDefinition[] = [
  ["ionian", 2773, 0, "", "Maj7", "major"],
  ["dorian", 2902, 2, "m", "m7"],
  ["phrygian", 3418, 4, "m", "m7"],
  ["lydian", 2741, -1, "", "Maj7"],
  ["mixolydian", 2774, 1, "", "7"],
  ["aeolian", 2906, 3, "m", "m7", "minor"],
  ["locrian", 3434, 5, "dim", "m7b5"]
];

export default DATA;
