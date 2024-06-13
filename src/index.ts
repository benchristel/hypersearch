import {applySearch, homElements} from "./hom";
import {BagOfPrefixesSearch} from "./search/bag-of-prefixes-search";

export function init(search: HTMLInputElement, firstHeading: Node | null = null) {
  const hom = homElements(document.body)
  search.addEventListener("input", () => {
    const bagOfWords = new BagOfPrefixesSearch(search.value)
    applySearch(bagOfWords, hom)
  })
}