# Contributing

We're really glad you're reading this, because we need volunteers to help this project.

## Prerequisites

You will need node and yarn installed on your computer to run the code. And git to download it:

- [node](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Download the code

To download the code, use git:

```bash
git clone https://github.com/tonaljs/tonal
yarn install
yarn build
```

## Development

Modules are written in Typescript and live inside `packages/` folder.

If you are adding new functionality or fixing a bug, please add a test for it.

**Run test and build the library before submitting a pull request :pray:**

```bash
yarn test:ci
```

#### How to add a new module

To create a new module:

- Add a new folder inside packages: `packages/my-module`
- Add a new package.json inside the folder (see any of them as an example)
- Add required dependencies to "dependencies" inside package.json. Ensure correct dependency versions. For example, if your module needs to use `tonal/core` look at core's package.json to see what version to use
- Add your functionality and tests
- Ensure everything works: run `yarn test:ci` at root folder
- Create a pull request

## Release

Releases are built using changesets: https://turbo.build/repo/docs/handbook/publishing-packages/versioning-and-publishing:

```
# Create a new branch
git co -b release-4.7.4

# Select packages and which version (major, minor, bump)

npx changeset

# Update version and CHANGELOG of each package
npx changeset version

# Create commit and PR
git add .
git commit -m "chore: bump version"

# Build browser
npm run build
git add .
git commit -m "chore: browser build"

# Create PR
git push

# Publish all changed packages to npm
npx changeset publish
```
