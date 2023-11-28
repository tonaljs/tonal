import * as Tonal from "./index";

describe("tonal", () => {
  test("exported modules and functions", () => {
    const exportedNames = Object.keys(Tonal).sort();
    expect(exportedNames).toMatchSnapshot();
  });
  test("Modules exports functions", () => {
    const modNames = Object.keys(Tonal)
      .sort()
      .filter((name) => name[0] === name.toUpperCase()[0]);

    const exportedFunctions = modNames.reduce(
      (exported, modName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = (Tonal as any)[modName];
        exported[modName] = Object.keys(mod).sort();
        return exported;
      },
      {} as Record<string, string[]>,
    );

    expect(exportedFunctions).toMatchSnapshot();
  });
});
