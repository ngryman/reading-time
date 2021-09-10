declare module 'reading-time' {
  import { Transform, TransformCallback } from 'stream'

  export interface Options {
    wordBound?: (char: string) => boolean;
    wordsPerMinute?: number;
  }

  export interface ReadTimeResults {
    text: string;
    time: number;
    words: number;
    minutes: number;
  }

  export class ReadingTimeStream extends Transform {
    stats: ReadTimeResults;
    options: Options;
    constructor(options?: Options);
    _transform: (chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) => void;
    _flush: (callback: TransformCallback) => void;
  }

  export default function readingTime(text: string, options?: Options): ReadTimeResults
}
