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
	fromStream = require('../stream'),
	MemoryStream = require('memorystream'),
	Transform = require('stream').Transform,
	chai = require('chai');

chai.should();

/**
 * Test suite.
 */
describe('fromStream()', function() {
	it('should a pipeable analyser', function(){
		fromStream().should.be.an('object').and.have.a.property('_readableState');
	});

	it('should contain a `stats` read-only property', function(){
		fromStream().should.have.property('stats').and.be.a('object');
	});

	it('should count 3 words in 1 chunk', function(done){
		var analyser = fromStream();
		var stream = new MemoryStream('one two three');

		stream
			.pipe(analyser)
			.pipe(new MemoryStream())
			.on('finish', function(){
				analyser.stats.words.should.equal(3);
				analyser.stats.time.should.equal(900);

				done();
			});

		stream.end('');
	});

	it('should count 4 words in 2 chunks', function(done){
		var analyser = fromStream();
		var stream = new MemoryStream(['one two three', 'four']);

		stream
			.pipe(analyser)
			.pipe(new MemoryStream())
			.on('finish', function(){
				analyser.stats.words.should.equal(4);

				done();
			});

		stream.end('');
	});
});
