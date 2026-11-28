import {
  type Chart,
  type ChartBar,
  type ChartChord,
  type Jump,
  parse as parseChart,
} from "@tonaljs/chart";
import { get as getChord } from "@tonaljs/chord";

/** An iReal Pro playlist: its name and its songs, in order. */
export type Playlist = {
  /** The playlist name ("" for a single song) */
  name: string;
  songs: Song[];
  /** What couldn't be read: not a link, a broken encoding, a song without music */
  problems: string[];
};

/** A song of a playlist: its fields, as written, and its chart. */
export type Song = {
  title: string;
  /** As iReal Pro writes it, last name first: "Ellington Duke" */
  composer: string;
  /** "Medium Swing", "Bossa Nova"… */
  style: string;
  /** The key as written: "Eb", "C-" */
  key: string;
  /** The key as tonal names it: "Eb major", "C minor" ("" if none) */
  keyName: string;
  /** The written chart (`chart.problems` lists what the reader skipped) */
  chart: Chart;
  /** Transposition set in the player, in semitones (0 if none) */
  transpose: number;
  /** The player's groove ("" for the style's default) */
  groove: string;
  /** Tempo in beats per minute (0 for the default) */
  tempo: number;
  /** Times the player repeats the song (0 for the default) */
  repeats: number;
  /** Alternate chords, written small above a bar: `(Db^7/F)` */
  alternates: { bar: number; value: string }[];
  /** Staff text that isn't a directive tonal reads ("Solos", "AABA"…) */
  comments: { bar: number; text: string }[];
};

type Fraction = ChartChord["at"];

const EMPTY_PLAYLIST: Playlist = { name: "", songs: [], problems: [] };
// the start of every irealb:// music string
const MARKER = "1r34LbKcu7";

const METERS: Record<string, string> = {
  "44": "4/4",
  "34": "3/4",
  "24": "2/4",
  "54": "5/4",
  "64": "6/4",
  "74": "7/4",
  "22": "2/2",
  "32": "3/2",
  "38": "3/8",
  "58": "5/8",
  "68": "6/8",
  "78": "7/8",
  "98": "9/8",
  "12": "12/8",
};

// iReal Pro qualities as tonal writes them
const QUALITIES: Record<string, string> = {
  "": "",
  "^": "",
  "^7": "maj7",
  "^9": "maj9",
  "^13": "maj13",
  "^7#11": "maj7#11",
  "^9#11": "maj9#11",
  "^7#5": "maj7#5",
  "^7b5": "maj7b5",
  "^7#9": "maj7#9",
  "^13#11": "maj13#11",
  "-": "m",
  "-7": "m7",
  "-9": "m9",
  "-11": "m11",
  "-13": "m13",
  "-6": "m6",
  "-69": "m69",
  "-^7": "mMaj7",
  "-^9": "mMaj9",
  "-^11": "mMaj11",
  "-^13": "mMaj13",
  "-^": "mMaj7",
  "-7b5": "m7b5",
  "-b6": "mb6",
  "-#5": "m#5",
  "-7b6": "m7b6",
  "-9b6": "m9b6",
  "-add9": "madd9",
  "-(add4)": "madd4",
  "-7b9": "m7b9",
  "-11b5": "m11b5",
  h: "m7b5",
  h7: "m7b5",
  h9: "m9b5",
  ø: "m7b5",
  ø7: "m7b5",
  ø9: "m9b5",
  o: "dim",
  o7: "dim7",
  "o^7": "dimMaj7",
  "+": "aug",
  "+7": "7#5",
  sus: "sus4",
  "7sus": "7sus4",
  "9sus": "9sus4",
  "13sus": "13sus4",
  "7b9sus": "7b9sus4",
  "7b13sus": "7b13sus4",
  "7susadd3": "7susadd3",
  "7add3sus": "7susadd3",
  "11": "11",
  "6": "6",
  "69": "69",
  "6/9": "69",
  "2": "add9",
  add9: "add9",
  "5": "5",
  "(add4)": "add4",
  "7": "7",
  "9": "9",
  "13": "13",
  "7alt": "7alt",
  "7b9": "7b9",
  "7#9": "7#9",
  "7b5": "7b5",
  "7#5": "7#5",
  "7#11": "7#11",
  "7b13": "7b13",
  "9#11": "9#11",
  "9b5": "9b5",
  "9#5": "9#5",
  "13#11": "13#11",
  "13b9": "13b9",
  "13#9": "13#9",
  "7b9b13": "7b9b13",
  "7b9#5": "7b9#5",
  "7b9b5": "7b9b5",
  "7b9#9": "7b9#9",
  "7#9#5": "7#9#5",
  "7#9b5": "7#9b5",
  "7#9#11": "7#9#11",
  "7b9#11": "7b9#11",
  "7(add13)": "7add13",
  min13: "m13",
  "min^11": "mMaj11",
  "min^13": "mMaj13",
  "maj13#11": "maj13#11",
  maj7b5: "maj7b5",
  "maj7#9": "maj7#9",
  min7b6: "m7b6",
  min9b6: "m9b6",
  "maj(add4)": "add4",
  "min(add4)": "madd4",
};
const QUALITY_KEYS = Object.keys(QUALITIES)
  .filter(Boolean)
  .sort((a, b) => b.length - a.length);
