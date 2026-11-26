import { describe, expectTypeOf, test } from "vitest";
import {
  interval,
  Interval,
  IntervalLiteral,
  IntervalName,
  KnownIntervalName,
  tokenizeInterval,
} from "./index";

describe("interval name types", () => {
  test("any string is still an interval name", () => {
    expectTypeOf<string>().toExtend<IntervalName>();
    expectTypeOf<string>().toExtend<IntervalLiteral>();
    expectTypeOf(interval).toBeCallableWith("+3M" as string);
    expectTypeOf(interval).toBeCallableWith("dd5");
    expectTypeOf(tokenizeInterval).toBeCallableWith("16M");
  });

  test("interval names are still strings", () => {
    expectTypeOf<IntervalName>().toExtend<string>();
    expectTypeOf<Interval["name"]>().toExtend<string>();
  });

  test("the known names don't collapse into string", () => {
    // `| string` would drop the known names from editor suggestions
    expectTypeOf<IntervalName>().not.toEqualTypeOf<string>();
  });

  test("the common names are known, up and down", () => {
    expectTypeOf<"1P">().toExtend<KnownIntervalName>();
    expectTypeOf<"3M">().toExtend<KnownIntervalName>();
    expectTypeOf<"-5P">().toExtend<KnownIntervalName>();
    expectTypeOf<"15A">().toExtend<KnownIntervalName>();
    expectTypeOf<"-14d">().toExtend<KnownIntervalName>();
  });

  test("other strings aren't known names", () => {
    expectTypeOf<"3P">().not.toExtend<KnownIntervalName>();
    expectTypeOf<"5m">().not.toExtend<KnownIntervalName>();
    // quality first is accepted, but not suggested: tonal writes number first
    expectTypeOf<"M3">().not.toExtend<KnownIntervalName>();
    expectTypeOf<"P-5">().not.toExtend<KnownIntervalName>();
    expectTypeOf<"M3">().toExtend<IntervalName>();
    expectTypeOf<"16M">().not.toExtend<KnownIntervalName>();
    expectTypeOf<"">().not.toExtend<KnownIntervalName>();
  });
});
