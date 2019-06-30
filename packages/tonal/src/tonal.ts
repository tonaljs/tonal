export interface Tonal {
  readonly empty: boolean;
  readonly name: string;
}

export interface NoTonal {
  readonly empty: true;
  readonly name: "";
}

export function isTonal(src: any): src is Tonal {
  return typeof src === "object" && typeof src.name === "string";
}

export const Nothing: Tonal = { empty: true, name: "" };
