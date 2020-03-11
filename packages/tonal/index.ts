import AbcNotation from "@tonaljs/abc-notation";
import * as Array from "@tonaljs/array";
import * as Chord from "@tonaljs/chord";
import ChordType from "@tonaljs/chord-type";
import Collection from "@tonaljs/collection";
import * as Core from "@tonaljs/core";
import Interval from "@tonaljs/interval";
import Key from "@tonaljs/key";
import Midi from "@tonaljs/midi";
import Mode from "@tonaljs/mode";
import Note from "@tonaljs/note";
import Pcset from "@tonaljs/pcset";
import Progression from "@tonaljs/progression";
import * as Range from "@tonaljs/range";
import RomanNumeral from "@tonaljs/roman-numeral";
import * as Scale from "@tonaljs/scale";
import ScaleType from "@tonaljs/scale-type";

export * from "@tonaljs/core";

// deprecated (backwards compatibility)
const Tonal = Core;
const PcSet = Pcset;
const ChordDictionary = ChordType;
const ScaleDictionary = ScaleType;

export {
  AbcNotation,
  Array,
  Chord,
  ChordType,
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
  ScaleType,
  // backwards
  Tonal,
  PcSet,
  ChordDictionary,
  ScaleDictionary
};
