/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

import { countWords } from './reading-time'
import { Transform, TransformCallback } from 'stream'
import type { Options, WordCountStats } from 'reading-time'

class ReadingTimeStream extends Transform {
  options: Options;
  stats: WordCountStats;

  constructor(options: Options = {}) {
    super({ objectMode: true })

    this.options = options
    this.stats = { total: 0 }
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
    const stats = countWords(chunk.toString(encoding), this.options)
    this.stats.total += stats.total
    callback()
  }

  _flush(callback: TransformCallback): void {
    this.push(this.stats)
    callback()
  }
}

export default ReadingTimeStream
