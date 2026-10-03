# Freelance Studio — agency site

A single-page marketing site for a two-person design studio, built as a
spec/practice piece. Strategy, copy, responsive behaviour and a lightbox-driven
portfolio grid, sitting on top of a licensed WordPress theme that I converted to
a static page.

**~2,900 lines of hand-written HTML, CSS and JavaScript** across six files, with
no framework, no build step and no runtime dependencies.

| | |
|---|---|
| Stack | HTML5, CSS3, vanilla JS (ES5-compatible) |
| Build step | none — open `index.html` |
| Dependencies | none |
| Tested | Chrome, 375 → 1920 px, 0 console errors, 64/64 assets resolve |

---

## ⚠️ The theme is not in this repo

The base theme is **Barrel**, a commercial WordPress theme from
ThemeForest/Envato. Its license does not allow the theme source to be
redistributed, so `Template/` (130 files, 6.8 MB) is `.gitignore`d.

**A fresh clone will not render** — `index.html` depends on 14 stylesheets and
20+ scripts under `Template/`. What is committed here is the part I wrote: the
markup, the copy system, the behaviour layer and the styling. See
[Running it locally](#running-it-locally).

This is deliberate. A public repo containing someone else's paid theme would be
redistribution, not a portfolio piece.

---

## Screens

<!-- Add your own screenshots here, e.g.
![Desktop](docs/screenshot-desktop.png)
A `docs/` folder at the repo root works well. Keep them under ~1 MB each. -->

---

## What I built

The theme supplied page furniture. Everything below is the actual work.

### A copy system with one source of truth

Every editable string on the page lives in **`js/site-data.js`** (199 lines) and
is bound to the markup through `data-*` hooks:

```html
<p data-ph="portfolio.items.0.title">Designers Tool Kit</p>
```

```js
{ image: 'imgs/…', cats: 'agency branding', sub: 'Agency / Branding',
  title: 'Designers Tool Kit', desc: 'Special mockup' }
```

Four hook styles — `data-ph` (text), `data-ph-attr` (attribute),
`data-ph-class` (class), `data-ph-lines` (`"a|b"` → two `<span>`s). A 119-hook
audit asserts every hook resolves to a real key, so a typo or a deleted key
fails loudly instead of silently blanking the page.

Text is centralised because the page is edited by non-developers.

### Behaviour

`js/custom.js` (737 lines) — all of it mine, no jQuery dependency:

| | |
|---|---|
| `applySiteData()` | binds `site-data.js` to the DOM hooks |
| `initScrollSpy()` | highlights the active section in the nav |
| `initPortfolioFilter()` | animated category filter over the grid |
| `initLightbox()` | click-to-enlarge, keyboard-dismissable |
| `initContactForm()` | client-side validation + status messaging |
| `initCounters()` | animates the About-section statistics |
| `initSmoothScroll()`, `initMobileMenu()`, `initRevealGuard()` | navigation and scroll behaviour |

`initRevealGuard()` is the one worth calling out: scroll-triggered reveals
routinely leave content permanently invisible if the observer fires before
fonts or images settle. It force-reveals anything still hidden after load, so
content can never be trapped behind a failed animation.

### Styling

`css/custom.css` (839 lines) layers on top of the theme without fighting it —
the team card photo frame, bio typography, footer alignment, responsive tweaks.

One trap worth recording: the theme's skin file re-themes
`.mgt-style-bordered` to gold at a specificity that beats any single custom
class. The fix was to use the theme's *other* button variant
(`mgt-style-borderedblack`) rather than escalating to `!important`.

### Two repairs the static export forced

Converting a WordPress theme to static files breaks two things, and both fixes
are small enough to be worth pointing at:

- **`css/fonts.css` — webfont repair.** The export ships every `@font-face` rule
  but only 2 of the actual font binaries, so all the icon fonts render as tofu
  boxes. This re-declares the missing `@font-face` rules to point at local
  copies. It is loaded *after* the theme CSS deliberately — loaded before, the
  theme's broken rules win on order.
- **`js/vendor-shims.js` — select2 no-op.** The theme's `template.js` calls
  `$("select").select2({...})` unconditionally on ready, but the bundled select2
  is a dead stub, which throws. Registering a chainable no-op before `template.js`
  loads keeps the console clean.

---

## Running it locally

1. Get your own licensed copy of the Barrel theme and unzip it here as
   `./Template/`
2. Serve the folder over HTTP (the site uses relative paths only, so it works
   from any subdirectory or domain):

   ```bash
   npx serve .
   # or:  python -m http.server 8000
   ```

3. Open the printed URL

Then edit `js/site-data.js` — that is the whole content layer.

---

## Honest limitations

Things I did not fix, and why.

- **The contact form has no backend.** It validates and shows a success message,
  but `action="#"` means submissions go nowhere. Wiring it to Formspree, Netlify
  Forms or a PHP handler is a one-line change — see `HANDOFF.md` §1.1.
- **Portfolio captions are the theme's demo text** (*Designers Tool Kit*,
  *Jumper Font*). The images are real; the titles are placeholders waiting on
  copy.
- **Footer social links point at platform homepages**, not real accounts.
- **The portfolio images total 3.5 MB.** They are CSS `background-image`s, which
  cannot lazy-load, so all ten download on first paint. Resizing to 1000×1000
  would cut that to roughly 400 KB with no visible loss.
- **Only Chrome was tested.** No layout breaks or console errors at seven widths,
  but Edge, Firefox and Safari are unverified.

`HANDOFF.md` covers all of these in more detail, along with the content keys that
need replacing.

---

## Credits

- Base theme: [Barrel](https://themeforest.net/) by Select Themes, via
  ThemeForest/Envato — licensed, not redistributed here.
- `css/animate.css` is the [animate.css](https://animate.style/) library
  (Daniel Hedenström, MIT), bundled with the theme. Included under the MIT
  licence; not my code.
- `fonts/` holds the webfont binaries referenced by `css/fonts.css`.
- Photography: [Pexels](https://www.pexels.com/) (Pexels licence). Original
  filenames are preserved in `imgs/` so attribution stays traceable.
- Icons: inline SVG in `js/custom.js`; the theme's Font Awesome brand glyphs were
  replaced because that webfont is absent from a static export.
