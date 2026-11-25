---
"@tonaljs/voicing": minor
---

The weights of the voicing cost are in one documented place, and the README says how they were checked: against the voicings of Phil DeGreg's *Jazz Keyboard Harmony*, keeping the textbook results of the tests. No result changes.

A voicing that carries its own bass (`bass: "none"`) prefers root position on every chord of a sequence, and with `previous`, not only without context: its lowest note is heard as the bass (C E A alone sounds like Am/C). The preference is soft. For triads that invert over a root, use a bass part: `{ bass: "root", voices: 3 }`. Checked on Phil DeGreg's ii–V–I with alternating A and B forms: 11 of 16 with the book's voicings (9 before).

