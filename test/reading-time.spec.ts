/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

import readingTime, { Options, ReadingTimeResult } from '../src'
import chai from 'chai'

chai.should()

const test = (
  words: number | string,
  expect: Partial<ReadingTimeResult>,
  options?: Options,
  chars?: number | string
) =>
  (done: () => void) => {
    let text = ''
    text = 'number' === typeof words ? generateText(words) : words

    if (chars !== undefined) {
      text += generateText(0, chars)
    }

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
    if (expect.minutes) {
      res.should.have.property('minutes', expect.minutes)
    }
    if (expect.time) {
      res.should.have.property('time', expect.time)
    }
    if (expect.counts) {
      res.should.have.property('counts').to.deep.equal(expect.counts)
    }
    done()
  }

function generateText(words: number, chars?: number | string): string {
  let text = ''
  if (chars !== undefined) {
    if ('number' === typeof chars) {
      const cjkChars = '안녕하세요こんにちは你好你好吗'
      const cjkCharsLength = cjkChars.length
      for (let i = 0; i < chars; i++) {
        text += cjkChars[Math.floor(Math.random() * cjkCharsLength)]
      }
    }
    else {
      text += chars
    }
  }

  const latinChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâéèêôùûçÀÂÉÈÔÙÛÇ'
  const latinCharsLength = latinChars.length

  for (let i = 0; i < words; i++) {
    const wordLength = Math.ceil(Math.random() * 10)
    for (let j = 0; j < wordLength; j++) {
      text += latinChars[Math.floor(Math.random() * latinCharsLength)]
    }
    text += ' '
  }

  return text
}

describe('readingTime()', () => {
  it('should handle less than 1 minute text',
    test(2, {
      minutes: 1,
      time: 600
    }))

  it('should handle less than 1 minute text',
    test(50, {
      minutes: 1,
      time: 15000
    }))

  it('should handle 1 minute text',
    test(100, {
      minutes: 1,
      time: 30000
    }))

  it('should handle 2 minutes text',
    test(300, {
      minutes: 2,
      time: 90000
    }))

  it('should handle a very long text',
    test(500, {
      minutes: 3,
      time: 150000
    }))

  it('should handle text containing multiple successive whitespaces',
    test('word  word    word', {
      minutes: 1,
      time: 900
    }))

  it('should handle text starting with whitespaces',
    test('   word word word', {
      minutes: 1,
      time: 900
    }))

  it('should handle text ending with whitespaces',
    test('word word word   ', {
      minutes: 1,
      time: 900
    }))

  it('should handle text containing links',
    test('word http://ngryman.sh word', {
      minutes: 1,
      time: 1500
    }))

  it('should handle text containing markdown links',
    test('word [blog](http://ngryman.sh) word', {
      minutes: 1,
      time: 1800
    }))

  it('should handle text containing one word correctly',
    test('0', {
      minutes: 1,
      time: 300
    }))

  it('should handle text containing a black hole',
    test('', {
      minutes: 0,
      time: 0
    }))

  it('should accept a custom word per minutes value',
    test(200, {
      minutes: 2,
      time: 120000
    }, { wordsPerMinute: 100 }))
})

describe('readingTime CJK', () => {
  it('should handle less than 1 minute cjk paragraph',
    test(0, {
      minutes: 1,
      time: 12_000
    }, {}, 100))

  it('should handle 1 minute CJK paragraph',
    test(0, {
      minutes: 1,
      time: 60_000
    }, {}, 500))

  it('should handle 3 minute CJK paragraph',
    test(0, {
      minutes: 3,
      time: 180_000
    }, {}, 1500))

  it('should handle a long CJK paragraph',
    test(0, {
      minutes: 10,
      time: 600_000
    }, {}, 5000))

  it('should handle a short multi-language paragraph',
    test(500, {
      minutes: 4,
      time: 210_000
    }, {}, 500))

  it('should handle a long multi-language paragraph',
    test(500, {
      minutes: 13,
      time: 750_000
    }, {}, 5000))

  it('should handle Korean characters with punctuation',
    test(0, {
      minutes: 1,
      time: 1440
    }, {}, '수원, 언제나 우린 너와 함께 해!'))

  it('should handle Hiragana with punctuation',
    test(0, {
      minutes: 1,
      time: 4560
    }, {}, '三人寄れば文殊の知恵って言うだろ。みんなで考えれば、いい案が浮かぶかもしれないよ。'))

  it('should handle Chineses characters with punctuation',
    test(0, {
      minutes: 1,
      time: 3120
    }, {}, '请教别人一次是五分钟的傻子，从不请教别人是一辈子的傻子。'))

  it('should handle Korean characters with latin words',
    test(0, {
      minutes: 1,
      time: 3360 + 3900
    }, {},
    `"키스의 고유조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다" 
      is Korean version of "The quick brown fox jumps over the lazy dog"`
    ))

  it('should handle punctuations followed by words',
    test(`"키스의 고유조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다"
      is Korean version of "The quick brown fox jumps over the lazy dog"`, {
      counts: { words: 13, chars: 28 }
    }))

  it('should handle a CJK paragraph',
    test('今天，我要说中文！（没错，现在这个库也完全支持中文了）', {
      counts: { words: 0, chars: 22 }
    }))

  it('should handle a CJK paragraph with Latin words',
    test('你会说English吗？', {
      counts: { words: 1, chars: 4 }
    }))

  it('should handle a CJK paragraph with Latin punctuation',
    test('科学文章中, 经常使用英语标点... (虽然这段话并不科学)', {
      counts: { words: 0, chars: 22 }
    }))

  it('should handle a CJK paragraph starting and terminating in Latin words',
    test('JoshCena喜欢GitHub', {
      counts: { words: 2, chars: 2 }
    }))

  it('should handle a typical Korean paragraph',
    test('이것은 한국어 단락입니다', {
      counts: { words: 0, chars: 11 }
    }))

  it('should handle a typical Japanese paragraph',
    test('天気がいいから、散歩しましょう', {
      counts: { words: 0, chars: 14 }
    }))

  it('should treat Katakana as one word',
    test('メガナイトありませんか？', {
      counts: { words: 1, chars: 6 }
    }))

  it('should handle a very complex paragraph',
    test('"",안,녕1하!ad c, "세@ .. .. a 10 요...!', {
      counts: { words: 5, chars: 5 }
    }))
})
