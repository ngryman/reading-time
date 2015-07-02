# reading-time

[![NPM](http://img.shields.io/npm/v/reading-time.svg)](https://www.npmjs.org/package/reading-time) [![Build Status](http://img.shields.io/travis/ngryman/reading-time.svg)](https://travis-ci.org/ngryman/reading-time) [![Dependency Status](http://img.shields.io/gemnasium/ngryman/reading-time.png)](https://gemnasium.com/ngryman/reading-time) [![Gittip](http://img.shields.io/gittip/ngryman.svg)](https://www.gittip.com/ngryman/)

<br>

[Medium]'s like reading time estimation.

`reading-time` helps you estimate how long an article will take to read.
It works perfectly with plain text, but also with `markdown` or `html`.

Note that it's focused on performance and simplicity, so the number of words it will extract from other formats than
plain text can vary a little. But this is an estimation right?

[Medium]: https://medium.com

## Installation

```bash
npm install reading-time --production
```

## Usage

```javascript
var readingTime = require('reading-time');

var stats = readingTime(text);
// ->
// stats: {
//   text: '1 min read',
//   time: 60000.
//   words: 200
// }
```

## Streaming usage

This mode enables you to process large files with a flat memory consumption.
Because it does not convert into strings, it should also be decently faster, especially with large volumes of data.

```javascript
var readingTime = require('reading-time/stream');
var analyser = readingTime({ wordsPerMinutes: 200 });
var fs = require('fs');

fs.createReadStream('path/to/file.txt')
	.pipe(analyser)
	.pipe(process.stdout)
	.on('end', function(){
		console.log(analyser.stats);
	});
```

## Author

| [![twitter/ngryman](http://gravatar.com/avatar/2e1c2b5e153872e9fb021a6e4e376ead?size=70)](http://twitter.com/ngryman "Follow @ngryman on Twitter") |
|---|
| [Nicolas Gryman](http://ngryman.sh) |
