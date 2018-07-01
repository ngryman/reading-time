declare module "reading-time" {
  function readingTime(text: string): {
    text: string;
    time: number;
    words: number;
    minutes: number;
  };
  
  namespace readingTime {}

  export = readingTime;
}
