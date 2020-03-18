import Interval from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/interval", () => {
  test("properties", () => {
    expect(Interval.get("P4")).toEqual({
      alt: 0,
      chroma: 5,
      coord: [-1, 1],
      dir: 1,
      empty: false,
      name: "4P",
      num: 4,
      oct: 0,
      q: "P",
      semitones: 5,
      simple: 4,
      step: 3,
      type: "perfectable"
    });
  });

  test("shorthand properties", () => {
    expect(Interval.name("d5")).toEqual("5d");
    expect(Interval.num("d5")).toEqual(5);
    expect(Interval.quality("d5")).toEqual("d");
    expect(Interval.semitones("d5")).toEqual(6);
  });

  test("distance", () => {
    expect(Interval.distance("C4", "G4")).toEqual("5P");
  });

  test("names", () => {
    expect(Interval.names()).toEqual([
      "1P",
      "2M",
      "3M",
      "4P",
      "5P",
      "6m",
      "7m"
    ]);
  });

  test("simplify intervals", () => {
    expect($("1P 2M 3M 4P 5P 6M 7M").map(Interval.simplify)).toEqual(
      $("1P 2M 3M 4P 5P 6M 7M")
    );
    expect($("8P 9M 10M 11P 12P 13M 14M").map(Interval.simplify)).toEqual(
      $("8P 2M 3M 4P 5P 6M 7M")
    );
    expect($("1d 1P 1A 8d 8P 8A 15d 15P 15A").map(Interval.simplify)).toEqual(
      $("1d 1P 1A 8d 8P 8A 1d 1P 1A")
    );
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(Interval.simplify)).toEqual(
      $("-1P -2M -3M -4P -5P -6M -7M")
    );
    expect(
      $("-8P -9M -10M -11P -12P -13M -14M").map(Interval.simplify)
    ).toEqual($("-8P -2M -3M -4P -5P -6M -7M"));
  });

  test("invert intervals", () => {
    expect($("1P 2M 3M 4P 5P 6M 7M").map(Interval.invert)).toEqual(
      $("1P 7m 6m 5P 4P 3m 2m")
    );
    expect($("1d 2m 3m 4d 5d 6m 7m").map(Interval.invert)).toEqual(
      $("1A 7M 6M 5A 4A 3M 2M")
    );
    expect($("1A 2A 3A 4A 5A 6A 7A").map(Interval.invert)).toEqual(
      $("1d 7d 6d 5d 4d 3d 2d")
    );
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(Interval.invert)).toEqual(
      $("-1P -7m -6m -5P -4P -3m -2m")
    );
    expect($("8P 9M 10M 11P 12P 13M 14M").map(Interval.invert)).toEqual(
      $("8P 14m 13m 12P 11P 10m 9m")
    );
  });
  test("fromSemitones", () => {
    let semis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M")
    );
    semis = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("8P 9m 9M 10m 10M 11P 12d 12P 13m 13M 14m 14M")
    );
    semis = [-0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("1P -2m -2M -3m -3M -4P -5d -5P -6m -6M -7m -7M")
    );
    semis = [-12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("-8P -9m -9M -10m -10M -11P -12d -12P -13m -13M -14m -14M")
    );
  });

  test("add", () => {
    expect(Interval.add("3m", "5P")).toEqual("7m");
    expect(Interval.names().map(n => Interval.add("5P", n))).toEqual(
      $("5P 6M 7M 8P 9M 10m 11P")
    );
    expect(Interval.names().map(Interval.addTo("5P"))).toEqual(
      $("5P 6M 7M 8P 9M 10m 11P")
    );
  });

  test("substract", () => {
    expect(Interval.substract("5P", "3M")).toEqual("3m");
    expect(Interval.substract("3M", "5P")).toEqual("-3m");
    expect(Interval.names().map(n => Interval.substract("5P", n))).toEqual(
      $("5P 4P 3m 2M 1P -2m -3m")
    );
  });
});
