declare module 'reading-time' {
  import {Transform, TransformCallback} from 'stream';

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

  // Retrocompatibility
  export type IOptions = Options;
  export type IReadTimeResults = ReadTimeResults;

  export interface readingTimeStream extends Transform {
    stats: ReadTimeResults;
    options: Options;
    _transform: (chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) => void;
    _flush: (callback: TransformCallback) => void;
    (options: Options): ReadingTimeStream;
  }

  export default function readingTime(text: string, options?: Options): ReadTimeResults;
}

declare module 'reading-time/lib/stream' {
  import type {readingTimeStream} from 'reading-time';

  export default readingTimeStream;
}
