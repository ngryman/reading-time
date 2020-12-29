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
  res.should.have.property('words', words)
  // floating point funkyness
  //   http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
  res.should.have.property('time').that.is.within(
    expect.time - 0.000001, expect.time + 0.000001)

  // Moment multi language
  res.should.have.property('i18nText', expect.i18nText)

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
    time: 600,
    i18nText: 'a minute'
  }))

  it('should handle less than 1 minute text',
  test(50, {}, {
    text: '1 min read',
    minutes: 1,
    time: 15000,
    i18nText: 'a minute'
  }))

  it('should handle 1 minute text',
  test(100, {}, {
    text: '1 min read',
    minutes: 1,
    time: 30000,
    i18nText: 'a minute'
  }))

  it('should handle 2 minutes text',
  test(300, {}, {
    text: '2 min read',
    minutes: 2,
    time: 90000,
    i18nText: '2 minutes'
  }))

  it('should handle a very long text',
  test(500, {}, {
    text: '3 min read',
    minutes: 3,
    time: 150000,
    i18nText: '3 minutes'
  }))

  it('should handle text containing multiple successive whitespaces',
  test('word  word    word', {}, {
    text: '1 min read',
    minutes: 1,
    time: 900,
    i18nText: 'a minute'
  }))

  it('should handle text ending with whitespaces',
  test('word word word   ', {}, {
    text: '1 min read',
    minutes: 1,
    time: 900,
    i18nText: 'a minute'
  }))

  it('should handle text containing links',
  test('word http://ngryman.sh word', {}, {
    text: '1 min read',
    minutes: 1,
    time: 900,
    i18nText: 'a minute'
  }))

  it('should handle text containing markdown links',
  test('word [blog](http://ngryman.sh) word', {}, {
    text: '1 min read',
    minutes: 1,
    time: 900,
    i18nText: 'a minute'
  }))

  it('should handle text containing one word correctly',
  test('0', {}, {
    text: '1 min read',
    minutes: 1,
    time: 300,
    i18nText: 'a minute'
  }))

  it('should handle text containing a black hole',
  test('', {}, {
    text: '0 min read',
    minutes: 0,
    time: 0,
    i18nText: 'a few seconds'
  }))

  it('should accept a custom word per minutes value',
  test(200, { wordsPerMinute: 100 }, {
    text: '2 min read',
    minutes: 2,
    time: 120000,
    i18nText: '2 minutes'
  }))

  it('should handle i18n locale from moment option with 2 minutes text',
  test(100, { locale: 'es-ES' }, {
      text: '1 min read',
      minutes: 1,
      time: 30000,
      i18nText: 'un minuto'   
  }))
})
