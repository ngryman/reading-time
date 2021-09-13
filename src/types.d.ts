declare module 'reading-time' {
  import { Transform, TransformCallback } from 'stream'

  export interface Options {
    wordBound?: (char: string) => boolean;
    wordsPerMinute?: number;
  }

  export interface ReadTimeResults {
    time: number;
    minutes: number;
  }

  export type WordCountResults = number;

  export class ReadingTimeStream extends Transform {
    stats: WordCountResults;
    options: Options;
    constructor(options?: Options);
    _transform: (chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) => void;
    _flush: (callback: TransformCallback) => void;
  }

  export function wordCount(text: string, options?: Options): WordCountResults
  export function readingTimeWithCount(words: WordCountResults, options?: Options): ReadTimeResults
  export default function readingTime(text: string, options?: Options): ReadTimeResults
}
