'use strict';

var fromBuffer = require('./lib/from-buffer');
var fromWords = require('./lib/from-words');
var through = require('through2');

function StreamBufferReadingTime(options) {
	options = options || {};
	var stats = {
		chars: 0,
		spaces: 0,
		words: 0,
		time: 0
	};

	var getTime = fromWords(options.wordsPerMinutes || 200);

	var stream = through(function(chunk, enc, next){
		var chunkStats = fromBuffer(chunk);

		stats.chars += chunkStats.chars;
		stats.spaces += chunkStats.spaces;
		stats.words += chunkStats.words;

		this.push(chunk);
		next();
	});

	Object.defineProperty(stream, 'stats', {
		enumerable: true,
		get: function(){
			// compute time only on demand
			stats.time = getTime(stats.words);

			return stats;
		}
	});

	return stream;
}

module.exports = StreamBufferReadingTime;
