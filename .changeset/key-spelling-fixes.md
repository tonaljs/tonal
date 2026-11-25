---
"@tonaljs/key": minor
"tonal": minor
---

Key: substitute dominants never have a double flat, and the harmonic minor IV chord scale is "dorian #4".

- **Substitute dominants** are spelled a diminished fifth above their secondary dominant, as before, unless that needs a double flat or sharp: then they take the simplest name, as a lead sheet writes them. In Eb major the substitute of `Eb7` is `A7`, not `Bbb7`, and its ii is `Em7`, not `Fbm7`:

  ```js
  Key.majorKey("Eb").substituteDominants; // => ["", "Gb7", "Ab7", "A7", "Cb7", "Db7", ""]
  Key.minorKey("C").natural.substituteDominants; // => ["Db7", "", "", "Gb7", "Ab7", "A7", "Cb7"]
  ```

  Roots with a single flat keep their spelling (`Cb7` in Gb major, where Cb is a note of the key). Since `minorKeyChords` merges chords by name, `A7` in C minor now has two roles: `subV/bVI` and `V/II`.

- **The fourth degree of harmonic minor** had "lydian diminished", a scale with a note outside the key (F lydian diminished has E, C harmonic minor has Eb). It is now "dorian #4" (F G Ab B C D Eb), which fits the degree's chord, Fm7.
