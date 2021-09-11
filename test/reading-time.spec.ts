/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

import readingTime from '../src'
import chai from 'chai'
import { Options, ReadTimeResults } from 'reading-time'

chai.should()

const test = (words: number | string, expect: Partial<ReadTimeResults>, options?: Options) =>
  (done: () => void) => {
    const text = 'number' === typeof words ? generateText(words) : words

    if ('string' === typeof words) {
      if (text.includes(' ')) {
        words = words.split(/.+ +.+/g).length + 1
      }
      else if (text.length > 0) {
        words = 1
      }
      else {
        words = 0
      }
    }

    const res = readingTime(text, options)
    if (expect.text) {
      res.should.have.property('text', expect.text)
    }
    res.should.have.property('words', expect.words ?? words)
    if (expect.time) {
      res.should.have.property('time', expect.time)
    }
    done()
  }

function generateText(words: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ'
  const charsLength = chars.length
  let text = ''

  for (let i = 0; i < words; i++) {
    const wordLength = Math.ceil(Math.random() * 10)
    for (let j = 0; j < wordLength; j++) {
      text += chars[Math.floor(Math.random() * charsLength)]
    }
    text += ' '
  }

  return text
}

describe('readingTime()', () => {
  it('should handle less than 1 minute text',
    test(2, {
      text: '1 min read',
      time: 600
    }))

  it('should handle less than 1 minute text',
    test(50, {
      text: '1 min read',
      time: 15000
    }))

  it('should handle 1 minute text',
    test(100, {
      text: '1 min read',
      time: 30000
    }))

  it('should handle 2 minutes text',
    test(300, {
      text: '2 min read',
      time: 90000
    }))

  it('should handle a very long text',
    test(500, {
      text: '3 min read',
      time: 150000
    }))

  it('should handle text containing multiple successive whitespaces',
    test('word  word    word', {
      text: '1 min read',
      time: 900
    }))

  it('should handle text starting with whitespaces',
    test('   word word word', {
      text: '1 min read',
      time: 900
    }))

  it('should handle text ending with whitespaces',
    test('word word word   ', {
      text: '1 min read',
      time: 900
    }))

  it('should handle text containing links',
    test('word http://ngryman.sh word', {
      text: '1 min read',
      time: 900
    }))

  it('should handle text containing markdown links',
    test('word [blog](http://ngryman.sh) word', {
      text: '1 min read',
      time: 900
    }))

  it('should handle text containing one word correctly',
    test('0', {
      text: '1 min read',
      time: 300
    }))

  it('should handle text containing a black hole',
    test('', {
      text: '0 min read',
      time: 0
    }))

  it('should accept a custom word per minutes value',
    test(200, {
      text: '2 min read',
      time: 120000
    }, { wordsPerMinute: 100 }))
})

describe('readingTime CJK', () => {
  it('should handle a CJK paragraph',
    test('今天，我要说中文！（没错，现在这个库也完全支持中文了）', {
      words: 22
    }))

  it('should handle a CJK paragraph with Latin words',
    test('你会说English吗？', {
      words: 5
    }))

  it('should handle a CJK paragraph with Latin punctuation',
    test('科学文章中, 经常使用英语标点... (虽然这段话并不科学)', {
      words: 22
    }))

  it('should handle a CJK paragraph starting and terminating in Latin words',
    test('JoshCena喜欢GitHub', {
      words: 4
    }))

  it('should handle a typical Korean paragraph',
    test('이것은 한국어 단락입니다', {
      words: 11
    }))

  it('should handle a typical Japanese paragraph',
    test('天気がいいから、散歩しましょう', {
      words: 14
    }))

  it('should treat Katakana as one word',
    test('メガナイトありませんか？', {
      words: 7
    }))
})
