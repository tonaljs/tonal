---
"@tonaljs/voice-leading": patch
---

`VoiceLeading.topNoteDiff` no longer sorts the voicings it's given, and returns `[]` (not `undefined`) when there are none.
