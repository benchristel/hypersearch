import {Search} from "./interface";
import {containsAtWordBoundary} from "./word-boundaries";

export class BagOfPrefixesSearch implements Search {
  private prefixes: string[]

  constructor(query: string) {
    this.prefixes = query.toLowerCase().split(/\s+/).filter(Boolean)
  }

  matches(s: string): boolean {
    if (s === "") {
      return false
    }
    const downcased = s.toLowerCase()
    return this.prefixes.every(prefix =>
      containsAtWordBoundary(prefix, downcased)
    )
  }
}
