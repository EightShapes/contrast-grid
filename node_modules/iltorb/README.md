# iltorb

[![NPM Version][npm-badge]][npm-url]
[![Travis Build Status][travis-badge]][travis-url]
[![AppVeyor Build Status][appveyor-badge]][appveyor-url]

[iltorb](https://www.npmjs.com/package/iltorb) is a [Node.js](https://nodejs.org) package offering native bindings for the [brotli](https://github.com/google/brotli) compression library.

## Usage

### Install

On Windows, in order to compile the native bindings, it is recommended to install the [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) beforehand.

```
npm install iltorb
```

### Async

#### compress(buffer[, brotliParams], callback)

```javascript
const compress = require('iltorb').compress;

compress(input, function(err, output) {
  // ...
});
```

#### decompress(buffer, callback)

```javascript
const decompress = require('iltorb').decompress;

decompress(input, function(err, output) {
  // ...
});
```

### Sync

#### compressSync(buffer[, brotliParams])

```javascript
const compressSync = require('iltorb').compressSync;

try {
  var output = compressSync(input);
} catch(err) {
  // ...
}
```

#### decompressSync(buffer)

```javascript
const decompressSync = require('iltorb').decompressSync;

try {
  var output = decompressSync(input);
} catch(err) {
  // ...
}
```

### Stream

#### compressStream([brotliParams])

```javascript
const compressStream = require('iltorb').compressStream;
const fs = require('fs');

fs.createReadStream('path/to/input')
  .pipe(compressStream())
  .pipe(fs.createWriteStream('path/to/output'));
```

#### decompressStream()

```javascript
const decompressStream = require('iltorb').decompressStream;
const fs = require('fs');

fs.createReadStream('path/to/input')
  .pipe(decompressStream())
  .pipe(fs.createWriteStream('path/to/output'));
```

### brotliParams

The `compress`, `compressSync` and `compressStream` methods may accept an optional `brotliParams` object to define some or all of [brotli's compression settings](https://github.com/google/brotli/blob/98ed7a23a83d64133b0a36a884e489bffb0eb864/enc/encode.h#L28-L57).

```javascript
const brotliParams = {
  mode: 0,
  quality: 11,
  lgwin: 22,
  lgblock: 0
};
```

[npm-badge]: https://img.shields.io/npm/v/iltorb.svg
[npm-url]: https://www.npmjs.com/package/iltorb
[travis-badge]: https://img.shields.io/travis/MayhemYDG/iltorb.svg
[travis-url]: https://travis-ci.org/MayhemYDG/iltorb
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/ysib4o1bfey84lqk/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/MayhemYDG/iltorb
