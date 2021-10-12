/*!
 * reading-time
 * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

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

export type ReadingTimeResult = ReadingTimeStats & {
  words: WordCountStats;
}
