/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict'

function isCodeInRange(lowerBound, upperBound, number) {
  return (lowerBound <= number) && (number <= upperBound)
}

function isCJK(c) {
  if ('string' !== typeof c) {
    return false
  }
  const charCode = c.charCodeAt(0)
  return (
    // Common CJK characters
    isCodeInRange(11905, 40960, charCode) ||
    // Full-width ASCII variants, U+FF01 to U+FF0F
    isCodeInRange(65281, 65295, charCode) ||
    // Full-width brackets and half-width CJK punctuations, U+FF5F to U+FF64
    isCodeInRange(65375, 65380, charCode)
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

function readingTime(text, options) {
  var words = 0, start = 0, end = text.length - 1, wordBound, i

  options = options || {}

  // use default values if necessary
  options.wordsPerMinute = options.wordsPerMinute || 200

  // use provided function if available
  wordBound = options.wordBound || ansiWordBound

  // fetch bounds
  while (wordBound(text[start])) start++
  while (wordBound(text[end])) end--

  // Add a trailing word bound to make handling edges more convenient
  text += '\n'

  // calculate the number of words
  for (i = start; i <= end; i++) {
    // A CJK character is a word;
    // A non-word bound followed by a word bound / CJK is the end of a word.
    if (isCJK(text[i]) || (!wordBound(text[i]) && (wordBound(text[i + 1]) || isCJK(text[i + 1])))) {
      words++
    }
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
