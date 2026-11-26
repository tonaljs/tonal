import { describe, expectTypeOf, test } from "vitest";
import {
  KnownNoteName,
  KnownNoteWithOctave,
  KnownPcName,
  note,
  Note,
  NoteLiteral,
  NoteName,
  NoteWithOctave,
  PcName,
} from "./index";

describe("note name types", () => {
  test("any string is still a note name", () => {
    expectTypeOf<string>().toExtend<NoteName>();
    expectTypeOf<string>().toExtend<NoteWithOctave>();
    expectTypeOf<string>().toExtend<PcName>();
    expectTypeOf<string>().toExtend<NoteLiteral>();
    expectTypeOf(note).toBeCallableWith("c#4" as string);
    expectTypeOf(note).toBeCallableWith("Cx4");
  });

  test("note names are still strings", () => {
    expectTypeOf<NoteName>().toExtend<string>();
    expectTypeOf<Note["name"]>().toExtend<string>();
    expectTypeOf<Note["pc"]>().toExtend<string>();
  });

  test("the known names don't collapse into string", () => {
    // `| string` would drop the known names from editor suggestions
    expectTypeOf<NoteName>().not.toEqualTypeOf<string>();
    expectTypeOf<PcName>().not.toEqualTypeOf<string>();
  });

  test("the common names are known", () => {
    expectTypeOf<"C">().toExtend<KnownPcName>();
    expectTypeOf<"F#">().toExtend<KnownPcName>();
    expectTypeOf<"Ebb">().toExtend<KnownNoteName>();
    expectTypeOf<"Bb0">().toExtend<KnownNoteWithOctave>();
    expectTypeOf<"C##8">().toExtend<KnownNoteWithOctave>();
    expectTypeOf<"A4">().toExtend<KnownNoteName>();
  });

  test("other strings aren't known names", () => {
    expectTypeOf<"H">().not.toExtend<KnownNoteName>();
    expectTypeOf<"c4">().not.toExtend<KnownNoteName>();
    expectTypeOf<"C9">().not.toExtend<KnownNoteName>();
    expectTypeOf<"C#">().not.toExtend<KnownNoteWithOctave>();
    expectTypeOf<"">().not.toExtend<KnownNoteName>();
  });
});
