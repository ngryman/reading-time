/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

export type Options = {
  wordBound?: (char: string) => boolean;
  wordsPerMinute?: number;
  charsPerMinute?: number;
}

export type ReadingTimeStats = {
  time: number;
  minutes: number;
}

export type WordCountStats = {
  words: number;
  chars: number;
}

export type ReadingTimeResult = ReadingTimeStats & {
  counts: WordCountStats;
}
