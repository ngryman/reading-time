/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */
var readingTime = require('./reading-time')
var Transform = require('stream').Transform
var util = require('util')

function ReadingTimeStream(options) {
  // allow use without new
  if (!(this instanceof ReadingTimeStream)) {
    return new ReadingTimeStream(options)
  }

  Transform.call(this, { objectMode: true })

  this.options = options || {}
  this.stats = {
    minutes: 0,
    time: 0,
    words: 0
  }
}
util.inherits(ReadingTimeStream, Transform)

ReadingTimeStream.prototype._transform = function(chunk, encoding, callback) {
  this.options.wordBound = Buffer.isBuffer(chunk) ?
    this.options.wordBound : undefined

  var stats = readingTime(chunk, this.options)

  this.stats.minutes += stats.minutes
  this.stats.time += stats.time
  this.stats.words += stats.words

  callback()
}

ReadingTimeStream.prototype._flush = function(callback) {
  this.stats.text = Math.ceil(this.stats.minutes.toFixed(2)) + ' min read'

  this.push(this.stats)
  callback()
}

/**
 * Export
 */
module.exports = ReadingTimeStream