// what may follow a known quality and still be part of it ("7b9b13#11")
const QUALITY_TAIL = /^[0-9#b^+]+/;
const ROOT = /^[A-G][b#]?/;
const BASS = /^\/([A-G][b#]?)/;

/** An unknown quality, rewritten the obvious way ("-" is minor, "^" major…). */
function rewriteQuality(ireal: string): string {
  if (ireal in QUALITIES) return QUALITIES[ireal];
  return ireal
    .replace(/^-\^/, "mMaj")
    .replace(/^-/, "m")
    .replace(/^\^/, "maj")
    .replace(/^h/, "m7b5")
    .replace(/sus(?!\d)/, "sus4");
}

/** A quality typed between asterisks (`C*m7b5*`), in the spellings people use. */
function customQuality(text: string): string {
  const t = text.trim();
  if (t === "") return "";
  if (t in QUALITIES) return QUALITIES[t];
  return t
    .replace(/^(min|mi|-)/, "m")
    .replace(/^(7M|M7|maj|∆|Δ|\^)(?=\d|$)/, "maj")
    .replace(/^maj$/, "maj7")
    .replace(/^m(M|\^|maj)7?/, "mMaj7")
    .replace(/^(Ø|ø|h)7?/, "m7b5")
    .replace(/^(7\+|\+7)$/, "7#5")
    .replace(/^7\+4$/, "7#11")
    .replace(/^sus9$/, "sus2")
    .replace(/^#11$/, "maj#11");
}

/** Read an iReal Pro chord at the start of `text`: its length and tonal symbol. */
function readChord(text: string): {
  length: number;
  ireal: string;
  root: string;
  quality: string;
  bass: string;
} | null {
  const root = ROOT.exec(text);
  if (!root) return null;
  let i = root[0].length;
  let quality: string;
  let ireal: string;
  const custom = /^\*([^*]{0,12})\*/.exec(text.slice(i));
  if (custom) {
    quality = customQuality(custom[1]);
    ireal = custom[0];
    i += custom[0].length;
  } else {
    const rest = text.slice(i);
    let q = QUALITY_KEYS.find((k) => rest.startsWith(k)) ?? "";
    i += q.length;
    const tail = QUALITY_TAIL.exec(text.slice(i));
    if (tail) {
      q += tail[0];
      i += tail[0].length;
    }
    quality = rewriteQuality(q);
    ireal = q;
  }
  const bass = BASS.exec(text.slice(i));
  if (bass) i += bass[0].length;
  return {
    length: i,
    ireal: root[0] + ireal + (bass ? bass[0] : ""),
    root: root[0],
    quality,
    bass: bass ? bass[1] : "",
  };
}

/**
 * Get the tonal symbol of an iReal Pro chord symbol: `^7` is maj7, `-7` m7,
 * `h7` m7b5, `o7` dim7, `-^7` mMaj7, `7sus` 7sus4, `2` add9, a quality
 * between asterisks is a custom one (`C*m7b5*`). It returns `""` if the
 * symbol isn't a chord tonal reads.
 *
 * @param symbol - an iReal Pro chord symbol, as written in its charts
 * @returns the chord symbol for tonal, or `""`
 * @example
 * IReal.chord("C-7"); // => "Cm7"
 * IReal.chord("Bb^7#11"); // => "Bbmaj7#11"
 * IReal.chord("F#h7/C"); // => "F#m7b5/C"
 * IReal.chord("Eb*7M*"); // => "Ebmaj7"
 * IReal.chord("Xyz"); // => ""
 */
export function chord(symbol: string): string {
  if (typeof symbol !== "string") return "";
  const read = readChord(symbol.trim());
  if (!read || read.length !== symbol.trim().length) return "";
  const value = read.root + read.quality + (read.bass ? `/${read.bass}` : "");
  return getChord(value).empty ? "" : value;
}

function swapBlock(s: string): string {
  const c = s.split("");
  for (let i = 0; i < 50; i++) {
    if (i < 5 || (i >= 10 && i < 24)) {
      c[i] = s[49 - i];
      c[49 - i] = s[i];
    }
  }
  return c.join("");
}

// The music string of an irealb:// song, readable: after the marker, every
// 50-character block swaps characters 0–4 with 45–49 and 10–23 with 26–39,
// except the last 51 or fewer characters. The shorthands then become cells:
// `XyQ` three blank cells, `LZ` a bar line, `Kcl` a repeated bar.
function music(text: string): string {
  let s = text;
  if (s.startsWith(MARKER)) {
    s = s.slice(MARKER.length);
    let out = "";
    while (s.length > 51) {
      out += swapBlock(s.slice(0, 50));
      s = s.slice(50);
    }
    s = out + s;
  }
  return s.replace(/XyQ/g, "   ").replace(/LZ/g, " |").replace(/Kcl/g, "| x");
}

// The split rule of Chart, for a meter and a number of chords
const splitCache = new Map<string, Fraction[]>();
function splitRule(meter: string, n: number): Fraction[] {
  const key = `${meter} ${n}`;
  if (!splitCache.has(key)) {
    const bar = parseChart(`| ${Array(n).fill("C").join(" ")} |`, { meter })
      .bars[0];
    splitCache.set(key, bar ? bar.chords.map((c) => c.at) : []);
  }
  return splitCache.get(key)!;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const fraction = (n: number, d: number): Fraction => {
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
};

type Cell = { cell: number; value: string; rest?: true };
type Building = {
  bar: ChartBar;
  cells: number;
  items: Cell[];
  copy?: "x" | "r";
  // a mark that makes an otherwise blank bar a bar
  marked: boolean;
  // after a closing bar line (] } Z), blanks are row alignment, not a bar
  afterClosing: boolean;
};

const JUMP = new RegExp(
  "^(D\\.\\s?[CS]\\.)\\s*(al\\s+(Coda|Fine|([123])\\s*(st|nd|rd)\\s*end(\\.|ing)?))?\\s*$",
  "i",
);

/** The chart of an iReal Pro music string, with its alternates and comments. */
function readMusic(
  source: string,
): Pick<Song, "chart" | "alternates" | "comments"> {
  const text = music(source);
  const problems: string[] = [];
  const alternates: Song["alternates"] = [];
  const comments: Song["comments"] = [];
  const bars: ChartBar[] = [];
  const built: Building[] = [];
  let meter = "4/4";
  let section: string | undefined;
  let repeatStart = false;
  let passes: number | undefined;
  let lastChord: { root: string; quality: string } | undefined;
  let lastEnding = 0;
  const codas: { bar: number; atStart: boolean }[] = [];

  const fresh = (afterClosing: boolean): Building => ({
    bar: { meter, chords: [] },
    cells: 0,
    items: [],
    marked: false,
    afterClosing,
  });
  let cur = fresh(false);
  const problem = (message: string) =>
    problems.push(`bar ${bars.length + 1}: ${message}`);
  const hasContent = (b: Building) =>
    b.items.length > 0 || b.copy !== undefined;
  const exists = (b: Building) =>
    hasContent(b) || b.marked || (b.cells > 0 && !b.afterClosing);

  // close the open bar at a bar line
  const close = (afterClosing: boolean): ChartBar | undefined => {
    let closed: ChartBar | undefined;
    if (exists(cur)) {
      if (section !== undefined && cur.bar.section === undefined) {
        cur.bar.section = section;
        section = undefined;
      }
      if (repeatStart) {
        cur.bar.repeatStart = true;
        repeatStart = false;
      }
      bars.push(cur.bar);
      built.push(cur);
      closed = cur.bar;
    } else {
      // blanks for alignment: their directives go to the bar before
      const before = bars[bars.length - 1];
      if (before && cur.bar.jump) before.jump = cur.bar.jump;
      if (before && cur.bar.fine) before.fine = true;
    }
    cur = fresh(afterClosing);
    return closed;
  };
  // the bar a directive belongs to: the open one, or the last closed
  const directiveBar = (): ChartBar =>
    hasContent(cur) || cur.cells > 0 || !bars.length
      ? cur.bar
      : bars[bars.length - 1];

  let i = 0;
  while (i < text.length) {
    const ch = text[i];

    // bar lines
    if ("|[]{}Z".includes(ch)) {
      i++;
      if (ch === "{" || ch === "[" || ch === "|") {
        close(false);
        if (ch === "{") repeatStart = true;
      } else {
        const target = close(true) ?? bars[bars.length - 1];
        if (target && ch === "}") {
          target.repeatEnd = passes ?? 2;
          passes = undefined;
        } else if (target) target.doubleBar = true;
      }
      continue;
    }
    // a section: *A, *B, *i (intro), *v (verse)
    if (ch === "*") {
      const name = text[i + 1];
      i += 2;
      if (name === undefined) break;
      section =
        name === "i" ? "Intro" : name === "v" || name === "V" ? "Verse" : name;
      if (!hasContent(cur) && exists(cur)) {
        cur.bar.section = section;
        section = undefined;
      }
      continue;
    }
    // a meter: T44
    if (ch === "T" && /^\d\d/.test(text.slice(i + 1, i + 3))) {
      const m = METERS[text.slice(i + 1, i + 3)];
      if (m) {
        meter = m;
        cur.bar.meter = m;
      } else problem(`unknown meter T${text.slice(i + 1, i + 3)}`);
      i += 3;
      continue;
    }
    // staff text: a directive, a repeat count, or a comment
    if (ch === "<") {
      const end = text.indexOf(">", i);
      const raw = text.slice(i + 1, end < 0 ? text.length : end);
      i = end < 0 ? text.length : end + 1;
      const t = raw.replace(/^\*\d\d/, "").trim();
      const times = /^(\d+)\s*x$/i.exec(t);
      const jump = JUMP.exec(t);
      if (times) passes = Number(times[1]);
      else if (jump) {
        const what = jump[1].replace(/\s/g, "").toUpperCase();
        const al = jump[4]
          ? ` al ${jump[4]}${["st", "nd", "rd"][Number(jump[4]) - 1]} ending`
          : jump[3]
            ? ` al ${jump[3][0].toUpperCase()}${jump[3].slice(1).toLowerCase()}`
            : "";
        directiveBar().jump = (what + al) as Jump;
      } else if (/^fine$/i.test(t)) directiveBar().fine = true;
      else if (t) comments.push({ bar: bars.length, text: t });
      continue;
    }
    // an ending: N1, N2, N3; N0 is the one after the ending before
    if (ch === "N" && /\d/.test(text[i + 1] ?? "")) {
      let n = Number(text[i + 1]);
      i += 2;
      if (n === 0) n = lastEnding + 1;
      cur.bar.ending = [n];
      lastEnding = n;
      cur.marked = true;
      continue;
    }
    // marks without cells
    if (ch === "S") {
      i++;
      cur.bar.segno = true;
      cur.marked = true;
      continue;
    }
    if (ch === "Q") {
      i++;
      codas.push({ bar: bars.length, atStart: !hasContent(cur) });
      cur.marked = true;
      continue;
    }
    // fermata, end, vertical space, small and large chords, separator
    if ("fUYsl,".includes(ch)) {
      i++;
      continue;
    }
    if (ch === " ") {
      i++;
      cur.cells++;
      continue;
    }
    // repeat the bar before, or the two before
    if (ch === "x" || ch === "r") {
      i++;
      cur.copy = ch;
      cur.cells++;
      continue;
    }
    // no chord, a slash (the chord goes on), an invisible chord (a new bass)
    if (ch === "n") {
      i++;
      cur.items.push({ cell: cur.cells, value: "N.C.", rest: true });
      cur.cells++;
      continue;
    }
    if (ch === "p") {
      i++;
      cur.cells++;
      continue;
    }
    if (ch === "W") {
      i++;
      const bass = BASS.exec(text.slice(i));
      if (bass) {
        i += bass[0].length;
        if (lastChord) {
          cur.items.push({
            cell: cur.cells,
            value: `${lastChord.root}${lastChord.quality}/${bass[1]}`,
          });
        }
      }
      cur.cells++;
      continue;
    }
    // alternate chords, written small above the bar
    if (ch === "(") {
      const end = text.indexOf(")", i);
      const value = text.slice(i + 1, end < 0 ? text.length : end);
      i = end < 0 ? text.length : end + 1;
      if (value) alternates.push({ bar: bars.length, value });
      continue;
    }
    // a chord
    const read = readChord(text.slice(i));
    if (read) {
      i += read.length;
      const value =
        read.root + read.quality + (read.bass ? `/${read.bass}` : "");
      if (getChord(value).empty) problem(`unknown chord "${read.ireal}"`);
      lastChord = { root: read.root, quality: read.quality };
      cur.items.push({ cell: cur.cells, value });
      cur.cells++;
      continue;
    }
    problem(`unknown token "${ch}"`);
    i++;
  }
  if (hasContent(cur) || cur.marked) close(true);

  // x copies the bar before; r the two before, over its bar and the next
  built.forEach((b, k) => {
    const copy = (from: Building, to: Building) => {
      to.items = from.items.map((item) => ({ ...item }));
      to.cells = from.cells;
    };
    if (b.copy === "x" && k > 0) copy(built[k - 1], b);
    if (b.copy === "r" && k > 1) {
      const one = built[k - 1];
      copy(built[k - 2], b);
      const next = built[k + 1];
      if (next && !hasContent(next)) copy(one, next);
    }
  });

  // codas: two signs are the To Coda (at the end of its bar) and the coda;
  // one sign is a coda alone (played after the last chorus)
  if (codas.length) {
    const at = codas[codas.length >= 2 ? 1 : 0];
    if (codas.length >= 2) {
      const to = codas[0];
      const b = bars[to.atStart ? to.bar - 1 : to.bar];
      if (b) b.toCoda = true;
    }
    if (bars[at.bar]) bars[at.bar].coda = true;
    if (codas.length > 2) problems.push(`${codas.length} coda signs`);
  }

  // positions by cell
  for (const b of built) {
    if (!b.items.length) continue;
    const [num, den] = b.bar.meter.split("/").map(Number);
    let ats: Fraction[];
    if (b.cells === num) {
      // a cell is a beat
      ats = b.items.map((item) => fraction(item.cell * 4, den));
    } else if (b.items.length === 1 && b.items[0].cell === 0) {
      ats = [[0, 1]];
    } else if (
      b.cells > 0 &&
      b.items.every((it) => (it.cell * num) % b.cells === 0)
    ) {
      // the cell's share of the bar, on a beat
      ats = b.items.map((item) =>
        fraction(((item.cell * num) / b.cells) * 4, den),
      );
    } else {
      ats = splitRule(b.bar.meter, b.items.length);
    }
    b.bar.chords = b.items.map((item, k) => {
      const c: ChartChord = { value: item.value, at: ats[k] ?? [0, 1] };
      if (item.rest) c.rest = true;
      return c;
    });
  }

  return {
    chart: { empty: bars.length === 0, bars, problems },
    alternates,
    comments,
  };
}

const keyName = (key: string) => {
  const minor = key.endsWith("-");
  const tonic = minor ? key.slice(0, -1) : key;
  return ROOT.test(tonic) && ROOT.exec(tonic)![0] === tonic
    ? `${tonic} ${minor ? "minor" : "major"}`
    : "";
};

const number = (s: string | undefined) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

/** Links copied from an HTML `href` keep its entities: `&amp;`, `&#039;`. */
const unescapeHtml = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/**
 * Read an iReal Pro link (`irealb://…` or `irealbook://…`): a single song or
 * a playlist. Each song has its fields as written (title, composer, style,
 * key, and the player's transpose, groove, tempo and repeats) and its chart as
 * a tonal `Chart`, as written: bars with their chords, sections, meters,
 * repeats, endings and jumps, so `Chart.unroll` and `Chart.chords` play it.
 *
 * Chords are placed by their cell: a 4/4 bar has 4 cells, one per beat. The
 * symbols become tonal's (see `IReal.chord`); what the reader can't read is
 * in `chart.problems`. Alternate chords and staff text that isn't a
 * directive are kept beside the chart, with their bar.
 *
 * It returns an empty playlist (with `problems`) if the text isn't an iReal
 * Pro link.
 *
 * @param url - an iReal Pro link, as text (percent-encoded or not)
 * @returns the playlist
 * @example
 * const { songs } = IReal.parse("irealbook://Blues In F=Composer=Medium Swing=F=n=[T44F7 |Bb7 |F7 |C-7 F7 |Bb7 |Bo7 |F7 |D7 |G-7 |C7 |F7 D7 |G-7 C7 Z");
 * songs[0].title; // => "Blues In F"
 * songs[0].keyName; // => "F major"
 * Chart.toText(songs[0].chart);
 * // => "| F7 | Bb7 | F7 | Cm7 F7 |\n| Bb7 | Bdim7 | F7 | D7 |\n| Gm7 | C7 | F7 D7 | Gm7 C7 ||"
 */
export function parse(url: string): Playlist {
  if (typeof url !== "string") {
    return { ...EMPTY_PLAYLIST, problems: ["not an iReal Pro link"] };
  }
  const link = unescapeHtml(url.trim());
  const protocol = /^irealb(ook)?:\/\//.exec(link);
  if (!protocol) {
    return { ...EMPTY_PLAYLIST, problems: ["not an iReal Pro link"] };
  }
  let body: string;
  try {
    body = decodeURIComponent(link.slice(protocol[0].length));
  } catch {
    return {
      ...EMPTY_PLAYLIST,
      problems: ["the link isn't percent-encoded right"],
    };
  }
  const problems: string[] = [];
  const songs: Song[] = [];
  const song = (fields: {
    title: string;
    composer: string;
    style: string;
    key: string;
    music: string;
    transpose?: string;
    groove?: string;
    tempo?: string;
    repeats?: string;
  }): Song => ({
    title: fields.title,
    composer: fields.composer,
    style: fields.style,
    key: fields.key,
    keyName: keyName(fields.key),
    ...readMusic(fields.music),
    transpose: number(fields.transpose),
    groove: fields.groove ?? "",
    tempo: number(fields.tempo),
    repeats: number(fields.repeats),
  });

  if (protocol[1]) {
    // irealbook://: six fields per song (title, composer, style, key, "n",
    // music), several songs per link, then maybe the playlist name
    const f = body.split("=");
    for (let k = 0; k + 6 <= f.length; k += 6) {
      songs.push(
        song({
          title: f[k],
          composer: f[k + 1],
          style: f[k + 2],
          key: f[k + 3],
          music: f[k + 5],
        }),
      );
    }
    const name = f.length % 6 === 1 ? f[f.length - 1] : "";
    if (!songs.length) problems.push("no song in the link");
    return { name, songs, problems };
  }

  // irealb://: songs separated by "===", the playlist name last. An empty
  // field can also make "===": a piece without the music marker belongs to
  // the next song
  const pieces = body.split("===");
  let name = "";
  let pending = "";
  pieces.forEach((piece, k) => {
    const text = pending ? `${pending}===${piece}` : piece;
    if (!text.includes(MARKER)) {
      if (k < pieces.length - 1) pending = text;
      else if (pieces.length > 1) name = text;
      return;
    }
    pending = "";
    // title, composer, (unused), style, key, transpose, music, groove, tempo, repeats
    const f = text.split("=");
    const m = f.findIndex((x) => x.startsWith(MARKER));
    if (m < 5) {
      problems.push(`song ${songs.length + 1}: its fields can't be read`);
      return;
    }
    songs.push(
      song({
        title: f[0],
        composer: f[1],
        style: f[3],
        key: f[4],
        transpose: f[5],
        music: f[m],
        groove: f[m + 1],
        tempo: f[m + 2],
        repeats: f[m + 3],
      }),
    );
  });
  if (!songs.length) problems.push("no song in the link");
  return { name, songs, problems };
}
