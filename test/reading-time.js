/*!
 * reading-time
 * Copyright (c) 2014 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
var readingTime = require('..'),
	curry = require('curry'),
	chai = require('chai');

chai.should();

/**
 * Test helpers.
 */

var testTime = curry(function(words, expect, done) {
	var text;
	if ('number' == typeof words)
		text = generateText(words);
	else {
		text = words;
		if (~text.indexOf(' '))
			words = words.split(/.+ +.+/g).length + 1;
		else if (text.length > 0)
			words = 1;
		else
			words = 0;
	}

	var res = readingTime(text);
	res.should.have.property('text', expect.text);
	res.should.have.property('words', words);
	// floating point funkyness
	//   http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
	res.should.have.property('time').that.is.within(expect.time - 0.000001, expect.time + 0.000001);

	done();
});

function generateText(words) {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ',
		charsLength = chars.length,
		text = '';

	for (var i = 0; i < words; i++) {
		var wordLength = Math.ceil(Math.random() * 10);
		for (var j = 0; j < wordLength; j++)
			text += chars[Math.floor(Math.random() * charsLength)];
		text += ' ';
	}

	return text;
}

/**
 * Test suite.
 */
describe('readingTime()', function() {

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

	it('should handle text containing one word correctly', testTime('0', {
		text: '1 min read',
		time: 300
	}));

	it('should handle text containing a black hole', testTime('', {
		text: '0 min read',
		time: 0
	}));

});
