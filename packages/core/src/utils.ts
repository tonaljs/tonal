/**
 * Fill a string with a repeated character
 *
 * @param character
 * @param repetition
 */
export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

export function deprecate<
  ResultFn extends (this: any, ...newArgs: any[]) => ReturnType<ResultFn>
>(original: string, alternative: string, fn: ResultFn) {
  return function(this: unknown, ...args: unknown[]): ReturnType<ResultFn> {
    // tslint:disable-next-line
    console.warn(`${original} is deprecated. Use ${alternative}.`);
    return fn.apply(this, args);
  };
}
