import AbcNotation from "@tonaljs/abc-notation";
import * as Array from "@tonaljs/array";
import Chord from "@tonaljs/chord";
import * as ChordType from "@tonaljs/chord-type";
import Collection from "@tonaljs/collection";
import DurationValue from "@tonaljs/duration-value";
import Interval from "@tonaljs/interval";
import * as Key from "@tonaljs/key";
import * as Midi from "@tonaljs/midi";
import * as Mode from "@tonaljs/mode";
import * as Note from "@tonaljs/note";
import * as Pcset from "@tonaljs/pcset";
import * as Progression from "@tonaljs/progression";
import Range from "@tonaljs/range";
import * as RhythmPattern from "@tonaljs/rhythm-pattern";
import * as RomanNumeral from "@tonaljs/roman-numeral";
import * as Scale from "@tonaljs/scale";
import * as ScaleType from "@tonaljs/scale-type";
import TimeSignature from "@tonaljs/time-signature";
import VoiceLeading from "@tonaljs/voice-leading";
import Voicing from "@tonaljs/voicing";
import VoicingDictionary from "@tonaljs/voicing-dictionary";

export * from "@tonaljs/core";

// deprecated (backwards compatibility)
import * as Core from "@tonaljs/core";
/** @deprecated */
const Tonal = Core;
/** @deprecated */
const PcSet = Pcset;
/** @deprecated */
const ChordDictionary = ChordType;
/** @deprecated */
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
