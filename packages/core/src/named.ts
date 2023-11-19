export interface Named {
  readonly name: string;
}

export interface NamedFound {
  readonly empty: false;
}

export interface NotFound extends Named {
  readonly empty: true;
  readonly name: "";
}

export function isNamed(src: unknown): src is Named {
  return src !== null &&
    typeof src === "object" &&
    "name" in src &&
    typeof src.name === "string"
    ? true
    : false;
}
