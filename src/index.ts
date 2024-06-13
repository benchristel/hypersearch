import {applySearch, homElements} from "./hom";
import {BagOfWordsSearch} from "./search/bag-of-words-search";

export function init(search: HTMLInputElement, firstHeading: Node | null = null) {
  const hom = homElements(document.body)
  search.addEventListener("input", () => {
    const bagOfWords = new BagOfWordsSearch(search.value)
    applySearch(bagOfWords, hom)
  })
}