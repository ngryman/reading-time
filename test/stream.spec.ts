/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

import { ReadingTimeStream } from '../src'
import chai from 'chai'
import { Options, WordCountResults } from 'reading-time'

chai.should()

const test = (words: number | string, expect: WordCountResults, options?: Options) =>
  (done: () => void) => {
    const chunks = 'number' === typeof words ? generateChunks(words) : [Buffer.from(words)]

    if ('string' === typeof words) {
      if (words.includes(' ')) {
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
    analyzer.on('data', (res) => {
      res.should.equal(expect)
      done()
    })

    chunks.forEach(chunk => analyzer.write.bind(analyzer)(chunk, 'utf8'))
    analyzer.end()
  }

function generateChunks(words: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ'
  const charsLength = chars.length
  const chunks: string[] = []
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

  return chunks.map((chunk) => Buffer.from(chunk))
}

describe('readingTime stream', () => {
  it('should handle less than 1 minute text',
    test(2, 2))

  it('should handle less than 1 minute text',
    test(50, 50))

  it('should handle 1 minute text',
    test(100, 100))

  it('should handle 2 minutes text',
    test(300, 300))

  it('should handle a very long text',
    test(500, 500))

  it('should handle text containing multiple successive whitespaces',
    test('word  word    word', 3))

  it('should handle text starting with whitespaces',
    test('   word word word', 3))

  it('should handle text ending with whitespaces',
    test('word word word   ', 3))

  it('should handle text containing links',
    test('word http://ngryman.sh word', 3))

  it('should handle text containing markdown links',
    test('word [blog](http://ngryman.sh) word', 3))

  it('should handle text containing one word correctly',
    test('0', 1))

  it('should handle text containing a black hole',
    test('', 0))

  it('should accept a custom word per minutes value',
    test(200, 200, { wordsPerMinute: 100 }))
})

describe('readingTime stream CJK', () => {
  it('should handle a CJK paragraph',
    test('今天，我要说中文！（没错，现在这个库也完全支持中文了）', 22))

  it('should handle a CJK paragraph with Latin words',
    test('你会说English吗？', 5))

  it('should handle a CJK paragraph with Latin punctuation',
    test('科学文章中, 经常使用英语标点... (虽然这段话并不科学)', 22))

  it('should handle a CJK paragraph starting and terminating in Latin words',
    test('JoshCena喜欢GitHub', 4))

  it('should handle a typical Korean paragraph',
    test('이것은 한국어 단락입니다', 11))

  it('should handle a typical Japanese paragraph',
    test('天気がいいから、散歩しましょう', 14))

  it('should treat Katakana as one word',
    test('メガナイトありませんか？', 7))
})
