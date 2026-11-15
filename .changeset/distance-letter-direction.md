---
"@tonaljs/pitch-distance": patch
"tonal": patch
---

Fix `distance` so the written letters decide the interval, even when the sound goes the other way.

- Between notes with octaves, the direction comes from the letters, and only a unison takes it from the sound: `C4` to `B##3` is `-2dd` (was `7AA`), `B#3` to `Cb4` is `2dd` (was `-7AA`), `C10` to `B#9` is `-2d` (was `7A`), and `C4` to `Cb4` is still `-1A`.
- Between pitch classes, the interval is simple and ascending by letter: `C#` to `Dbb` is `2dd` (was `9dd`), `Cbb` to `A#` is `6AAA` (was `-1AAA`), and `C` to `Cb` is `1d` (was `8d`).
