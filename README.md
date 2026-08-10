# RegBox — "The Manifest" (v2)

A homepage-and-site redesign concept for [regbox.co.uk](https://www.regbox.co.uk/), staged here for review.

Static HTML/CSS/vanilla JS, no build step, no framework. A ticket/departures-board design system — near-black ground, phosphor-green signal colour, split-flap and boarding-record motifs — matching the live site's real navigation, product pages and content.

## Structure

- `index.html` — homepage
- `event-registration/`, `event-deck/`, `marketing-automation/`, `digital-solutions/`, `online-exhibitor-manual/`, `exhibitor-marketing/`, `contact-us/` — interior pages, generated from `tools/build-pages.mjs`
- `assets/css/style.css`, `assets/js/site.js` — the whole design system and its motion
- `robots.txt`, `sitemap.xml` — indexability

## Editing interior pages

`index.html` is hand-maintained. The seven interior pages are generated so the shared manifest bar/header/footer/nav live in one place:

```bash
node tools/build-pages.mjs
```

## Local preview

Any static file server works, e.g.:

```bash
python -m http.server 4173
```
