import DurationValue from "./index";

describe("@tonaljs/duration-value", () => {
  test("get shorthand", () => {
    expect(DurationValue.get("q")).toEqual({
      empty: false,
      name: "q",
      value: 0.25,
      fraction: [1, 4],
      dots: "",
      shorthand: "q",
      names: ["quarter", "crotchet"]
    });

    expect(DurationValue.get("dl.")).toEqual({
      empty: false,
      name: "dl.",
      dots: ".",
      value: 12,
      fraction: [12, 1],
      names: ["large", "duplex longa", "maxima", "octuple", "octuple whole"],
      shorthand: "dl"
    });
  });

  test("get long name", () => {
    expect(DurationValue.get("large.")).toMatchObject({
      empty: false,
      name: "large."
    });
  });

  test("value", () => {
    const DL = [8, 12, 14, 15];
    expect(["dl", "dl.", "dl..", "dl..."].map(DurationValue.value)).toEqual(DL);

    const L = [4, 6, 7, 7.5];
    expect(["l", "l.", "l..", "l..."].map(DurationValue.value)).toEqual(L);

    const Q = [0.25, 0.375, 0.4375, 0.46875];
    expect(["q", "q.", "q..", "q..."].map(DurationValue.value)).toEqual(Q);
  });

  test("fraction", () => {
    expect(["w", "w.", "w..", "w..."].map(DurationValue.fraction)).toEqual([
      [1, 1],
      [3, 2],
      [7, 4],
      [15, 8]
    ]);
  });

  test("shorthands", () => {
    expect(DurationValue.shorthands().join(",")).toEqual(
      "dl,l,d,w,h,q,e,s,t,sf,h,th"
    );
  });

  test("names", () => {
    expect(DurationValue.names().join(",")).toEqual(
      "large,duplex longa,maxima,octuple,octuple whole,long,longa,double whole,double,breve,whole,semibreve,half,minim,quarter,crotchet,eighth,quaver,sixteenth,semiquaver,thirty-second,demisemiquaver,sixty-fourth,hemidemisemiquaver,hundred twenty-eighth,two hundred fifty-sixth"
    );
  });
});
