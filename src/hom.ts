// HOM = "Heading Object Model"
// A document's HOM consists of:
// - non-title headings (h2 - h6)
// - the siblings of headings that are not lists (ol, ul)
// - the li children of ol and ul elements that are siblings of headings.

interface Search {
  matches(s: string): boolean;
}

export class HomElement {
  private ancestorHeadings: HomElement[] = [];
  private descendentListItems: HomElement[] = [];
  private _innerText: null | string = null;
  private _lastSearch: null | Search = null;
  private _lastSearchMatched: boolean = false;

  constructor(private domElement: HTMLElement) {}

  static make(domElement: Node): HomElement[] {
    if (!(domElement instanceof HTMLElement)) {
      return []
    }
    
    return [new HomElement(domElement)];
  }

  addAncestorHeading(heading: HomElement): void {
    this.ancestorHeadings.push(heading)
  }

  addDescendentListItem(item: HomElement): void {
    this.descendentListItems.push(item)
  }

  updateVisibility(search: Search): void {
    const shouldBeVisible = false
      || this.matches(search) && this.isListItem()
      || this.ancestorHeadings.some(h => h.matches(search))
      || this.descendentListItems.some(h => h.matches(search));
    
    this.domElement.style.display = shouldBeVisible ? "initial" : "none"
  }

  matches(search: Search): boolean {
    if (search !== this._lastSearch) {
      this._lastSearch = search
      this._lastSearchMatched = search.matches(this.innerText())
    }
    
    return this._lastSearchMatched
  }

  isListItem(): boolean {
    return this.domElement.tagName === "LI"
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

  private innerText(): string {
    if (this._innerText == null) {
      this._innerText = this.domElement.innerText
    }
    
    return this._innerText
  }
}

export function applySearch(search: Search, homElements: HomElement[]): void {
  homElements.forEach(el => el.updateVisibility(search))
}

export function homElements(dom: Element): HomElement[] {
  const heading = "h2, h3, h4, h5, h6"
  // these are the non-heading, non-list block-level elements supported by markdown
  const block = "p, blockquote, pre, hr"
  const list = "ul, ol"
  const homElements = [
    ...dom.querySelectorAll(
      `${heading}, :is(${heading}) ~ :is(${block}), :is(${heading}) ~ :is(${list}) > li`,
    ),
  ].flatMap(HomElement.make)

  const headings: [
    HomElement | null,
    HomElement | null,
    HomElement | null,
    HomElement | null,
    HomElement | null,
  ] = [null, null, null, null, null];
  const levels = headings.length;
  
  for (const el of homElements) {
    const level = el.headingLevel()
    if (level != null) {
      // update the headings tuple
      headings[level] = el
      for (let i = level + 1; i < levels; i++) headings[i] = null;

      for (let i = level - 1; i >= 0; i--) {
        const ancestor = headings[i]
        if (ancestor != null) el.addAncestorHeading(ancestor)
      }
    }
    else {
      // el is not a heading
      for (const heading of headings) if (heading != null) {
        if (el.isListItem()) heading.addDescendentListItem(el)
        el.addAncestorHeading(heading)
      }
    }
  }

  return homElements
}
