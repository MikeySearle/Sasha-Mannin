# Sasha Mannin — ceramics

Plain HTML, CSS and JavaScript. No build step, nothing to install.

```
index.html            the landing page: hero, work, her profile, studio
contact.html          the enquiry page
assets/css/site.css   all styling, both pages
assets/js/site.js     masthead, reveals, the glaze filter
assets/js/contact.js  the enquiry form
assets/img/work/      the pots
assets/img/studio/    her portrait and the studio
```

## Preview it locally

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>.

## 1. Add the photographs

**This is the only thing standing between the site and being finished.**
Drop files in with these exact names and they appear on their own. Until then
each frame shows a tone from the palette and prints the filename it is waiting
for, so nothing ever renders as a broken image.

| File | What it is | Shape |
| --- | --- | --- |
| `assets/img/work/hero.jpg` | the piece that opens the site | landscape, 2400px wide |
| `assets/img/work/01.jpg` … `06.jpg` | the six pots in the grid | portrait or square, 1200px+ |
| `assets/img/studio/portrait.jpg` | Sasha | portrait, 1200px+ |
| `assets/img/studio/01–03.jpg` | wheel, glazing, kiln | square, 1200px+ |

Save as JPG at around 80% quality. Anything above about 2400px wide is wasted
weight on a phone.

## 2. Set the email address

Open `assets/js/contact.js` and put Sasha's address in `TO` at the top. Until
that is filled in the form **refuses to send** rather than losing an enquiry
quietly.

Left like that, sending opens the writer's own mail app addressed to her. For
enquiries to arrive on their own instead, get a free endpoint from
[formspree.io](https://formspree.io) or [web3forms.com](https://web3forms.com)
and paste it into `ENDPOINT`. Nothing else changes.

## 3. Replace the words

Every line that needs her voice is marked `<!-- REPLACE: ... -->` in the HTML.
The placeholder copy is written to the right length — swap the words, keep the
shape. The pieces most worth her own writing:

- the one line over the hero
- the three paragraphs in **The potter**
- the pull-quote under them
- the studio location on the enquiry page

## Everyday edits

**Add or change a pot.** Copy one `<article class="piece">` block in
`index.html` and change the image `src`, the name, the price and the meta line.

Two attributes control the layout: `--span` is how many of the twelve columns
it fills, `--push` is how far it sits down the page in pixels. Keep each row's
spans adding to twelve or less or the piece wraps to a new row. On phones the
grid collapses to one column and both are ignored.

`data-tone` decides which **glaze filter** the piece belongs to — `bone`,
`clay`, `earth` or `slate`. It must match one of the filter buttons above the
grid.

**Change the colours.** All five live at the top of `assets/css/site.css` as
`--ink`, `--slate`, `--bone`, `--clay` and `--earth`. Change them there and
they change everywhere.

## Publishing

Push to `main`, then Settings → Pages → Deploy from branch → `main` / root.
For a custom domain, add a `CNAME` file containing the domain, point the DNS
at GitHub Pages, and tick *Enforce HTTPS*.
