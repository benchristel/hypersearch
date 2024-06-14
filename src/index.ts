import {applySearch, homElements} from "./hom";
import {BagOfPrefixesSearch} from "./search/bag-of-prefixes-search";

export function init() {
  const search: HTMLInputElement | null = document.querySelector("input[data-quendingold]")
  if (search == null) return;

  const hom = homElements(document.body)
  search.addEventListener("input", () => {
    const bagOfPrefixes = new BagOfPrefixesSearch(search.value)
    applySearch(bagOfPrefixes, hom)
  })
}