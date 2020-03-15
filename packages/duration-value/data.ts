// source: https://en.wikipedia.org/wiki/Note_value
const DATA: Array<[number, string, string[]]> = [
  [
    0.125,
    "dl",
    ["large", "duplex longa", "maxima", "octuple", "octuple whole"]
  ],
  [0.25, "l", ["long", "longa"]],
  [0.5, "d", ["double whole", "double", "breve"]],
  [1, "w", ["whole", "semibreve"]],
  [2, "h", ["half", "minim"]],
  [4, "q", ["quarter", "crotchet"]],
  [8, "e", ["eighth", "quaver"]],
  [16, "s", ["sixteenth", "semiquaver"]],
  [32, "t", ["thirty-second", "demisemiquaver"]],
  [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
  [128, "h", ["hundred twenty-eighth"]],
  [256, "th", ["two hundred fifty-sixth"]]
];

export default DATA;
