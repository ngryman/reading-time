/*!
 * reading-time
 * Copyright (c) 2014 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
var readingTime = require('../lib/stream'),
	curry = require('curry'),
	chai = require('chai');

chai.should();

/**
 * Test helpers.
 */

var testTime = curry(function(words, expect, done) {
	var chunks;
	if ('number' == typeof words)
		chunks = generateChunks(words);
	else {
		chunks = [new Buffer(words)];
		words = 3;
	}

	var analyzer = readingTime();
	analyzer.on('data', function(res) {
		res.should.have.property('text', expect.text);
		res.should.have.property('words', words);
		// floating point funkyness
		//   http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
		res.should.have.property('time').that.is.within(expect.time - 0.000001, expect.time + 0.000001);

		done();
	});

	chunks.forEach(analyzer.write.bind(analyzer));
	analyzer.end();
});

function generateChunks(words) {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ',
		charsLength = chars.length,
		chunks = [],
		chunk = '';

	for (var i = 0; i < words; i++) {
		var wordLength = Math.ceil(Math.random() * 10);
		for (var j = 0; j < wordLength; j++)
			chunk += chars[Math.floor(Math.random() * charsLength)];
		chunk += ' ';

		if (0 !== i && 0 === i % 10) {
			chunks.push(chunk);
			chunk = '';
		}
	}
	chunks.push(chunk);

	return chunks.map(function(chunk) {
		return new Buffer(chunk);
	});
}

/**
 * Test suite.
 */
describe('readingTime stream', function() {

	it('should handle less than 1 minute text', testTime(2, {
		text: '1 min read',
		time: 600
	}));

	it('should handle less than 1 minute text', testTime(50, {
		text: '1 min read',
		time: 15000
	}));

	it('should handle 1 minute text', testTime(100, {
		text: '1 min read',
		time: 30000
	}));

	it('should handle 2 minutes text', testTime(300, {
		text: '2 min read',
		time: 90000
	}));

	it('should handle a very long text', testTime(500, {
		text: '3 min read',
		time: 150000
	}));

	it('should handle text containing multiple successive whitespaces', testTime('word  word    word', {
		text: '1 min read',
		time: 900
	}));

	it('should handle text starting with whitespaces', testTime('   word word word', {
		text: '1 min read',
		time: 900
	}));

	it('should handle text ending with whitespaces', testTime('word word word   ', {
		text: '1 min read',
		time: 900
	}));

	it('should handle text containing links', testTime('word http://ngryman.sh word', {
		text: '1 min read',
		time: 900
	}));

	it('should handle text containing markdown links', testTime('word [blog](http://ngryman.sh) word', {
		text: '1 min read',
		time: 900
	}));

});
