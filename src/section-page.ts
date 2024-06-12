import {isHeading, headingLevel, isHeadingAtLevelOrAbove} from "./lib/dom";

// TODO: remove unused first parameter
export function sectionPageByHeading(_: number, firstNode: Node | null): void {
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
    
    if (group.slice(1).some(isHeading)) {
      sectionPageByHeading(0, group[1])
    }
    
    group = []
  }

  while (e != null) {
    const next = e.nextSibling
    if (isHeading(e) || !isEmpty(group)) {
      group.push(e)
    }
    if (next == null || isHeadingAtLevelOrAbove(headingLevel(group[0]), next)) {
      finishGroup()
    }
    e = next
  }
}

function isEmpty(a: Array<unknown>): boolean {
  return a.length === 0
}

