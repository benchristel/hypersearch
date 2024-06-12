export function sectionPageByHeading(headingLevel: number, firstNode: Node | null): void {
  const parent = firstNode?.parentNode
  let e = firstNode
  let group: Node[] = []

  function finishGroup() {
    if (isEmpty(group)) return;

    const section = document.createElement("section")
    parent?.insertBefore(section, group[0])
    for (const el of group) {
      section.appendChild(el)
    }
    
    if (headingLevel < 6) {
      sectionPageByHeading(headingLevel + 1, group[0])
    }
    
    group = []
  }

  function isHeading(el: Node | null) {
    return el instanceof Element && el.tagName === `H${headingLevel}`
  }
  
  while (e != null) {
    const next = e.nextSibling
    if (isHeading(e) || !isEmpty(group)) {
      group.push(e)
    }
    if (next == null || isHeading(next)) {
      finishGroup()
    }
    e = next
  }
}

function isEmpty(a: Array<unknown>): boolean {
  return a.length === 0
}