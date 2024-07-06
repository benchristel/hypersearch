// HOM = "Heading Object Model"
// A document's HOM consists of:
// - non-title headings (h2 - h6)
// - the siblings of headings that are not lists (ol, ul)
// - the li children of ol and ul elements that are siblings of headings.

import {END_ATTRIBUTE, START_ATTRIBUTE} from "./magic-constants";
import {Search} from "./search/interface";

export function applySearch(search: Search, homElements: HomElement[]): void {
  homElements.forEach(el => el.updateVisibility(search))
}

export function homElements(dom: Element): HomElement[] {
  let domElements = dropAfterEndElement([...dom.querySelectorAll(getSearchableElementSelector(dom))])
  const homElements = domElements.flatMap(HomElement.make)
  associate(homElements)
  return homElements
}

export class HomElement {
  private ancestorHeadings: HomElement[] = [];
  private descendents: HomElement[] = [];
  private _inspectString: string;
  private _searchableText: string;
  private _lastSearch: null | Search = null;
  private _lastSearchMatched: boolean = false;

  constructor(private domElement: HTMLElement) {
    const cleanInnerText = removeSoftHyphens(domElement.innerText)
    this._searchableText = [
      cleanInnerText,
      keywords(domElement),
    ].filter(Boolean).join(" ")
    const tag = domElement.tagName.toLowerCase();
    this._inspectString = `${tag} ${cleanInnerText}`
  }

  static make(domElement: Node): HomElement[] {
    if (!(domElement instanceof HTMLElement)) {
      return []
    }
    
    return [new HomElement(domElement)];
  }

  addAncestorHeading(heading: HomElement): void {
    this.ancestorHeadings.push(heading)
    this._searchableText += " " + heading.searchableText()
  }

  addDescendent(item: HomElement): void {
    this.descendents.push(item)
  }

  updateVisibility(search: Search): void {
    this.domElement.style.display =
      this.shouldBeVisible(search) ? "" : "none"
  }

  shouldBeVisible(search: Search): boolean {
    return false
      || this.matches(search)
      || this.descendents.some(h => h.matches(search));
  }

  matches(search: Search): boolean {
    if (search !== this._lastSearch) {
      this._lastSearch = search
      this._lastSearchMatched = search.matches(this.searchableText())
    }
    
    return this._lastSearchMatched
  }

  headingLevel(): 0 | 1 | 2 | 3 | 4 | null {
    switch (this.domElement.tagName) {
      case "H2": return 0;
      case "H3": return 1;
      case "H4": return 2;
      case "H5": return 3;
      case "H6": return 4;
      default: return null;
    }
  }

  inspect(): string {
    return this._inspectString
  }

  searchableText(): string {
    return this._searchableText
  }
}

function getSearchableElementSelector(dom: Element) {
  const heading = "h2, h3, h4, h5, h6"
  // these are the non-heading, non-list block-level elements supported by markdown
  const block = "p, blockquote, pre, hr"
  const list = "ul, ol"
  const isStart = `[${START_ATTRIBUTE}]`
  const isEnd = `[${END_ATTRIBUTE}]`

  if (dom.querySelector(`${isStart}`)) {
    return `
      ${isStart},
      ${isEnd},
      ${isStart} ~ :is(${block}, ${heading}),
      ${isStart} ~ :is(${list}) > li
    `
  } else {
    return `
      ${heading},
      :is(${heading}) ~ :is(${block}),
      :is(${heading}) ~ :is(${list}) > li
    `
  }
}

function keywords(domElement: Element): string {
  return [...domElement.querySelectorAll("hs-meta[keywords]")]
    .map(el => el.getAttribute("keywords"))
    .join(" ")
}

function removeSoftHyphens(s: string): string {
  return s.replace(/\xAD/g, "")
}

function dropAfterEndElement(dom: Element[]): Element[] {
  const endIndex = dom.findIndex(el => el.getAttribute(END_ATTRIBUTE) != null)
  return dom.slice(0, endIndex !== -1 ? endIndex : dom.length)
}

function associate(hom: HomElement[]): void {
  const headings: [
    HomElement | null,
    HomElement | null,
    HomElement | null,
    HomElement | null,
    HomElement | null,
  ] = [null, null, null, null, null];
  const levels = headings.length;
  
  for (const el of hom) {
    const level = el.headingLevel()
    if (level != null) {
      // update the headings tuple
      headings[level] = el
      for (let i = level + 1; i < levels; i++) headings[i] = null;

      for (let i = level - 1; i >= 0; i--) {
        const ancestor = headings[i]
        if (ancestor != null) {
          ancestor.addDescendent(el)
          el.addAncestorHeading(ancestor)
        }
      }
    }
    else {
      // el is not a heading
      for (const heading of headings) if (heading != null) {
        heading.addDescendent(el)
        el.addAncestorHeading(heading)
      }
    }
  }
}