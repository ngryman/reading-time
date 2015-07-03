/*!
 * reading-time
 * Copyright (c) 2014 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
var readingTime = require('./reading-time'),
	Transform = require('stream').Transform,
	util = require('util');

function ReadingTimeStream() {
	// allow use without new
	if (!(this instanceof ReadingTimeStream))
		return new ReadingTimeStream();

	Transform.call(this, { objectMode: true });

	this.stats = {
		minutes: 0,
		time: 0,
		words: 0
	};
}
util.inherits(ReadingTimeStream, Transform);

ReadingTimeStream.prototype._transform = function(chunk, encoding, callback) {
	var stats = readingTime(chunk, {
		whitespace: Buffer.isBuffer(chunk) ? bufferWhitespace : null
	});

	this.stats.minutes += stats.minutes;
	this.stats.time += stats.time;
	this.stats.words += stats.words;

	callback();
};

ReadingTimeStream.prototype._flush = function(callback) {
	this.stats.text = Math.ceil(this.stats.minutes) + ' min read';

	this.push(this.stats);
	callback();
};

function bufferWhitespace(c) {
	return (
		(32 == c) ||	// space
		(10 == c) ||	// line feed
		(13 == c) ||	// carriage return
		(9 == c)		// tabulation
	);
}

/**
 * Export
 */
module.exports = ReadingTimeStream;
