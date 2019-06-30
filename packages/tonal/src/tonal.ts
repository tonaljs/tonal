export interface Named {
  readonly name: string;
}

export interface NotFound extends Named {
  readonly empty: true;
  readonly name: "";
}

export function isNamed(src: any): src is Named {
  return typeof src === "object" && typeof src.name === "string";
}
