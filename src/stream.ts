/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

import { wordCount } from './reading-time'
import { Transform, TransformCallback } from 'stream'
import type { Options, WordCountStats } from 'reading-time'

class ReadingTimeStream extends Transform {
  options: Options;
  stats: WordCountStats;

  constructor(options: Options = {}) {
    super({ objectMode: true })

    this.options = options
    this.stats = 0
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
    const stats = wordCount(chunk.toString(encoding), this.options)
    this.stats += stats
    callback()
  }

  _flush(callback: TransformCallback): void {
    this.push(this.stats)
    callback()
  }
}

export default ReadingTimeStream
