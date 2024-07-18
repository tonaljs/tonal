type RhythmItem = 0 | 1;

export type Rhythm = Array<RhythmItem>;

export function binary(...numbers: number[]): Rhythm {
  return numbers.reduce((rhythm, number) => {
    number
      .toString(2)
      .split("")
      .forEach((digit: string) => {
        rhythm.push(parseInt(digit) as RhythmItem);
      });
    return rhythm;
  }, [] as Rhythm);
}

export function onsets(...numbers: number[]): Rhythm {
  return numbers.reduce((rhythm, number) => {
    rhythm.push(1);
    for (let i = 0; i < number; i++) {
      rhythm.push(0);
    }
    return rhythm;
  }, [] as Rhythm);
}
