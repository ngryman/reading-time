/*!
 * reading-time
 * Copyright (c) 2014 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

function readingTime(text, options) {
  var words = 0, start = 0, end = text.length - 1, wpm, i;

	options = options || {};

  // use default values if necessary
  options.wordsPerMinute = options.wordsPerMinute || 200;

  // use provided function if available
  wordBound = options.wordBound || wordBound;

	// fetch bounds
	while (wordBound(text[start])) start++;
	while (wordBound(text[end])) end--;

	// calculate the number of words
	for (i = start; i <= end; ) {
		for ( ; i <= end && !wordBound(text[i]); i++) ;
		words++;
		for ( ; i <= end && wordBound(text[i]); i++) ;
	}

	// reading time stats
	var minutes = words / options.wordsPerMinute;
	var time = minutes * 60 * 1000;
	var displayed = Math.ceil(minutes.toFixed(2));

	return {
		text: displayed + ' min read',
		minutes: minutes,
		time: time,
		words: words
	};
}

var wordBound = function(c) {
	return (
		(' ' == c)  ||
		('\n' == c) ||
		('\r' == c) ||
		('\t' == c)
	);
};

/**
 * Export
 */
module.exports = readingTime;
