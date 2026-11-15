---
"@tonaljs/pitch-distance": minor
"tonal": minor
---

**Behavior change:** `distance` between pitch classes (when either note has no octave) now always returns a simple interval, ascending by letter, even when it sounds lower. Some results that led to the right note before are now named differently: `C` to `Cb` is `1d` (was `8d`), and `C#` to `Dbb` is `2dd` (was `9dd`).

Fix `distance` results that led to the wrong note. The written letters now decide the interval: between notes with octaves, the direction comes from the letters, and only a unison takes it from the sound. `C4` to `B##3` is `-2dd` (was `7AA`), `B#3` to `Cb4` is `2dd` (was `-7AA`), and `C10` to `B#9` is `-2d` (was `7A`). `C4` to `Cb4` is still `-1A`. Between pitch classes, `Cbb` to `A#` is `6AAA` (was `-1AAA`).
