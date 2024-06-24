import {applySearch, homElements} from "./hom";
import {onDomContentLoaded} from "./lib/browser";
import {SEARCHBAR_ATTRIBUTE} from "./magic-constants";
import {BagOfPrefixesSearch} from "./search/bag-of-prefixes-search";

onDomContentLoaded(init)

function init() {
  const search: HTMLInputElement | null = document.querySelector(`input[${SEARCHBAR_ATTRIBUTE}]`)
  if (search == null) return;

  const hom = homElements(document.body)
  const runSearch = () => {
    const bagOfPrefixes = new BagOfPrefixesSearch(search.value)
    applySearch(bagOfPrefixes, hom)
  }

  runSearch()

  search.addEventListener("input", runSearch)
}
