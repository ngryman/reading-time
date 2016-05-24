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

function ReadingTimeStream(options) {
	// allow use without new
	if (!(this instanceof ReadingTimeStream))
		return new ReadingTimeStream(options);

	Transform.call(this, { objectMode: true });

  this.options = options || {};
	this.stats = {
		minutes: 0,
		time: 0,
		words: 0
	};
}
util.inherits(ReadingTimeStream, Transform);

ReadingTimeStream.prototype._transform = function(chunk, encoding, callback) {
  this.options.wordBound = Buffer.isBuffer(chunk) ?
    this.options.wordBound || bufferWordBound :
    null;

	var stats = readingTime(chunk, this.options);

	this.stats.minutes += stats.minutes;
	this.stats.time += stats.time;
	this.stats.words += stats.words;

	callback();
};

ReadingTimeStream.prototype._flush = function(callback) {
  // console.log(this.stats.minutes);
	this.stats.text = Math.ceil(this.stats.minutes.toFixed(2)) + ' min read';

	this.push(this.stats);
	callback();
};

function bufferWordBound(c) {
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
