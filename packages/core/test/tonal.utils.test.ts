import { describe, expect, test } from "vitest";
import { fillStr } from "../index";

describe("@tonaljs/core", () => {
  test("fillStr", () => {
    expect(fillStr("#", 5)).toEqual("#####");
  });
});
