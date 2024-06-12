export function isHeading(el: Node | null) {
  return el instanceof Element && (
    el.tagName === "H1" ||
    el.tagName === "H2" ||
    el.tagName === "H3" ||
    el.tagName === "H4" ||
    el.tagName === "H5" ||
    el.tagName === "H6"
  )
}

export function headingLevel(el: Node | null): number | null {
  if (!(el instanceof Element)) {
    return null;
  }

  const level = el.tagName.match(/H(\d)/)?.[1]
  return level ? +level : null
}

export function isHeadingAtLevelOrAbove(targetLevel: number | null, el: Node | null): boolean {
  const level = headingLevel(el)
  return level != null && targetLevel != null && level <= targetLevel;
}