/*!
 * reading-time
 * Copyright (c) 2014 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

function readingTime(text, options) {
	var words = 0, start = 0, end = text.length - 1, i;

	options = options || {};

	// use provided function if available
	wordBound = options.wordBound || wordBound;

	// fetch bounds
	while (wordBound(text[start])) start++;
	while (wordBound(text[end])) end--;

	// calculates the number of words
	for (i = start; i <= end; ) {
		for ( ; i <= end && !wordBound(text[i]); i++) ;
		words++;
		for ( ; i <= end && wordBound(text[i]); i++) ;
	}

	// reading time stats
	var minutes = words / 200;
	var time = minutes * 60 * 1000;
	var displayed = Math.ceil(minutes);

	return {
		text: displayed + ' min read',
		minutes: minutes,
		time: time,
		words: words
	};
}

function wordBound(c) {
	return (
		(' ' == c)  ||
		('\n' == c) ||
		('\r' == c) ||
		('\t' == c)
	);
}

/**
 * Export
 */
module.exports = readingTime;
