---
"@tonaljs/voice-leading": patch
"@tonaljs/voicing": patch
"tonal": patch
---

Fix `VoiceLeading.path` and `Voicing.sequence` with `maxLeap`: the path could go through a candidate skipped for its large move, and the chords before it came back as `[]` with an infinite cost
