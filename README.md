# reading-time

[![NPM](http://img.shields.io/npm/v/reading-time-i18n.svg)](https://www.npmjs.org/package/reading-time-i18n) [![Build Status](https://travis-ci.org/segux/reading-time-i18n.svg?branch=master)](https://travis-ci.org/segux/reading-time-i18n)

<br>

[Medium]'s like reading time estimation.

`reading-time` helps you estimate how long an article will take to read.
It works perfectly with plain text, but also with `markdown` or `html`.

Note that it's focused on performance and simplicity, so the number of words it will extract from other formats than
plain text can vary a little. But this is an estimation right?

[Medium]: https://medium.com

### Why moment?

I needed to use the reading-time package, i love it but i need it with internacionalization. Probably the original package is lightweight intentionally developed, then i thought was better idea if i split into a new npm package for projects that you need a faster solution to reading time internacionalizated.


## Installation

```sh
npm install reading-time-i18n --production
```

## Usage

### Classic

```javascript
var readingTime = require('reading-time-i18n');

var stats = readingTime(text);
// ->
// stats: {
//   text: '1 min read',
//   time: 60000.
//   words: 200
//   i18nText: '1 minute'
// }
```

### With different i18n locale

```javascript
var readingTime = require('reading-time-i18n');

var stats = readingTime(text, {locale: 'es-ES'});
// ->
// stats: {
//   text: '1 min read',
//   time: 60000.
//   words: 200
//   i18nText: '1 minuto'
// }
```

### Stream

```javascript
var readingTime = require('reading-time-i18n/stream');

fs.createReadStream('foo').pipe(readingTime).on('data', function(stats) {
	// ...
});
```

## API

`readingTime(text, options)`

 - `text`: the text to analyze
 - `options.wordsPerMinute`: the words per minute an average reader can read (default: 200)
 - `options.wordBound`: a function than return if a character is considered as a word bound (default: spaces, new lines and tabulations)
 - `options.locale`: i18n Locale for multilanguage text based on moment (default: en-GB)

## Author

| [![twitter/ngryman](http://gravatar.com/avatar/2e1c2b5e153872e9fb021a6e4e376ead?size=70)](http://twitter.com/ngryman "Follow @ngryman on Twitter") |
|---|
| [Nicolas Gryman](http://ngryman.sh) |


## Contributors


| [![twitter/seguxx](https://en.gravatar.com/userimage/138512355/719552d3e7ba53e09366ed538749efe0.jpg?size=70)](https://github.com/segux "Segux github page") |
|---|
| [Jose Segura](https://github.com/segux) |
