# Contributing

We're really glad you're reading this, because we need volunteers to help this project.

## Prerequisites

You will need node installed on your computer to run the code. And git to download it:

- [node](https://nodejs.org/en/download/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Download the code

To download the code, use git:

```bash
git clone https://github.com/tonaljs/tonal
npm install
npm run build
```

## Development

Modules are written in Typescript and live inside `packages/` folder.

If you are adding new functionality or fixing a bug, please add a test for it.

**Run test and build the library before submitting a pull request :pray:**

```bash
npm run test:all
```

**How to add a new module**

To create a new module:

- Add a new folder inside packages: `packages/my-module`
- Add a new package.json inside the folder (see any of them as an example)
- Add required dependencies to "dependencies" inside package.json. Ensure correct dependency versions. For example, if your module needs to use `tonal/core` look at core's package.json to see what version to use
- Keep `"sideEffects": false` in its package.json, and keep the module free of side effects at import time: building its own data (a dictionary) is fine, changing globals or another module's state on load is not. It lets an app's bundler leave out the modules it doesn't use; `npm run test:size` checks what typical imports weigh
- Add your functionality and tests
- Ensure everything works: run `npm run test:all` at root folder
- Create a pull request

## Music, not sound

tonal describes music, it doesn't play it. For time, tonal says **where** things are: positions and durations, meters, bars and beats, rhythm patterns, chord charts and the chord at a position. Saying **when** they play (tempo, tempo maps, seconds) is planned, and comes step by step. Playing stays outside: clocks, scheduling, audio and state. `Math.random` only comes in as an injected `rnd` function. A function that needs any of those belongs in the app or an audio library.

Time values are numbers of **quarter notes**, as in music21, MIDI and MusicXML, returned as exact fractions `[numerator, denominator]` (`@tonaljs/time`): a dotted quarter is `[3, 2]`, a triplet eighth `[1, 3]`. Floats can't hold a third exactly, and the error lands on the wrong bar of a chart. Functions also take exact numbers as input (multiples of 1/1024, like `1.5`) and strings (`"1/3"`). Bars and beats are written `"bar:beat"`, both from 1, and a beat is the meter's lower note (in 6/8, an eighth). New time functions use these values and `Time`'s helpers (`add`, `compare`, `equal`), never float arithmetic.

New functions that place things in time follow the conventions of `Chart`:

- `at` is a position inside a container (a chord in its bar: `ChartChord.at`), and `start` a position from the start of the piece or the played form (`PlayedBar.start`, `PlayedChord.start`).
- What is played has a `start` and a `duration`, and what it holds is its `value`: a played chord is `{ value, start, duration, bar }`, with the chord symbol as `value`. The other fields say where it comes from (`bar`), and a function that changes when something is played keeps them.
- A span is half-open: a chord that starts at 0 and lasts 4 quarters covers `[0, 4)`, so at 4 the next one plays (`Chart.chordAt`, `Chart.barAt`). A query for what's in a range takes what starts in it, so two ranges next to each other never give the same thing twice.

## Documentation

Each package is documented in its README (`packages/<name>/README.md`), which npm and GitHub show. **Edit the docs of a package in its README only.** The docs site (`site/`) generates its package pages from the READMEs every time it builds (`site/scripts/docs-from-readmes.mjs`, run by `npm run build` and `npm run dev` in `site/`), so those pages are not in git. `site/scripts/docs-from-readmes.json` maps each site page to its package folder (which is also its npm badge) and sets its title and description.

When the site builds a page, it removes the README title line (with the badges), the `@tonaljs/<name>` line, the leading `> ` tagline when the page has a description, and the `## Usage` section.

README conventions:

- Group the functions in `##` sections (`## API` if there's only one group)
- Each function has a ``### `Namespace.name` `` heading, followed by its signature in backticks: `` `name(param: type) => type` ``
- Examples show the result in a comment: `Note.get("C4").midi; // => 60`
- Link other packages to their site page (`https://tonaljs.github.io/tonal/docs/...`), which works on npm, GitHub and the site

The pages without a package (`site/content/docs/index.md` and `site/content/docs/voicings/*`) are written in `site/` directly.

## Release

Releases are built using [changesets](https://github.com/changesets/changesets). Pull requests that change a package include a changeset, created with `npx changeset` (select the packages and the bump: major, minor or patch).

A release takes two steps. Versions are bumped in a pull request first and published after it is merged, so npm never gets a version that isn't on `main`.

**1. Version pull request**

```bash
git switch -c release-x.y.z
npx changeset version    # Updates version and CHANGELOG of each package
cp packages/tonal/CHANGELOG.md docs/CHANGELOG.md  # The changelog the README links to
node scripts/tonal-readme.mjs  # The README npm shows for tonal, from the repository README
npm run docs:api         # llms-api.txt has the tonal version in its header
npm run build -- --force # Rebuilds the browser build in packages/tonal/browser
git add .
git commit -m "Version packages (x.y.z)"
git push                 # Then open a pull request and merge it
```

`--force` skips the turbo cache, so the committed browser build is always a real rebuild of the current source.

**2. Publish**

```bash
git switch main && git pull
npm ci
npm run release
```

`npm run release` only runs on a clean `main` that matches `origin/main` and has no unreleased changesets. It builds, runs the tests, publishes the new versions with `changeset publish` and pushes their git tags.
