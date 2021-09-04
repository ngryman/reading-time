/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */
const { ReadingTimeStream } = require('../lib')
const curry = require('curry')
const chai = require('chai')

chai.should()

/**
 * Test helpers.
 */

const test = curry(function(words, options, expect, done) {
  let chunks

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

  const analyzer = new ReadingTimeStream(options)
  analyzer.on('data', function(res) {
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

  chunks.forEach(chunk => analyzer.write.bind(analyzer)(chunk, 'utf8'))
  analyzer.end()
})

function generateChunks(words) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ'
  const charsLength = chars.length
  const chunks = []
  let chunk = ''

  for (let i = 0; i < words; i++) {
    const wordLength = Math.ceil(Math.random() * 10)
    for (let j = 0; j < wordLength; j++) {
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
    test('メガナイトありませんか？', {}, {
      text: '1 min read',
      words: 7,
      minutes: 1
    }))
})
