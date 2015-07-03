/*!
 * reading-time
 * Copyright (c) 2014 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

function readingTime(text) {
	var words = 0, start = 0, end = text.length - 1, i;

	// fetch bounds
	while (whitespace(text[start])) start++;
	while (whitespace(text[end])) end--;

	// there no words if bounds are equal
	if (start == end) return null;

	// calculates the number of words
	for (i = start; i <= end; ) {
		for ( ; i <= end && !whitespace(text[i]); i++) ;
		words++;
		for ( ; i <= end && whitespace(text[i]); i++) ;
	}

	// reading time stats
	var minutes = words / 200;
	var time = minutes * 60 * 1000;
	var displayed = Math.ceil(minutes);

	return {
		text: displayed + ' min read',
		time: time,
		words: words
	};
}

function whitespace(c) {
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
