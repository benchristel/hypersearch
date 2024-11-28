import {Search} from "./interface";

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

function containsAtWordBoundary(needle: string, haystack: string): boolean {
  const foundIndex = haystack.indexOf(needle)
  return foundIndex === 0 || isWordBreakingChar(haystack[foundIndex - 1])
}

function isWordBreakingChar(c: string): boolean {
  return " \n\r\t`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?".includes(c)
}
