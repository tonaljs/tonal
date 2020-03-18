import {
  compact,
  permutations,
  range,
  rotate,
  shuffle,
  sortedNoteNames,
  sortedUniqNoteNames
} from "./index";

const $ = (arr: string) => arr.split(" ");

describe("@tonaljs/array", () => {
  test("range", () => {
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    expect(range(2, -2)).toEqual([2, 1, 0, -1, -2]);
  });

  test("rotate", () => {
    expect(rotate(2, $("a b c d e"))).toEqual($("c d e a b"));
  });

  test("compact", () => {
    const input = ["a", 1, 0, true, false, null, undefined];
    const result = ["a", 1, 0, true];
    expect(compact(input)).toEqual(result);
  });

  test("sort", () => {
    expect(sortedNoteNames($("c f g a b h j"))).toEqual($("C F G A B"));
    expect(sortedNoteNames($("c f g a b h j j h b a g f c"))).toEqual(
      $("C C F F G G A A B B")
    );
    expect(sortedNoteNames($("c2 c5 c1 c0 c6 c"))).toEqual(
      $("C C0 C1 C2 C5 C6")
    );
  });

  test("sortedUniq", () => {
    expect(sortedUniqNoteNames($("a b c2 1p p2 c2 b c c3"))).toEqual(
      $("C A B C2 C3")
    );
  });

  test("shuffle", () => {
    const rnd = () => 0.2;
    expect(shuffle($("a b c d"), rnd)).toEqual(["b", "c", "d", "a"]);
  });

  it("permutations", () => {
    expect(permutations(["a", "b", "c"])).toEqual([
      ["a", "b", "c"],
      ["b", "a", "c"],
      ["b", "c", "a"],
      ["a", "c", "b"],
      ["c", "a", "b"],
      ["c", "b", "a"]
    ]);
  });
});
