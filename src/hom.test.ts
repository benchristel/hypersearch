import {test, expect, equals} from "@benchristel/taste"
import {HomElement, homElements} from "./hom"
import {BagOfPrefixesSearch} from "./search/bag-of-prefixes-search"

test("HOM", {
  "when empty, given an empty query"() {
    const html = ""
    const query = ""
    const expected = [] as string[]
    
    verifySearchResults(html, query, expected)
  },

  "when empty, given a nonempty query"() {
    const html = ""
    const query = "foo"
    const expected = [] as string[]

    verifySearchResults(html, query, expected)
  },

  "when nonempty, given an empty query"() {
    const html = "<h2>Heading</h2><p>paragraph</p>"
    const query = ""
    const expected = ["h2 Heading", "p paragraph"]
    
    verifySearchResults(html, query, expected)
  },

  "when nonempty, given a nonmatching query"() {
    const html = "<h2>Heading</h2><p>paragraph</p>"
    const query = "foo"
    const expected = [] as string[]

    verifySearchResults(html, query, expected)
  },
})

function verifySearchResults(html: string, query: string, expected: string[]) {
  const hom = homElements(dom(html))
  expect(search(hom, query), equals, expected)
}

function search(hom: HomElement[], query: string): string[] {
  const bagOfPrefixes = new BagOfPrefixesSearch(query)
  return hom.filter(h => h.shouldBeVisible(bagOfPrefixes)).map(h => h.inspect())
}

function dom(html: string) {
  const wrapper = document.createElement("div")
  wrapper.innerHTML = html
  return wrapper
}