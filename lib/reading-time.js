/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict'

function checkIsCodeInRange(lowerBound, upperBound, number) {
  return (lowerBound <= number) & (number <= upperBound)
}

function isValidCJKCharacter(c) {
  if ('string' !== typeof c) {
    return false
  }
  const charCode = c.charCodeAt(0)
  return (
    // Ref: https://arxiv.org/pdf/1801.07779.pdf#page=5
    // Common CJK characters
    checkIsCodeInRange(12352, 12543, charCode) ||
    checkIsCodeInRange(19000, 44000, charCode)
  )
}

function cjkWordBound(c) {
  const charCode = c.charCodeAt(0)
  return (
    // CJK Symbols and Punctuation, U+3000 to U+303F
    checkIsCodeInRange(12288, 12351, charCode) ||
    // Full-width ASCII variants, U+FF01 to U+FF0F
    checkIsCodeInRange(65281, 65295, charCode) ||
    // Full-width brackets and half-width CJK punctuations, U+FF5F to U+FF64
    checkIsCodeInRange(65375, 65380, charCode)
  )
}

function ansiWordBound(c) {
  return (
    (' ' === c) ||
    ('\n' === c) ||
    ('\r' === c) ||
    ('\t' === c)
  )
}

function defaultWordBound(c) {
  // Explicit type check for black holes
  if ('string' !== typeof c) {
    return false
  }
  return ansiWordBound(c) || cjkWordBound(c)
}

function readingTime(text, options) {
  var words = 0, start = 0, end = text.length - 1, wordBound, i

  options = options || {}

  // use default values if necessary
  options.wordsPerMinute = options.wordsPerMinute || 200

  // use provided function if available
  wordBound = options.wordBound || defaultWordBound

  // fetch bounds
  while (wordBound(text[start])) start++
  while (wordBound(text[end])) end--

  // calculate the number of words
  for (i = start; i <= end;) {
    var containsCJKWord = false
    for (; i <= end && !wordBound(text[i]); i++) {
      if (isValidCJKCharacter(text[i])) {
        // avoid extra cjk character to be counted
        if (containsCJKWord) {
          words++
        }
        else {
          containsCJKWord = true
        }
      }
    }
    words++
    for (; i <= end && wordBound(text[i]); i++);
  }

  // reading time stats
  var minutes = words / options.wordsPerMinute
  // Math.round used to resolve floating point funkyness
  //   http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
  var time = Math.round(minutes * 60 * 1000)
  var displayed = Math.ceil(minutes.toFixed(2))

  return {
    text: displayed + ' min read',
    minutes: minutes,
    time: time,
    words: words
  }
}

/**
 * Export
 */
module.exports = readingTime
