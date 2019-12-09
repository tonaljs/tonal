# Contributing

We're really glad you're reading this, because we need volunteers to help this project.

## Prerequisites

You will need node and yarn installed in your computer to run the code. And git to download it:

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

## Develop

Modules are written in Typescript and lives inside `packages/` folder.

If you are adding new functionallity, plase add a test for it

If you are adding a new module, include it inside `packages/module/index.ts`

Ensure all tests passes and library can be built, before making a pull request:

```
yarn test
yarn test:lint
yarn build
```





