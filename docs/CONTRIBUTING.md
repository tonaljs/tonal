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
- Add your functionality and tests
- Ensure everything works: run `npm run test:all` at root folder
- Create a pull request

## Release

Releases are built using [changesets](https://github.com/changesets/changesets). Pull requests that change a package include a changeset, created with `npx changeset` (select the packages and the bump: major, minor or patch).

A release takes two steps. Versions are bumped in a pull request first and published after it is merged, so npm never gets a version that isn't on `main`.

**1. Version pull request**

```bash
git switch -c release-x.y.z
npx changeset version # Updates version and CHANGELOG of each package
npm run build         # Updates the browser build in packages/tonal/browser
git add .
git commit -m "Version packages (x.y.z)"
git push              # Then open a pull request and merge it
```

**2. Publish**

```bash
git switch main && git pull
npm ci
npm run release
```

`npm run release` only runs on a clean `main` that matches `origin/main` and has no unreleased changesets. It builds, runs the tests, publishes the new versions with `changeset publish` and pushes their git tags.
