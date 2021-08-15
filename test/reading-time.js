/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */
var readingTime = require('..')
var curry = require('curry')
var chai = require('chai')

chai.should()

/**
 * Test helpers.
 */

var test = curry(function(words, options, expect, done) {
  var text

  if ('number' === typeof words) {
    text = generateText(words)
  }
  else {
    text = words
    if (~text.indexOf(' ')) {
      words = words.split(/.+ +.+/g).length + 1
    }
    else if (text.length > 0) {
      words = 1
    }
    else {
      words = 0
    }
  }

  var res = readingTime(text, options)
  res.should.have.property('text', expect.text)
  if (expect.words) {
    res.should.have.property('words', expect.words)
  }
  else {
    res.should.have.property('words', words)
  }
  if (expect.time) {
    res.should.have.property('time').that.is.equal(expect.time)
  }
  done()
})

function generateText(words) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  chars += '0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ'
  var charsLength = chars.length
  var text = ''

  for (var i = 0; i < words; i++) {
    var wordLength = Math.ceil(Math.random() * 10)
    for (var j = 0; j < wordLength; j++) {
      text += chars[Math.floor(Math.random() * charsLength)]
    }
    text += ' '
  }

  return text
}

/**
 * Test suite.
 */
describe('readingTime()', function() {
  it('should handle less than 1 minute text',
  test(2, {}, {
    text: '1 min read',
    minutes: 1,
    time: 600
  }))

  it('should handle less than 1 minute text',
  test(50, {}, {
    text: '1 min read',
    minutes: 1,
    time: 15000
  }))

  it('should handle 1 minute text',
  test(100, {}, {
    text: '1 min read',
    minutes: 1,
    time: 30000
  }))

  it('should handle 2 minutes text',
  test(300, {}, {
    text: '2 min read',
    minutes: 2,
    time: 90000
  }))

  it('should handle a very long text',
  test(500, {}, {
    text: '3 min read',
    minutes: 3,
    time: 150000
  }))

  it('should handle text containing multiple successive whitespaces',
  test('word  word    word', {}, {
    text: '1 min read',
    minutes: 1,
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
    minutes: 1,
    time: 900
  }))

  it('should handle text containing links',
  test('word http://ngryman.sh word', {}, {
    text: '1 min read',
    minutes: 1,
    time: 900
  }))

  it('should handle text containing markdown links',
  test('word [blog](http://ngryman.sh) word', {}, {
    text: '1 min read',
    minutes: 1,
    time: 900
  }))

  it('should handle text containing one word correctly',
  test('0', {}, {
    text: '1 min read',
    minutes: 1,
    time: 300
  }))

  it('should handle text containing a black hole',
  test('', {}, {
    text: '0 min read',
    minutes: 0,
    time: 0
  }))

  it('should accept a custom word per minutes value',
  test(200, { wordsPerMinute: 100 }, {
    text: '2 min read',
    minutes: 2,
    time: 120000
  }))

  it('should handle a CJK paragraph',
  test('今天，我要说中文！（没错，现在这个库也完全支持中文了）', {}, {
    text: '1 min read',
    words: 22,
    minutes: 1
  }))

  it('should handle a CJK paragraph with Latin words',
  test('你会说English吗？', {}, {
    text: '1 min read',
    words: 5,
    minutes: 1
  }))

  it('should handle a CJK paragraph with Latin punctuation',
  test('科学文章中, 经常使用英语标点... (虽然这段话并不科学)', {}, {
    text: '1 min read',
    words: 22,
    minutes: 1
  }))

  it('should handle a CJK paragraph starting and terminating in Latin words',
  test('JoshCena喜欢GitHub', {}, {
    text: '1 min read',
    words: 4,
    minutes: 1
  }))

  it('should handle a typical Korean paragraph',
  test('이것은 한국어 단락입니다', {}, {
    text: '1 min read',
    words: 11,
    minutes: 1
  }))

  it('should handle a typical Japanese paragraph',
  test('天気がいいから、散歩しましょう', {}, {
    text: '1 min read',
    words: 14,
    minutes: 1
  }))

  it('should treat Katakana as one word',
  test('メガナイトはありますか？', {}, {
    text: '1 min read',
    words: 7,
    minutes: 1
  }))
})
