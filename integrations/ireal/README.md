# @tonaljs/ireal ![tonal](https://img.shields.io/badge/@tonaljs-ireal-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/ireal.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/ireal)

> Read iReal Pro links as playlists of songs, with a tonal `Chart` each

iReal Pro shares songs and playlists as links (`irealb://…`, or the older `irealbook://…`). `IReal.parse` reads one: every song with its fields (title, composer, style, key, and the player's settings) and its chart as written, as a [`Chart`](/packages/chart), so `Chart.unroll`, `Chart.chords` and `Chart.chordAt` play it.

It's an **integration**: it reads an external format into tonal's data. It isn't part of the `tonal` package (nor its browser bundle); install it beside it.

```bash
npm i tonal @tonaljs/ireal
```

```js
import { Chart } from "tonal";
import * as IReal from "@tonaljs/ireal";

const url =
  "irealbook://Blues In F=Composer=Medium Swing=F=n=[T44F7 |Bb7 |F7 |C-7 F7 |Bb7 |Bo7 |F7 |D7 |G-7 |C7 |F7 D7 |G-7 C7 Z";
const song = IReal.parse(url).songs[0];
[song.title, song.style, song.key, song.keyName];
// => ["Blues In F", "Medium Swing", "F", "F major"]
Chart.chords(song.chart).slice(0, 3).map((c) => [c.value, c.start, c.duration]);
// => [["F7", [0, 1], [4, 1]], ["Bb7", [4, 1], [4, 1]], ["F7", [8, 1], [4, 1]]]
```

## `IReal.parse`

`parse(url: string) => Playlist`

Read an iReal Pro link: one song, or a playlist.

```js
const playlist = IReal.parse(
  "irealbook://One=A B=Ballad=F=n=[T44F |C7 Z=Two=C D=Bossa Nova=A-=n=[T44A- |E7 Z=My List",
);
[playlist.name, playlist.songs.map((s) => s.title)];
// => ["My List", ["One", "Two"]]
```

A playlist has its `name` (`""` for a single song), its `songs` and its `problems`. A song has:

| Field | |
| --- | --- |
| `title`, `composer`, `style` | As written (the composer last name first: "Ellington Duke") |
| `key` | As written: `"Eb"`, `"C-"` |
| `keyName` | As tonal names it: `"Eb major"`, `"C minor"` (`""` if none) |
| `chart` | The written chart: bars with chords, sections, meters, repeats, endings and jumps |
| `transpose`, `groove`, `tempo`, `repeats` | The player's settings (`irealb://` only; `0` or `""` when not set) |
| `alternates` | Chords written small above a bar, `(Db^7/F)`, with their bar |
| `comments` | Staff text that isn't a directive ("Solos", "AABA"…), with its bar |

It returns an empty playlist with `problems` if the text isn't an iReal Pro link:

```js
IReal.parse("https://example.com");
// => { name: "", songs: [], problems: ["not an iReal Pro link"] }
```

### How the chart is read

- **Chords by cell.** iReal Pro writes a bar as cells: a chord or a blank takes one, a comma none, and a 4/4 bar usually has 4. A bar with as many cells as beats puts each chord on its cell's beat, so `C^7  G7` has G7 on beat 4; otherwise a lone chord is on beat 1, or chords go on their cell's share of the bar, or (when that isn't a beat) by `Chart`'s split rule.

  ```js
  IReal.parse("irealbook://Cells=A=Funk=C=n=[T44C^7  G7|C^7 Z").songs[0].chart.bars[0].chords;
  // => [{ value: "Cmaj7", at: [0, 1] }, { value: "G7", at: [3, 1] }]
  ```

- **Chord symbols** become tonal's: see `IReal.chord`. A symbol tonal can't read is left out and listed in `chart.problems`.
- **Bar lines**: `[` `]` double bars, `{` `}` repeats (`<3x>` in the repeat for three passes), `Z` the final bar. Blanks after a closing bar line are row alignment, not a bar.
- **Sections** (`*A`, `*B`, `*i` intro, `*v` verse) start their bar. **Meters** (`T44`, `T34`, `T68`, `T12`…) change from their bar on.
- **Repeated bars**: `x` repeats the bar before; `r` the two before, over its bar and the next.
- **Endings** `N1`, `N2`, `N3`; `N0` (an ending with no number) is the one after the ending before.
- **Jumps and marks**: `S` is the segno; two `Q` are the To Coda (at the end of its bar) and the coda, one `Q` is a coda alone (played after the last chorus); `<D.C. al Coda>`, `<D.S. al Fine>`, `<D.C. al 2nd End.>`… and `<Fine>` are read as `Chart` jumps and marks.
- **Other cells**: `n` is N.C. (a rest); `p` a slash, the chord goes on; `W/E` an invisible chord, the chord before over a new bass.
- Fermatas, small and large chord sizes and vertical spaces are layout and are ignored.

## `IReal.chord`

`chord(symbol: string) => string`

The tonal symbol of an iReal Pro chord symbol: `^7` is maj7, `-7` m7, `h7` m7b5, `o7` dim7, `-^7` mMaj7, `7sus` 7sus4, `2` add9, and a quality between asterisks is a custom one. It returns `""` if the symbol isn't a chord tonal reads.

```js
IReal.chord("C-7"); // => "Cm7"
IReal.chord("Bb^7#11"); // => "Bbmaj7#11"
IReal.chord("F#h7/C"); // => "F#m7b5/C"
IReal.chord("Eb*7M*"); // => "Ebmaj7"
IReal.chord("Xyz"); // => ""
```
