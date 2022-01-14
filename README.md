jes-ts-tocompile
---

Custom Jest matcher for testing if a typescript file compiles.

## Installation

1. Install with npm 

```sh
npm i jest-ts-tocompile
```

2. Import and install `jest-ts-tocompile` in your jest [setup file](https://jestjs.io/docs/configuration#setupfilesafterenv-array).

```js
const toCompile = require('jest-ts-tocompile');

toCompile.install();
```

### With TypeScript

When using typescript, you need to import the jest type augmentations in your setup file like so:

```ts
import `jest-ts-tocompile/types`
```

## Usage

You can call `expect` passing the file path of the typescript file to test and then call `.toCompile()` to test if the file compiles.

```typescript
import path from 'path';

describe('example files are correct', () => {
   it('should compile', () => {
      expect(path.join(__dirname, './example.ts')).toCompile();
   });
})
```