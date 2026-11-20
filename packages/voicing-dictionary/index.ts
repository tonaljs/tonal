import Chord from "@tonaljs/chord";
import { all, lefthand, triads, VoicingDictionary } from "./data";
export { all, lefthand, triads } from "./data";

/** The dictionary used by default in `lookup`: the same as `lefthand`. */
export const defaultDictionary: VoicingDictionary = lefthand;

/**
 * Get the voicings of a chord type in a dictionary, each one a string of
 * intervals like "3M 5P 7M 9M". The symbol can be any alias of a chord type
 * in the dictionary. Returns undefined if it's not found.
 *
 * @param symbol - chord type, like "maj7" (without tonic)
 * @param dictionary - default VoicingDictionary.lefthand
 * @example
 * VoicingDictionary.lookup("maj7"); // => ["3M 5P 7M 9M", "7M 9M 10M 12P"]
 * VoicingDictionary.lookup("M7"); // => ["3M 5P 7M 9M", "7M 9M 10M 12P"]
 * VoicingDictionary.lookup("zz"); // => undefined
 */
export function lookup(
  symbol: string,
  dictionary = defaultDictionary,
): string[] | undefined {
  if (dictionary[symbol]) {
    return dictionary[symbol];
  }
  const { aliases } = Chord.get("C" + symbol);
  // TODO: find other way to get aliases of symbol
  const match =
    Object.keys(dictionary).find((_symbol) => aliases.includes(_symbol)) || "";
  if (match !== undefined) {
    return dictionary[match];
  }
  return undefined;
}

/** @deprecated Use the named exports instead. */
export default {
  lookup,
  lefthand,
  triads,
  all,
  defaultDictionary,
};
