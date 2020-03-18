import Progression from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/progression", () => {
  test("concrete", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("I IIm7 V7"))).toEqual($("C Dm7 G7"));
    expect(inC($("Imaj7 2 IIIm7"))).toEqual(["Cmaj7", "", "Em7"]);
    expect(inC($("I II III IV V VI VII"))).toEqual($("C D E F G A B"));
    expect(inC($("bI bII bIII bIV bV bVI bVII"))).toEqual(
      $("Cb Db Eb Fb Gb Ab Bb")
    );
    expect(inC($("#Im7 #IIm7 #III #IVMaj7 #V7 #VI #VIIo"))).toEqual(
      $("C#m7 D#m7 E# F#Maj7 G#7 A# B#o")
    );
  });

  test("abstract", () => {
    const roman = Progression.toRomanNumerals("C", ["Cmaj7", "Dm7", "G7"]);
    expect(roman).toEqual(["Imaj7", "IIm7", "V7"]);
  });
});
