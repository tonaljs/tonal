import { isNamedPitch } from "@tonaljs/pitch";

export * from "@tonaljs/pitch";
export * from "@tonaljs/pitch-distance";
export * from "@tonaljs/pitch-interval";
export * from "@tonaljs/pitch-note";

export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

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

export const isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);
