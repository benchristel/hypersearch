import {Search} from "./interface";

export class BagOfPrefixesSearch implements Search {
  private regexen: RegExp[];

  constructor(query: string) {
    this.regexen = removeRegexSpecialChars(query.trim().toLowerCase())
      .split(/\s+/)
      .map(word => new RegExp("\\b" + word, "i"))
  }

  matches(s: string): boolean {
    const downcased = s.toLowerCase()
    return this.regexen.every(re => downcased.match(re))
  }
}

function removeRegexSpecialChars(s: string) {
  return s.replace(/[\^$\\.()*+|{}\[\]?]/g, "")
}