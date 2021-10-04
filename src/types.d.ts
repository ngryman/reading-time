declare module 'reading-time' {
  import { Transform, TransformCallback } from 'stream'

  export type Options = {
    wordBound?: (char: string) => boolean;
    wordsPerMinute?: number;
  }

  export type ReadingTimeStats = {
    time: number;
    minutes: number;
  }

  export type WordCountStats = {
    total: number;
  }

  export class ReadingTimeStream extends Transform {
    stats: WordCountStats;
    options: Options;
    constructor(options?: Options);
    _transform: (chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) => void;
    _flush: (callback: TransformCallback) => void;
  }

  export type ReadingTimeResult = ReadingTimeStats & {
    words: WordCountStats;
  }

  export function countWords(text: string, options?: Options): WordCountStats
  export function readingTimeWithCount(words: WordCountStats, options?: Options): ReadingTimeStats
  export default function readingTime(text: string, options?: Options): ReadingTimeResult
}
