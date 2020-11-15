# Changelog

## 4.x

Adopt a fixed/locked mode with lerna. Before, each module has it's own version. Now the same version is used for all modules. [More info](https://github.com/lerna/lerna#fixedlocked-mode-default)

Deprecated modules:

- @tonaljs/modules (use @tonaljs/tonal)
- @tonaljs/array (use @tonaljs/collection)

#### Releases

- 4.6.x:

  - Add Note.enharmonic #225

- 4.5.x:
  - Mode notes, triads, seventhChords and relativeTonic #221
  - Scale.rangeOf #220
  - Improve chord detection and remove invalid chord #209
  - Fixes #218, #208, #207, #215

## Before

Before 4.5.0 there's no changelog, sorry 🙏. I'm afraid you have to dive into commits.

To make things worse, each module had it's own version, making difficult to know what was released when.

At least I'll try to keep this one up to date

Theres a [migration guide](migration-guide.md) for older versions (pre 4)
