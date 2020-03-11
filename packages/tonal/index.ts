import AbcNotation from "@tonaljs/abc-notation";
import * as Array from "@tonaljs/array";
import * as Chord from "@tonaljs/chord";
import * as ChordDictionary from "@tonaljs/chord-dictionary";
import Collection from "@tonaljs/collection";
import * as Core from "@tonaljs/core";
import Interval from "@tonaljs/interval";
import Key from "@tonaljs/key";
import Midi from "@tonaljs/midi";
import Mode from "@tonaljs/mode";
import Note from "@tonaljs/note";
import PcSet from "@tonaljs/pcset";
import Pcset from "@tonaljs/pcset";
import * as Progression from "@tonaljs/progression";
import * as Range from "@tonaljs/range";
import * as RomanNumeral from "@tonaljs/roman-numeral";
import * as Scale from "@tonaljs/scale";
import * as ScaleDictionary from "@tonaljs/scale-dictionary";

export * from "@tonaljs/core";

// backwards compatibility
import * as Tonal from "@tonaljs/core";

export {
  AbcNotation,
  Array,
  Chord,
  ChordDictionary,
  Collection,
  Core,
  Note,
  Interval,
  Key,
  Midi,
  Mode,
  Pcset,
  Progression,
  Range,
  RomanNumeral,
  Scale,
  ScaleDictionary,
  // backwards
  Tonal,
  PcSet
};
