---
"@tonaljs/voice-leading": patch
"@tonaljs/voicing": patch
---

Document the `maxLeap` rule as it works since the last fix: a candidate is skipped when it needs a larger move from every voicing the path can be at in the chord before, and a skipped candidate doesn't lead the next chord
