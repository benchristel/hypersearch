export function addContentAttributes(root: Element): void {
  for (const el of root.querySelectorAll("h1, h2, h3, h4, h5, h6, :is(h1, h2, h3, h4, h5, h6) ~ :is(ul, ol) > li")) {
    el.setAttribute("data-quendingold-content", (el as any).innerText)
  }
}