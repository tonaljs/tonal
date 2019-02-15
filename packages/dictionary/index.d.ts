export declare const dictionary: (raw: any) => (name: string) => any;
export declare const combine: (a: any, b: any) => (name: string) => any;
/**
 * A dictionary of scales: a function that given a scale name (without tonic)
 * returns an array of intervals
 *
 * @function
 * @param {string} name
 * @return {Array} intervals
 * @example
 * import { scale } from "tonal-dictionary"
 * scale("major") // => ["1P", "2M", ...]
 * scale.names(); // => ["major", ...]
 */
export declare const scale: (name: string) => string[];
/**
 * A dictionary of chords: a function that given a chord type
 * returns an array of intervals
 *
 * @function
 * @param {string} type
 * @return {Array} intervals
 * @example
 * import { chord } from "tonal-dictionary"
 * chord("Maj7") // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 */
export declare const chord: (name: string) => string[];
export declare const pcset: (name: string) => string[];
