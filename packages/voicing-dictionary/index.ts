import Chord from "@tonaljs/chord";
import { lefthand, all, triads } from "./data";

export declare type VoicingDictionary = { [symbol: string]: string[] };

const defaultDictionary: VoicingDictionary = lefthand;

function lookup(
  symbol: string,
  dictionary = defaultDictionary
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

export default {
  lookup,
  lefthand,
  triads,
  all,
  defaultDictionary,
};
