import {Search} from "./interface";

export class BagOfWordsSearch implements Search {
  private words: string[];

  constructor(query: string) {
    this.words = query.trim().toLowerCase().split(/\s+/)
  }

  matches(s: string): boolean {
    const downcased = s.toLowerCase()
    return this.words.every(word => downcased.includes(word))
  }
}