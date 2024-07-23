import AbcNotation from "@tonaljs/abc-notation";
import * as Array from "@tonaljs/array";
import Chord from "@tonaljs/chord";
import ChordType from "@tonaljs/chord-type";
import Collection from "@tonaljs/collection";
import * as Core from "@tonaljs/core";
import DurationValue from "@tonaljs/duration-value";
import Interval from "@tonaljs/interval";
import * as Key from "@tonaljs/key";
import * as Midi from "@tonaljs/midi";
import Mode from "@tonaljs/mode";
import * as Note from "@tonaljs/note";
import Pcset from "@tonaljs/pcset";
import Progression from "@tonaljs/progression";
import Range from "@tonaljs/range";
import * as RhythmPattern from "@tonaljs/rhythm-pattern";
import RomanNumeral from "@tonaljs/roman-numeral";
import Scale from "@tonaljs/scale";
import ScaleType from "@tonaljs/scale-type";
import TimeSignature from "@tonaljs/time-signature";
import VoiceLeading from "@tonaljs/voice-leading";
import Voicing from "@tonaljs/voicing";
import VoicingDictionary from "@tonaljs/voicing-dictionary";

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
  ChordDictionary,
  ChordType,
  Collection,
  Core,
  DurationValue,
  Interval,
  Key,
  Midi,
  Mode,
  Note,
  PcSet,
  Pcset,
  Progression,
  Range,
  RhythmPattern,
  RomanNumeral,
  Scale,
  ScaleDictionary,
  ScaleType,
  TimeSignature,
  Tonal,
  VoiceLeading,
  Voicing,
  VoicingDictionary,
};
