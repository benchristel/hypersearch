import {applySearch, homElements} from "./hom";
import {SEARCHBAR_ATTRIBUTE} from "./magic-constants";
import {BagOfPrefixesSearch} from "./search/bag-of-prefixes-search";

export function init() {
  const search: HTMLInputElement | null = document.querySelector(`input[${SEARCHBAR_ATTRIBUTE}]`)
  if (search == null) return;

  const hom = homElements(document.body)
  search.addEventListener("input", () => {
    const bagOfPrefixes = new BagOfPrefixesSearch(search.value)
    applySearch(bagOfPrefixes, hom)
  })
}