# @benchristel/hypersearch

Instant search/filtering for static webpages.

## Why

Perhaps you've created a static site with a Markdown-to-HTML generator like Hugo, Jekyll, or mdsite.

Perhaps you've got a page with a [curated list of links](https://waywardweb.org/how.html) - essentially a public bookmarks folder.

Perhaps you'd like to set that page as your homepage, so your awesome collection of bookmarks can be your portal to the entire web.

There's just one problem, though: the page isn't conveniently searchable. You're not going to click on any of the links you've so carefully curated if you have to scroll down the page and look at each one with your eyeballs.

**hypersearch solves that problem.**

## Live Demo

[Live Demo](https://ben.waywardweb.org/)

## How

```markdown
<script defer src="https://cdn.jsdelivr.net/npm/@benchristel/hypersearch@0.0.2"></script>
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
