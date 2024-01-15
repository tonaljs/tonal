type ScientificPitch = {
  step: number;
  alt: number;
  oct?: number;
};

const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

const altToAcc = (alt: number): string =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);

/**
 * Given a note literal (a note name or a note object), returns the Note object
 * @example
 * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */

type NoteTokens = [string, string, string, string];

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

/**
 * @private
 */
export function tokenize(str: string): NoteTokens {
  const m = REGEX.exec(str) as string[];
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

export function parse(noteName: string): ScientificPitch | null {
  const tokens = tokenize(noteName);
  if (tokens[0] === "" || tokens[3] !== "") {
    return null;
  }

  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];

  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = acc[0] === "b" ? -acc.length : acc.length;
  const oct = octStr.length ? +octStr : undefined;

  return {
    alt,
    oct,
    step,
  };
}

export function name(props: ScientificPitch): string {
  const { step, alt, oct } = props;
  const letter = "CDEFGAB".charAt(step);
  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}
