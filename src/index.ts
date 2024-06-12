import { addContentAttributes } from "./add-content-attributes";
import { sectionPageByHeading } from "./section-page";

export function init(search: HTMLInputElement, firstHeading: Node | null = null) {
  sectionPageByHeading(firstHeading)
  addContentAttributes(document.body)
  const style = document.createElement("style")
  document.head.appendChild(style)
  search.addEventListener("input", () => {
    const q = search.value
    const css = q
      ? `
        li[data-quendingold-content]:not([data-quendingold-content*="${q}" i]) {
          display: none;
        }
        `
      : ""
    
    style.innerText = css
  })
}