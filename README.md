# @benchristel/hypersearch

Instant search/filtering for Markdown documents and static webpages.

## Why

Perhaps you've created a static site with a Markdown-to-HTML generator like Hugo, Jekyll, or [mdsite](https://benchristel.github.io/mdsite/).

Perhaps you've got a page with a [curated list of links](https://waywardweb.org/how.html) - essentially a public bookmarks folder.

Perhaps you'd like to set that page as your homepage, so your awesome collection of bookmarks can be your portal to the entire web.

There's just one problem, though: the page isn't conveniently searchable. You're not going to click on any of the links you've so carefully curated if you have to scroll down the page and look at each one with your eyeballs.

**hypersearch solves that problem.**

## [Live Demo](https://benchristel.com/portal.html)

[Live demo on benchristel.com](https://benchristel.com/portal.html)

## How

```markdown
<script defer src="https://cdn.jsdelivr.net/npm/@benchristel/hypersearch@0.3.0"></script>
<input data-hypersearch type="search" placeholder="Search" />

<div data-hypersearch-start></div>

## Music

### Progressive Rock

- [Yes](#)
- [Genesis](#)
- [Jethro Tull](#)

...

<div data-hypersearch-end></div>
```

The elements between the `data-hypersearch-start` and `data-hypersearch-end` marker elements will get filtered when you type in the search field.

### Keywords

By default, hypersearch shows elements which:

- have `innerText` matching the search term.
- OR are under a heading whose `innerText` matches the search term.

Sometimes, though, searching by user-visible text isn't good enough. You might want
to customize the search keywords associated with an element, e.g. so users can search
for synonyms of the visible words.

To add search keywords to an element, add an `<hs-meta>` tag with a `keywords` attribute:

```markdown

- [Online Photo Editor](https://example.com/photos)
  <hs-meta keywords="picture image"></hs-meta>

```

## Development

You don't need to read this section unless you are working on hypersearch itself.

- Start the **dev server** by running `yarn dev`.
- **Tests** run in the browser.
- **Types** are checked by running `yarn tsc -w`.

### Releasing

Before you release, remember to manually update the version number referenced
in this README to the version you are about to release.

```bash
# builds the code, commits it, and tags the commit with the new version number
yarn version

git push && git push --tags
npm publish
```