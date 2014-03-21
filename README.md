# reading-time

[Medium]'s like reading time estimation.

`reading-time` helps you estimate how long an article will take to read.
It works perfectly with plain text, but also with `markdown` or `html`.

Note that it's focused on performance and simplicity, so the number of words it will extract from other formats than
plain text can vary a little. But this is an estimation right?

[Medium](https://medium.com)

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
}

## Author

| [![twitter/ngryman](http://gravatar.com/avatar/2e1c2b5e153872e9fb021a6e4e376ead?size=70)](http://twitter.com/ngryman "Follow @ngryman on Twitter") |
|---|
| [Nicolas Gryman](http://ngryman.sh) |

<img width="1" height="1" src="https://cruel-carlota.pagodabox.com/cec9f8a0012c619d46fc5398ab2f3046">