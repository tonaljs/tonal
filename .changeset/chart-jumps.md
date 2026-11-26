---
"@tonaljs/chart": minor
---

Charts have jumps: `<D.C.>`, `<D.S.>` (with `<Segno>`), `al Fine` (with `<Fine>`) and `al Coda` (with `<To Coda>` and `<Coda>`). `Chart.unroll` plays them as most players read them:

- after the jump, repeats aren't taken and only the last ending is played (`repeatsOnJump: true` takes the repeats again);
- with `choruses`, an `al Coda` or `al Fine` tune plays the part before the jump once per chorus and the jump and the coda (or the Fine) once, at the end of the last chorus; a plain D.C. or D.S. is part of the tune, so each chorus plays the whole tune with its jump;
- `<To Coda>` and `<Coda>` without a jump are a D.C. al Coda before the coda.

Marks that don't fit (a D.S. without a segno, a second jump, a `<Fine>` without `al Fine`) are listed by `Chart.problems`.
