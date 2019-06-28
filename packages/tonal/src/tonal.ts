export interface Tonal {
  readonly empty: boolean;
  readonly name: string;
}

export interface NoTonal {
  readonly empty: true;
  readonly name: "";
}

export const Nothing: Tonal = { empty: true, name: "" };
