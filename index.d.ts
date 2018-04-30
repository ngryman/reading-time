declare module "reading-time" {
  function readingTime(text: string): {
    text: string;
    time: number;
    words: number;
  };

  export = readingTime;
}
