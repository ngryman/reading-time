/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */
var readingTime = require('../lib/stream')
var curry = require('curry')
var chai = require('chai')

chai.should()

/**
 * Test helpers.
 */

var test = curry(function(words, options, expect, done) {
  var chunks

  if ('number' === typeof words) {
    chunks = generateChunks(words)
  }
  else {
    chunks = [Buffer.from(words)]
    if (~words.indexOf(' ')) {
      words = words.split(/.+ +.+/g).length + 1
    }
    else if (words.length > 0) {
      words = 1
    }
    else {
      words = 0
    }
  }

  var analyzer = readingTime(options)
  analyzer.on('data', function(res) {
    res.should.have.property('text', expect.text)
    res.should.have.property('words', words)
    res.should.have.property('time').that.is.equal(expect.time)
    done()
  })

  chunks.forEach(chunk => analyzer.write.bind(analyzer)(chunk))
  analyzer.end()
})

function generateChunks(words) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  chars += '0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ'
  var charsLength = chars.length
  var chunks = []
  var chunk = ''

  for (var i = 0; i < words; i++) {
    var wordLength = Math.ceil(Math.random() * 10)
    for (var j = 0; j < wordLength; j++) {
      chunk += chars[Math.floor(Math.random() * charsLength)]
    }
    chunk += ' '

    if (0 !== i && 0 === i % 10) {
      chunks.push(chunk)
      chunk = ''
    }
  }
  chunks.push(chunk)

  return chunks.map(function(chunk) {
    return Buffer.from(chunk)
  })
}

/**
* Test suite.
*/
describe('readingTime stream', function() {
  it('should handle less than 1 minute text',
  test(2, {}, {
    text: '1 min read',
    time: 600
  }))

  it('should handle less than 1 minute text',
  test(50, {}, {
    text: '1 min read',
    time: 15000
  }))

  it('should handle 1 minute text',
  test(100, {}, {
    text: '1 min read',
    time: 30000
  }))

  it('should handle 2 minutes text',
  test(300, {}, {
    text: '2 min read',
    time: 90000
  }))

  it('should handle a very long text',
  test(500, {}, {
    text: '3 min read',
    time: 150000
  }))

  it('should handle text containing multiple successive whitespaces',
  test('word  word    word', {}, {
    text: '1 min read',
    time: 900
  }))

  it('should handle text starting with whitespaces',
  test('   word word word', {}, {
    text: '1 min read',
    time: 900
  }))

  it('should handle text ending with whitespaces',
  test('word word word   ', {}, {
    text: '1 min read',
    time: 900
  }))

  it('should handle text containing links',
  test('word http://ngryman.sh word', {}, {
    text: '1 min read',
    time: 900
  }))

  it('should handle text containing markdown links',
  test('word [blog](http://ngryman.sh) word', {}, {
    text: '1 min read',
    time: 900
  }))

  it('should handle text containing one word correctly',
  test('0', {}, {
    text: '1 min read',
    time: 300
  }))

  it('should handle text containing a black hole',
  test('', {}, {
    text: '0 min read',
    time: 0
  }))

  it('should accept a custom word per minutes value',
  test(200, { wordsPerMinute: 100 }, {
    text: '2 min read',
    time: 120000
  }))
})
