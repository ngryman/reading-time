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
	fromWords = require('../lib/from-words'),
	chai = require('chai');

chai.should();

/**
 * Test suite.
 */
describe('fromWords()', function() {
	it('should return a function (without options)', function(){
		fromWords().should.be.a('function');
	});

	it('should return a function (with argument)', function(){
		fromWords(400).should.be.a('function');
	});

	it('should return a reading time in milliseconds for a given amount of words', function(){
		fromWords(400)(5).should.equal(750);
	});
});
