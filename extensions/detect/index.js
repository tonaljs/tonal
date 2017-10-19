import { name, pc } from "tonal-note";
import * as Dictionary from "tonal-dictionary";
import { sort, compact } from "tonal-array";
import { modes } from "tonal-pcset";

export function detector(dictionary, defaultBuilder) {
  defaultBuilder = defaultBuilder || ((tonic, names) => [tonic, names]);
  return function(notes, builder) {
    builder = builder || defaultBuilder;
    notes = sort(notes.map(pc));
    return modes(notes)
      .map((mode, i) => {
        const tonic = name(notes[i]);
        const names = dictionary.names(mode);
        return names.length ? builder(tonic, names) : null;
      })
      .filter(x => x);
  };
}

export const chord = detector(
  Dictionary.chord,
  (tonic, names) => tonic + names[0]
);

export const scale = detector(
  Dictionary.scale,
  (tonic, names) => tonic + " " + names[0]
);

export const pcset = detector(Dictionary.pcset);
