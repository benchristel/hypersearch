import {test, expect, equals} from "@benchristel/taste"
import {HomElement, homElements} from "./hom"
import {BagOfPrefixesSearch} from "./search/bag-of-prefixes-search"

test("an empty HOM", {
  "returns no results for an empty query"() {
    const html = ""
    const query = ""
    const expected = [] as string[]
    
    verifySearchResults(html, query, expected)
  },

  "returns no results for a nonempty query"() {
    const html = ""
    const query = "foo"
    const expected = [] as string[]

    verifySearchResults(html, query, expected)
  },
})

test("a HOM", {
  "returns everything for an empty query"() {
    const html = `
      <h2>Heading</h2>
      <p>paragraph</p>`
    const query = ""
    const expected = ["h2 Heading", "p paragraph"]
    
    verifySearchResults(html, query, expected)
  },

  "returns matching elements for a nonempty query"() {
    const html = `
      <h2>Heading</h2>
      <p>paragraph</p>
      <p>no match here</p>`
    const query = "par"
    const expected = ["h2 Heading", "p paragraph"]

    verifySearchResults(html, query, expected)
  },

  "returns no results for a query that matches nothing"() {
    const html = `
      <h2>Heading</h2>
      <p>paragraph</p>`
    const query = "foo"
    const expected = [] as string[]

    verifySearchResults(html, query, expected)
  },

  "includes an h3"() {
    const html = "<h3>Heading</h3>"
    const query = ""
    const expected = ["h3 Heading"]

    verifySearchResults(html, query, expected)
  },

  "includes an h4"() {
    const html = "<h4>Heading</h4>"
    const query = ""
    const expected = ["h4 Heading"]

    verifySearchResults(html, query, expected)
  },

  "includes an h5"() {
    const html = "<h5>Heading</h5>"
    const query = ""
    const expected = ["h5 Heading"]

    verifySearchResults(html, query, expected)
  },

  "includes an h6"() {
    const html = "<h6>Heading</h6>"
    const query = ""
    const expected = ["h6 Heading"]

    verifySearchResults(html, query, expected)
  },

  "includes a blockquote"() {
    const html = `
      <h2>Heading</h2>
      <blockquote>quote</blockquote>`
    const query = ""
    const expected = ["h2 Heading", "blockquote quote"]

    verifySearchResults(html, query, expected)
  },

  "includes a pre tag"() {
    const html = `
      <h2>Heading</h2>
      <pre>code</pre>`
    const query = ""
    const expected = ["h2 Heading", "pre code"]

    verifySearchResults(html, query, expected)
  },

  "includes an unordered list item"() {
    const html = `
      <h2>Heading</h2>
      <ul><li>item</li></ul>`
    const query = ""
    const expected = ["h2 Heading", "li item"]

    verifySearchResults(html, query, expected)
  },

  "includes an ordered list item"() {
    const html = `
      <h2>Heading</h2>
      <ol><li>item</li></ol>`
    const query = ""
    const expected = ["h2 Heading", "li item"]

    verifySearchResults(html, query, expected)
  },

  "groups nested lists under their parent list item"() {
    const html = `
      <h2>Heading</h2>
      <ol>
        <li><ol><li>one</li><li>two</li></ol></li>
      </ol>`
    const query = ""
    const expected = ["h2 Heading", "li onetwo"]

    verifySearchResults(html, query, expected)
  },

  "only shows the headings for sections with results"() {
    const html = `
      <h2>111</h2>
      <p>aaa</p>
      <h2>222</h2>
      <p>bbb</p>`
    const query = "b"
    const expected = ["h2 222", "p bbb"]

    verifySearchResults(html, query, expected)
  },

  "given a query that matches a section heading, shows content in that section"() {
    const html = `
      <h2>111</h2>
      <p>aaa</p>
      <p>bbb</p>`
    const query = "1"
    const expected = ["h2 111", "p aaa", "p bbb"]

    verifySearchResults(html, query, expected)
  },

  "given a query that matches a section heading, shows subsection headings"() {
    const html = `
      <h2>111</h2>
      <h3>222</h3>
      <p>aaa</p>`
    const query = "1"
    const expected = ["h2 111", "h3 222", "p aaa"]

    verifySearchResults(html, query, expected)
  },

  "given a query that matches a section heading, shows supersection headings"() {
    const html = `
      <h2>111</h2>
      <h3>222</h3>
      <p>aaa</p>`
    const query = "2"
    const expected = ["h2 111", "h3 222", "p aaa"]

    verifySearchResults(html, query, expected)
  },

  "only shows headings that are ancestors of a matching node"() {
    const html = `
      <h2>111</h2>
      <h3>222</h3>
      <h2>333</h2>
      <p>aaa</p>`
    const query = "a"
    const expected = ["h2 333", "p aaa"]

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