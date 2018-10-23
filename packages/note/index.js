var NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");
export var names = function(accTypes) {
  return typeof accTypes !== "string"
    ? NAMES.slice()
    : NAMES.filter(function(n) {
        var acc = n[1] || " ";
        return accTypes.indexOf(acc) !== -1;
      });
};
var SHARPS = names(" #");
var FLATS = names(" b");
var REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
export function tokenize(str) {
  if (typeof str !== "string") str = "";
  var m = REGEX.exec(str);
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
var NO_NOTE = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  octStr: null,
  chroma: null,
  midi: null,
  freq: null
});
var SEMI = [0, 2, 4, 5, 7, 9, 11];
var properties = function(str) {
  var tokens = tokenize(str);
  if (tokens[0] === "" || tokens[3] !== "") return NO_NOTE;
  var letter = tokens[0],
    acc = tokens[1],
    octStr = tokens[2];
  var p = {
    letter: letter,
    acc: acc,
    octStr: octStr,
    pc: letter + acc,
    name: letter + acc + octStr,
    step: (letter.charCodeAt(0) + 3) % 7,
    alt: acc[0] === "b" ? -acc.length : acc.length,
    oct: octStr.length ? +octStr : null,
    chroma: 0,
    midi: null,
    freq: null
  };
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  p.freq = midiToFreq(p.midi);
  return Object.freeze(p);
};
var memo = function(fn, cache) {
  if (cache === void 0) {
    cache = {};
  }
  return function(str) {
    return cache[str] || (cache[str] = fn(str));
  };
};
export var props = memo(properties);
export var name = function(str) {
  return props(str).name;
};
export var pc = function(str) {
  return props(str).pc;
};
var isMidiRange = function(m) {
  return m >= 0 && m <= 127;
};
export var midi = function(note) {
  if (typeof note !== "number" && typeof note !== "string") {
    return null;
  }
  var midi = props(note).midi;
  var value = midi || midi === 0 ? midi : +note;
  return isMidiRange(value) ? value : null;
};
export var midiToFreq = function(midi, tuning) {
  if (tuning === void 0) {
    tuning = 440;
  }
  return typeof midi === "number"
    ? Math.pow(2, (midi - 69) / 12) * tuning
    : null;
};
export var freq = function(note) {
  return props(note).freq || midiToFreq(note);
};
var L2 = Math.log(2);
var L440 = Math.log(440);
export var freqToMidi = function(freq) {
  var v = (12 * (Math.log(freq) - L440)) / L2 + 69;
  return Math.round(v * 100) / 100;
};
export var chroma = function(str) {
  return props(str).chroma;
};
export var oct = function(str) {
  return props(str).oct;
};
var LETTERS = "CDEFGAB";
export var stepToLetter = function(step) {
  return LETTERS[step];
};
var fillStr = function(s, n) {
  return Array(n + 1).join(s);
};
var numToStr = function(num, op) {
  return typeof num !== "number" ? "" : op(num);
};
export var altToAcc = function(alt) {
  return numToStr(alt, function(alt) {
    return alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
  });
};
export var from = function(fromProps, baseNote) {
  if (fromProps === void 0) {
    fromProps = {};
  }
  if (baseNote === void 0) {
    baseNote = null;
  }
  var _a = baseNote ? Object.assign({}, props(baseNote), fromProps) : fromProps,
    step = _a.step,
    alt = _a.alt,
    oct = _a.oct;
  if (typeof step !== "number") return null;
  var letter = stepToLetter(step);
  if (!letter) return null;
  var pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
};
export var build = from;
export function fromMidi(num, sharps) {
  if (sharps === void 0) {
    sharps = false;
  }
  num = Math.round(num);
  var pcs = sharps === true ? SHARPS : FLATS;
  var pc = pcs[num % 12];
  var o = Math.floor(num / 12) - 1;
  return pc + o;
}
export var simplify = function(note, sameAcc) {
  if (sameAcc === void 0) {
    sameAcc = true;
  }
  var _a = props(note),
    alt = _a.alt,
    chroma = _a.chroma,
    midi = _a.midi;
  if (chroma === null) return null;
  var alteration = alt;
  var useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
  return midi === null
    ? pc(fromMidi(chroma, useSharps))
    : fromMidi(midi, useSharps);
};
export var enharmonic = function(note) {
  return simplify(note, false);
};
