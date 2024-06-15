export function onDomContentLoaded(cb: () => unknown) {
  if (document.readyState !== "loading") {
    // already loaded; see https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
    
    // Set a timeout so as not to release Zalgo.
    // see: https://blog.izs.me/2013/08/designing-apis-for-asynchrony/
    setTimeout(cb, 0)
  } else {
    document.addEventListener("DOMContentLoaded", cb);
  }
}
