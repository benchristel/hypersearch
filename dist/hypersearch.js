const o = "data-hypersearch", d = "data-hypersearch-start", c = "data-hypersearch-end";
function h(t, e) {
  e.forEach((n) => n.updateVisibility(t));
}
function u(t) {
  const n = f([...t.querySelectorAll(m(t))]).flatMap(l.make);
  return g(n), n;
}
class l {
  constructor(e) {
    this.domElement = e, this.ancestorHeadings = [], this.descendents = [], this._innerText = null, this._lastSearch = null, this._lastSearchMatched = !1;
  }
  static make(e) {
    return e instanceof HTMLElement ? [new l(e)] : [];
  }
  addAncestorHeading(e) {
    this.ancestorHeadings.push(e);
  }
  addDescendent(e) {
    this.descendents.push(e);
  }
  updateVisibility(e) {
    this.domElement.style.display = this.shouldBeVisible(e) ? "" : "none";
  }
  shouldBeVisible(e) {
    return this.matches(e) || this.ancestorHeadings.some((n) => n.matches(e)) || this.descendents.some((n) => n.matches(e));
  }
  matches(e) {
    return e !== this._lastSearch && (this._lastSearch = e, this._lastSearchMatched = e.matches(this.innerText())), this._lastSearchMatched;
  }
  headingLevel() {
    switch (this.domElement.tagName) {
      case "H2":
        return 0;
      case "H3":
        return 1;
      case "H4":
        return 2;
      case "H5":
        return 3;
      case "H6":
        return 4;
      default:
        return null;
    }
  }
  inspect() {
    return `${this.domElement.tagName.toLowerCase()} ${this.innerText()}`;
  }
  innerText() {
    return this._innerText == null && (this._innerText = this.domElement.innerText), this._innerText;
  }
}
function m(t) {
  const e = "h2, h3, h4, h5, h6", n = "p, blockquote, pre, hr", i = "ul, ol", r = `[${d}]`, s = `[${c}]`;
  return t.querySelector(`${r}`) ? `
      ${r},
      ${s},
      ${r} ~ :is(${n}, ${e}),
      ${r} ~ :is(${i}) > li
    ` : `
      ${e},
      :is(${e}) ~ :is(${n}),
      :is(${e}) ~ :is(${i}) > li
    `;
}
function f(t) {
  const e = t.findIndex((n) => n.getAttribute(c) != null);
  return t.slice(0, e !== -1 ? e : t.length);
}
function g(t) {
  const e = [null, null, null, null, null], n = e.length;
  for (const i of t) {
    const r = i.headingLevel();
    if (r != null) {
      e[r] = i;
      for (let s = r + 1; s < n; s++)
        e[s] = null;
      for (let s = r - 1; s >= 0; s--) {
        const a = e[s];
        a != null && (a.addDescendent(i), i.addAncestorHeading(a));
      }
    } else
      for (const s of e)
        s != null && (s.addDescendent(i), i.addAncestorHeading(s));
  }
}
function p(t) {
  document.readyState !== "loading" ? setTimeout(t, 0) : document.addEventListener("DOMContentLoaded", t);
}
class E {
  constructor(e) {
    this.regexen = T(e.trim().toLowerCase()).split(/\s+/).map((n) => new RegExp("\\b" + n, "i"));
  }
  matches(e) {
    const n = e.toLowerCase();
    return this.regexen.every((i) => n.match(i));
  }
}
function T(t) {
  return t.replace(/[\^$\\.()*+|{}\[\]?]/g, "");
}
p($);
function $() {
  const t = document.querySelector(`input[${o}]`);
  if (t == null)
    return;
  const e = u(document.body);
  t.addEventListener("input", () => {
    const n = new E(t.value);
    h(n, e);
  });
}
