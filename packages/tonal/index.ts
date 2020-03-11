import * as AbcNotation from "@tonaljs/abc-notation";
import * as Array from "@tonaljs/array";
import * as Chord from "@tonaljs/chord";
import * as ChordDictionary from "@tonaljs/chord-dictionary";
import * as Core from "@tonaljs/core";
import * as Interval from "@tonaljs/interval";
import * as Key from "@tonaljs/key";
import * as Midi from "@tonaljs/midi";
import * as Mode from "@tonaljs/mode";
import * as Note from "@tonaljs/note";
import * as PcSet from "@tonaljs/pcset";
import * as Progression from "@tonaljs/progression";
import * as Range from "@tonaljs/range";
import * as RomanNumeral from "@tonaljs/roman-numeral";
import * as Scale from "@tonaljs/scale";
import * as ScaleDictionary from "@tonaljs/scale-dictionary";

export * from "@tonaljs/core";

// backwards compatibility
const Tonal = Core;

export {
  AbcNotation,
  Array,
  Chord,
  ChordDictionary,
  Note,
  Interval,
  Key,
  Midi,
  Mode,
  PcSet,
  Progression,
  Range,
  RomanNumeral,
  Scale,
  ScaleDictionary,
  Core,
  Tonal
};
