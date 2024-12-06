# reading-time

[![NPM](http://img.shields.io/npm/v/reading-time.svg)](https://www.npmjs.org/package/reading-time) [![Build Status](http://img.shields.io/travis/ngryman/reading-time.svg)](https://travis-ci.org/ngryman/reading-time)

<br>

[Medium]'s like reading time estimation.

`reading-time` helps you estimate how long an article will take to read.
It works perfectly with plain text, but also with `markdown` or `html`.

Note that it's focused on performance and simplicity, so the number of words it will extract from other formats than plain text can vary a little. But this is an estimation right?

[medium]: https://medium.com

## Installation

```sh
npm install reading-time --production
```

## Usage

### Classic

```javascript
// In Node.js
const readingTime = require('reading-time');
// In the browser
const readingTime = require('reading-time/lib/reading-time');

const stats = readingTime(text);
// ->
// stats: {
//   text: "1 min read",
//   minutes: 1,
//   time: 60000,
//   words: {total: 200}
// }
console.log(`The reading time is: ${stats.minutes} min`);
```

<details>
<summary><b>🙋‍♂️ Why different imports for Node.js and the browser?</b></summary><br>
  
This library is primarily for Node.js. The entrypoint also exports a `ReadingTimeStream` class which is, without polyfills, not supported in browsers. A simple workaround is to import the underlying `lib/reading-time` module.

**Note that in the upcoming `2.0.0` version, this won't be necessary anymore.**

</details>

### Stream

```javascript
const {ReadingTimeStream, readingTimeWithCount} = require('reading-time');

const analyzer = new ReadingTimeStream();
fs.createReadStream('foo')
  .pipe(analyzer)
  .on('data', (count) => {
    console.log(`The reading time is: ${readingTimeWithCount(count).minutes} min`);
  });
```

<details>
<summary><b>🙋‍♂️ Can I use this in the browser?</b></summary><br>
  
Yes. You need to provide the appropriate polyfills. Please refer to your bundler's documentation.

</details>

## API

### `readingTime(text, options?)`

Returns an object with `text`, `minutes`, `time` (in milliseconds), and `words`.

```ts
type ReadingTimeResults = {
  text: string;
  minutes: number;
  time: number;
  words: WordCountStats;
};
```

- `text`: the text to analyze
- options (optional)
  - `options.wordsPerMinute`: (optional) the words per minute an average reader can read (default: 200)
  - `options.wordBound`: (optional) a function that returns a boolean value depending on if a character is considered as a word bound (default: spaces, new lines and tabs)

### `countWords(text, options?)`

Returns an object representing the word count stats:

```ts
type WordCountStats = {
  total: number;
};
```

- `text`: the text to analyze
- options (optional)
  - `options.wordBound`: (optional) a function that returns a boolean value depending on if a character is considered as a word bound (default: spaces, new lines and tabs)

### `readingTimeWithCount(words, options?)`

Returns an object with `minutes` (rounded minute stats) and `time` (exact time in milliseconds).

- `words`: the word count stats
- options (optional)
  - `options.wordsPerMinute`: (optional) the words per minute an average reader can read (default: 200)

Note that `readingTime(text, options) === readingTimeWithCount(countWords(text, options), options)`.

## Help wanted!

This library has been optimized for alphabetical languages and CJK languages, but may not behave correctly for other languages that don't use spaces for word bounds. If you find the behavior of this library to deviate significantly from your expectation, issues or contributions are welcomed!

## Other projects

- [Fauda](https://github.com/ngryman/fauda): configuration made simple.
- [Badge Size](https://github.com/ngryman/badge-size): Displays the size of a given file in your repository.
- [Commitizen Emoji](https://github.com/ngryman/cz-emoji): Commitizen adapter formatting commit messages using emojis.
