# Website Handoff Notes

Single-page marketing site. Open `index.html` in a browser — no build step, no
dependencies to install. Upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel, Hostinger, shared hosting).

---

## 1. Read this first — four things still need your input

These are not bugs I can fix without information only you have.

### 1.1 The contact form does not send email ⚠️ most important

The form validates and shows a success message in the browser, but **nothing is
transmitted anywhere**. `index.html` has:

```html
<form action="#" method="post" id="fs-contact-form">
```

Until you connect a real endpoint, **every enquiry a visitor sends is silently
discarded**. Pick one:

| Option | What to do |
|---|---|
| **Formspree / Web3Forms / Basin** (easiest) | Create a free form, paste the endpoint URL into `action`, and add their hidden field |
| **Netlify Forms** | Add `netlify` to the `<form>` tag and `name="contact"` — no other change, works if hosted on Netlify |
| **Own PHP handler** | Point `action` at your `send.php`, which posts to `mail()` or SMTP |
| **Email only** | Set `action="mailto:hello@freelancestudio.com"` — works, but opens the visitor's mail app and is widely considered poor UX |

`js/custom.js` handles validation and the success/error message. If you switch to
a hosted service, remove or adapt `initContactForm()` so the success message is
not shown before the real request finishes.

### 1.2 Footer social links point at platform homepages

All five currently go to `facebook.com`, `twitter.com`, `behance.net`,
`dribbble.com`, `pinterest.com` — the homepages, not your accounts. Replace them
in `js/site-data.js`:

```js
socials: [
    { network: 'facebook',  label: 'Facebook',  url: 'https://facebook.com/YOUR-PAGE' },
    { network: 'twitter',   label: 'X',         url: 'https://x.com/YOUR-HANDLE' },
    // ... or delete entries you don't use
],
```

Icons are inlined SVG in `js/custom.js` (`SOCIAL_SVG`), so there is no icon-font
dependency. Exactly five networks have artwork available:

| `network` value | shows |
|---|---|
| `facebook` | Facebook |
| `twitter` | X / Twitter |
| `behance` | Behance |
| `dribbble` | Dribbble |
| `pinterest` | Pinterest |

Anything else — `instagram`, `linkedin`, `youtube`, `github`, `tiktok` — has no
SVG, so it renders as **no icon at all**. To add one, drop its SVG path into
`SOCIAL_SVG` in `js/custom.js` under the new key.

### 1.3 Portfolio captions are still the theme's demo text

The images are your photos, but the titles below them are placeholders from the
original theme — *Designers Tool Kit*, *Stamp*, *Jumper Font*, *Bag MockUp*,
*Delightful font*, *Ease UI Components*, *Hero – Mobile Mockup*,
*Colorfull app design*, *Bag design*, *Mock up for devices*.

Replace in **two** places so the page and the lightbox agree:
- `js/site-data.js` → `portfolio.items[].title`, `.sub`, `.desc`
- `index.html` → the matching `data-ph="portfolio.items.N.title"` etc. (the static
  fallback that shows if JavaScript is slow or blocked)

### 1.4 Placeholder business details

| Item | Current value | Action |
|---|---|---|
| Brand name | `Freelance Studio` | Change if that is not your trading name — `js/site-data.js` `footer.aboutTitle`, and `<title>` in `index.html` |
| Phone | `+ 1 703 4959 3452` | Theme demo number. Your real one — `js/site-data.js` `footer.phone` |
| Email | `hello@freelancestudio.com` | Keep or change — `js/site-data.js` `footer.email` **and** `footer.emailHref` |
| Copyright year | `2026` | Update each new year — `js/site-data.js` `footer.copyright` |

---

## 2. Also worth doing

**Social preview image.** `index.html` sets `og:title`, `og:description`,
`og:site_name` and `twitter:card`. Once the site is on a domain, add two more
lines in `<head>` or the link will show with no image when shared:

```html
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:image" content="https://yourdomain.com/share-image.jpg" />
```

Use a 1200×630 JPG under 300 KB.

**Portfolio images are heavy.** The ten files in `imgs/` are 1500px wide and
total about 3.5 MB. The tiles only ever display at 384 px, and because they are
CSS `background-image` they cannot lazy-load — all ten download on every visit.
Resizing them to 1000×1000 square crops would cut this to roughly 400 KB with no
visible loss. Free tools: squoosh.app, tinypng.com.

**`Template/slides/` is unused.** That folder holds 16 MB of slider images that
nothing on the page references any more. You can delete it to save space. Leave
the rest of `Template/` alone — the site depends on it.

---

## 3. How the site is put together

```
index.html              the whole page - single file, no templates
js/site-data.js    ◄──  ALL editable text lives here
js/custom.js           behaviour (see below)
css/custom.css          your styling on top of the theme
fonts/                 webfonts
imgs/                  your portfolio photos
Template/              THEME - do not edit or delete
```

### Where to change text

Almost every string on the page is driven by `js/site-data.js`, which is bound to
the HTML through `data-*` hooks:

```html
<p data-ph="portfolio.items.0.title">Designers Tool Kit</p>
```

```js
{ image: 'imgs/...', cats: 'agency branding', sub: '…', title: 'Designers Tool Kit', … }
```

Two hook styles:

| Hook | Does |
|---|---|
| `data-ph="a.b.c"` | sets the element's text |
| `data-ph-attr="href:a.b.c"` | sets an attribute |
| `data-ph-class="a.b.c"` | sets the class |
| `data-ph-lines="a.b"` | `"one\|two"` → two `<span>`s |

Because the HTML also contains the literal text, **update both** when you change
copy — the HTML is the fallback if JavaScript fails.

### `js/custom.js` — what it does

| Function | Job |
|---|---|
| `applySiteData()` | binds `js/site-data.js` to the `data-ph` hooks |
| `initScrollSpy()` | highlights the current section in the nav |
| `initPortfolioFilter()` | the All / Branding / Web Design / UI-UX / App Design filter |
| `initLightbox()` | click a portfolio tile to view it full size |
| `initContactForm()` | validation + success message (no backend — see 1.1) |
| `initCounters()` | animates the numbers in the About section |

`initLightbox()` reads the image from `portfolio.items[N].image`, which is why
that value must stay in step with the HTML.

---

## 4. Editing safely

- **Do not delete or move `Template/`.** It is the theme — every stylesheet,
  script and font the page needs. Losing it renders the site as unstyled text.
  (It was deleted once during this build and had to be recovered from the recycle
  bin. Nothing outside `Template/` duplicates it.)
- **Back up the folder before editing.** There is no version control in it.
- Keep paths relative — the site works from any folder or domain.
- `Template/index.html` is the theme's own file and is not used. Delete it if you
  like; the real page is the one at the root.

---

## 5. Browser support and accessibility

**What was actually tested:** Chrome (desktop, current version) at 375 / 480 /
768 / 1024 / 1280 / 1440 / 1920 px — no layout breaks, no failed asset
requests, no console errors. **Edge, Firefox and Safari have not been tested.**
They should be fine — the site uses no framework and only widely supported CSS —
but please confirm before launch. The theme's own CSS carries vendor prefixes and
IE fallbacks, so old browsers degrade rather than break.

Accessibility notes:
- Every `<img>` has an `alt` attribute; the purely decorative ones are `alt=""`
- Keyboard reachable, with visible focus states
- Text contrast was measured on the elements that were re-styled during the
  build (team bios, LinkedIn buttons, stat labels) and passes WCAG AA. It has
  not been audited across the whole inherited theme.

The portfolio photos are **WebP**. Every browser from 2020 onward supports them;
if you must support Internet Explorer 11, re-save them as JPG.