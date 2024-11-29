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

  "excludes block elements before the first heading from filtering"() {
    const html = `
      <p>before heading</p>
      <h2>Heading</h2>`
    const query = ""
    const expected = ["h2 Heading"]

    verifySearchResults(html, query, expected)
  },

  "only includes elements after an element with data-hypersearch-start if that is present"() {
    const html = `
      <h2>before</h2>
      <p>before</p>
      <ul><li>before</li></ul>
      <div data-hypersearch-start></div>
      <h2>after</h2>
      <p>after</p>
      <ul><li>after</li></ul>`
    const query = ""
    const expected = ["h2 after", "p after", "li after"]

    verifySearchResults(html, query, expected)
  },

  "excludes elements after an element with data-hypersearch-end"() {
    const html = `
      <div data-hypersearch-start></div>
      <p>before</p>
      <div data-hypersearch-end></div>
      <p>after</p>`
    const query = ""
    const expected = ["p before"]

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

  "searches by the combination of item text and heading text"() {
    const html = `
      <h2>heading</h2>
      <p>item</p>
      <p>not this one</p>`
    const query = "head it"
    const expected = ["h2 heading", "p item"]

    verifySearchResults(html, query, expected)
  },

  "strips a soft hyphen from HTML when searching"() {
    const html = `<h2></h2><p>foo&shy;bar</p>`
    const query = "foobar"
    const expected = ["h2 ", "p foobar"]

    verifySearchResults(html, query, expected)
  },

  "strips multiple soft hyphens from HTML when searching"() {
    const html = `<h2></h2><p>foo&shy;bar&shy;baz</p>`
    const query = "foobarbaz"
    const expected = ["h2 ", "p foobarbaz"]

    verifySearchResults(html, query, expected)
  },

  "finds an element by link href"() {
    const html = `<h2></h2><p><a href="foo">bar</a></p>`
    const query = "foo"
    const expected = ["h2 ", "p bar"]

    verifySearchResults(html, query, expected)
  },

  "finds an element by link domain"() {
    const html = `<h2></h2><p><a href="https://example.com">foo</a></p>`
    const query = "example.com"
    const expected = ["h2 ", "p foo"]

    verifySearchResults(html, query, expected)
  },

  "finds an element by hs-meta keywords (DEPRECATED 0.4.0)"() {
    const html = `
      <h2>Heading</h2>
      <p>foo<hs-meta keywords="blah"></hs-meta></p>`
    const query = "blah"
    const expected = ["h2 Heading", "p foo"]

    verifySearchResults(html, query, expected)
  },

  "finds an element by hs-meta keywords in the heading (DEPRECATED 0.4.0)"() {
    const html = `
      <h2>Heading<hs-meta keywords="blah"></hs-meta></h2>
      <p>foo</p>`
    const query = "blah"
    const expected = ["h2 Heading", "p foo"]

    verifySearchResults(html, query, expected)
  },

  "combines keywords from multiple hs-meta elements (DEPRECATED 0.4.0)"() {
    const html = `
      <h2>Heading<hs-meta keywords="blah"></hs-meta></h2>
      <p>foo<hs-meta keywords="bar"></hs-meta><hs-meta keywords="baz"></hs-meta></p>`
    const query = "blah bar baz"
    const expected = ["h2 Heading", "p foo"]

    verifySearchResults(html, query, expected)
  },

  "combines keywords from one hs-meta element (DEPRECATED 0.4.0)"() {
    const html = `
      <h2>Heading</h2>
      <p>foo<hs-meta keywords="bar baz"></hs-meta></p>`
    const query = "bar baz"
    const expected = ["h2 Heading", "p foo"]

    verifySearchResults(html, query, expected)
  },
})

test("homElements, without data-hypersearch-start,", {
  "includes an h2"() {
    const html = `
      <h2>heading</h2>
    `

    const expected = [
      "h2 heading",
    ]

    verifyHomElements(html, expected)
  },

  "includes list items after an h2"() {
    const html = `
      <h2>heading</h2>
      <ul>
        <li>first</li>
      <ul>
    `

    const expected = [
      "h2 heading",
      "li first",
    ]

    verifyHomElements(html, expected)
  },

  "includes list items after an h3"() {
    const html = `
      <h3>heading</h3>
      <ul>
        <li>first</li>
      <ul>
    `

    const expected = [
      "h3 heading",
      "li first",
    ]

    verifyHomElements(html, expected)
  },

  "doesn't include list items after an h1"() {
    const html = `
      <h1>heading</h1>
      <ul>
        <li>first</li>
      <ul>
    `

    const expected: string[] = []

    verifyHomElements(html, expected)
  },

  "excludes list items before any heading"() {
    const html = `
      <ul>
        <li>first</li>
      <ul>
      <h2>heading</h2>
    `

    const expected = [
      "h2 heading",
    ]

    verifyHomElements(html, expected)
  },

  "includes both ordered and unordered lists"() {
    const html = `
      <h2>heading</h2>
      <ul>
        <li>first</li>
      </ul>
      <ol>
        <li>second</li>
      </ol>
    `

    const expected = [
      "h2 heading",
      "li first",
      "li second",
    ]

    verifyHomElements(html, expected)
  },

  "includes paragraphs"() {
    const html = `
      <h2>heading</h2>
      <p>paragraph</p>
    `

    const expected = [
      "h2 heading",
      "p paragraph"
    ]

    verifyHomElements(html, expected)
  },

  "includes headings"() {
    const html = `
      <h2>first</h2>
      <h3>second</h3>
      <h4>third</h4>
      <h5>fourth</h5>
      <h6>fifth</h6>
    `

    const expected = [
      "h2 first",
      "h3 second",
      "h4 third",
      "h5 fourth",
      "h6 fifth",
    ]

    verifyHomElements(html, expected)
  },

  "includes blockquotes"() {
    const html = `
      <h2>heading</h2>
      <blockquote>quote</blockquote>
    `

    const expected = [
      "h2 heading",
      "blockquote quote",
    ]

    verifyHomElements(html, expected)
  },

  "includes <pre> tags"() {
    const html = `
      <h2>heading</h2>
      <pre>preformatted</pre>
    `

    const expected = [
      "h2 heading",
      "pre preformatted",
    ]

    verifyHomElements(html, expected)
  },

  "includes <hr> tags"() {
    const html = `
      <h2>heading</h2>
      <hr>
    `

    const expected = [
      "h2 heading",
      "hr ",
    ]

    verifyHomElements(html, expected)
  },

  "excludes p elements with the .hypersearch-no-results class"() {
    const html = `
      <h2>heading</h2>
      <p class="hypersearch-no-results">no results</p>
    `

    const expected = [
      "h2 heading",
    ]

    verifyHomElements(html, expected)
  },

  "excludes list items with the .hypersearch-no-results class"() {
    const html = `
      <h2>heading</h2>
      <ul>
        <li class="hypersearch-no-results">no results</li>
      </ul>
    `

    const expected = [
      "h2 heading",
    ]

    verifyHomElements(html, expected)
  },

  "excludes headings with the .hypersearch-no-results class"() {
    const html = `
      <h2 class="hypersearch-no-results">heading</h2>
    `

    const expected: string[] = []

    verifyHomElements(html, expected)
  },
})

function verifySearchResults(html: string, query: string, expected: string[]) {
  const hom = homElements(dom(html))
  expect(search(hom, query), equals, expected)
}

function verifyHomElements(html: string, expected: string[]) {
  const elements = homElements(dom(html)).map(h => h.inspect())
  expect(elements, equals, expected)
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