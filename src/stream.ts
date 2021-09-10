/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

import readingTime from './reading-time'
import { Transform, TransformCallback } from 'stream'
import type { Options, ReadTimeResults } from 'reading-time'

class ReadingTimeStream extends Transform {
  options: Options;
  stats: ReadTimeResults;

  constructor(options: Options = {}) {
    super({ objectMode: true })

    this.options = options
    this.stats = {
      text: '',
      minutes: 0,
      time: 0,
      words: 0
    }
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
    const stats = readingTime(chunk.toString(encoding), this.options)

    this.stats.minutes += stats.minutes
    this.stats.time += stats.time
    this.stats.words += stats.words

    callback()
  }

  _flush(callback: TransformCallback): void {
    this.stats.text = Math.ceil(parseFloat(this.stats.minutes.toFixed(2))) + ' min read'

    this.push(this.stats)
    callback()
  }
}

export default ReadingTimeStream
