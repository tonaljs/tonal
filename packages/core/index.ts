import { isNamedPitch } from "@tonaljs/pitch";

export * from "@tonaljs/pitch";
export * from "@tonaljs/pitch-distance";
export * from "@tonaljs/pitch-interval";
export * from "@tonaljs/pitch-note";

/**
 * Repeat a string the absolute value of `n` times.
 *
 * @example
 * fillStr("#", 3) // => "###"
 */
export const fillStr = (s: string, n: number) =>
  typeof s === "string" && Number.isInteger(n)
    ? Array(Math.abs(n) + 1).join(s)
    : "";

/**
 * Wrap a function so it logs a deprecation warning (naming the alternative)
 * each time it is called, and then behaves as the original.
 */
export function deprecate<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResultFn extends (this: any, ...newArgs: any[]) => ReturnType<ResultFn>,
>(original: string, alternative: string, fn: ResultFn) {
  return function (this: unknown, ...args: unknown[]): ReturnType<ResultFn> {
    // tslint:disable-next-line
    console.warn(`${original} is deprecated. Use ${alternative}.`);
    return fn.apply(this, args);
  };
}

/** @deprecated Use isNamedPitch instead. */
export const isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);
