import AbcNotation from "@tonaljs/abc-notation";
import * as Array from "@tonaljs/array";
import Chord from "@tonaljs/chord";
import ChordType from "@tonaljs/chord-type";
import Collection from "@tonaljs/collection";
import * as Core from "@tonaljs/core";
import DurationValue from "@tonaljs/duration-value";
import Interval from "@tonaljs/interval";
import Key from "@tonaljs/key";
import Midi from "@tonaljs/midi";
import Mode from "@tonaljs/mode";
import Note from "@tonaljs/note";
import Pcset from "@tonaljs/pcset";
import Progression from "@tonaljs/progression";
import Range from "@tonaljs/range";
import RomanNumeral from "@tonaljs/roman-numeral";
import Scale from "@tonaljs/scale";
import ScaleType from "@tonaljs/scale-type";
import TimeSignature from "@tonaljs/time-signature";

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
  DurationValue,
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
  TimeSignature,
  // backwards API compatibility (3.0)
  Tonal,
  PcSet,
  ChordDictionary,
  ScaleDictionary
};
