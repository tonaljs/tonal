import RN from ".";

const lowercase = xs => xs.map(x => x.toLowerCase());

describe("tonal-roman-numeral", () => {
  it("has names", () => {
    expect(RN.names()).toEqual(["I", "II", "III", "IV", "V", "VI", "VII"]);
    expect(RN.names(false)).toEqual(["i", "ii", "iii", "iv", "v", "vi", "vii"]);
  });

  it("get roman numeral name", () => {
    expect(RN.name("IIIMaj7")).toEqual("III");
    expect(RN.names().map(RN.name)).toEqual(RN.names());
    expect(lowercase(RN.names()).map(RN.name)).toEqual(lowercase(RN.names()));
    expect(RN.name("nothing")).toEqual(null);
    expect(RN.name("iI")).toEqual(null);
  });

  it("convert to decimal", () => {
    expect(RN.names().map(RN.decimal)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect([0, 1, 7, 9].map(RN.decimal)).toEqual([null, 1, 7, null]);
  });

  it("get props", () => {
    expect(RN.props("VIIb5")).toEqual({
      name: "VII",
      type: "b5",
      decimal: 7,
      major: true
    });
  });

  it("create from degrees", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(RN.fromDegree)).toEqual(RN.names());
    expect([1, 2, 3, 4, 5, 6, 7].map(d => RN.fromDegree(d, false))).toEqual(
      RN.names(false)
    );
  });
});
