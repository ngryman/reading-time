declare module 'reading-time' {
  export interface IOptions {
    wordBound?: (char: string) => boolean;
    wordsPerMinute?: number;
  }

  export interface IReadTimeResults {
    text: string;
    time: number;
    words: number;
    minutes: number;
  }

  function readingTime(text: string, options?: IOptions): IReadTimeResults;

  namespace readingTime {}

  export = readingTime;
}
