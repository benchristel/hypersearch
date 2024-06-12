import {test, expect, is} from "@benchristel/taste"
import { sectionPageByHeading } from "./section-page"

test("sectionPageByHeading", {
  "makes no changes when there are no headings"() {
    const root = document.createElement("div")
    root.innerHTML = "<p>wow</p>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<p>wow</p>")
  },

  "wraps a lone h1 in a <section>"() {
    const root = document.createElement("div")
    root.innerHTML = "<h1>heading</h1>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<section><h1>heading</h1></section>")
  },

  "includes a paragraph after the h1 in the section"() {
    const root = document.createElement("div")
    root.innerHTML = "<h1>heading</h1><p>para</p>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<section><h1>heading</h1><p>para</p></section>")
  },

  "does not include a paragraph before the h1 in the section"() {
    const root = document.createElement("div")
    root.innerHTML = "<p>para</p><h1>heading</h1>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<p>para</p><section><h1>heading</h1></section>")
  },

  "puts each successive h1 in its own section"() {
    const root = document.createElement("div")
    root.innerHTML = "<h1>first</h1><p>one</p><h1>second</h1><p>two</p>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<section><h1>first</h1><p>one</p></section><section><h1>second</h1><p>two</p></section>")
  },

  "recurses"() {
    const root = document.createElement("div")
    root.innerHTML = "<h1>first</h1><h2>second</h2>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<section><h1>first</h1><section><h2>second</h2></section></section>")
  },

  "wraps h2s when there are no h1s"() {
    const root = document.createElement("div")
    root.innerHTML = "<h2>hello</h2>"
    sectionPageByHeading(1, root.firstChild)
    expect(root.innerHTML, is, "<section><h2>hello</h2></section>")
  },
})
