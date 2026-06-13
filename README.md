# JoyDa — Where Learning Feels Like Play

A modern, light-themed marketing site for **JoyDa**, a gameplay-first
learning platform for kids. Built with vanilla HTML / CSS / JS plus a
**Three.js** hero background featuring a soft pastel solar family
(sun + 4 planets, one with rings) and floating math / physics solids
(cone, tetrahedron, icosahedron, torus, octahedron, dodecahedron, cube,
torus-knot) that drift gently behind the headline.

The page mirrors the section structure of the reference site
[doc-model-site.preview.emergentagent.com](https://doc-model-site.preview.emergentagent.com/):

1. Sticky pill navigation (Home, Game Worlds, For Parents, For Schools, Demo, About)
2. Hero with floating chips + 3D background + 3 CTAs + game-world preview cards
3. **Why JoyDa** — "Play First. Learn Naturally." (3 cards)
4. **Skill Development** — "Beyond Marks. Beyond Memorisation." (4 cards)
5. **Game Worlds** — Astro Rescue, Temple Escape, Mystery Manor, Alphabet Pop
6. **For Parents** — copy + parent dashboard mock (Aanya, Age 8)
7. **For Schools** — teacher dashboard mock (Class 5-B) + copy
8. **Final CTA** — "Stories. Skills. Subjects. Exploration."
9. Footer

## Project structure

```
jyodawebsitenew/
├── index.html
├── README.md
└── assets/
    ├── css/style.css        # Design tokens, layout, components
    └── js/
        ├── three.scene.js   # Pastel Three.js hero (ES module)
        └── main.js          # Nav toggle, smooth scroll, reveal, counters
```

## Run it (XAMPP)

The project lives in `c:\xampp8\htdocs\jyodawebsitenew`, so:

1. Start **Apache** from the XAMPP control panel.
2. Open <http://localhost/jyodawebsitenew/> in any modern browser.

> Three.js is loaded via an **import map** from `unpkg`, so no `npm install`
> is required.

## Run it without XAMPP

```bash
# Python
python -m http.server 5500

# Node (one-shot, no install)
npx serve .
```

## Customising

- **Brand colors** → top of `assets/css/style.css` (`--brand`, `--orange`, `--yellow`, …).
- **Hero copy / chips** → directly in `index.html`, hero `<section>`.
- **Floating chip positions** → CSS classes `.chip-1` through `.chip-8`.
- **Solar family / math solids** → `planets` and `solids` arrays in
  `assets/js/three.scene.js`. Drop in any `THREE.*Geometry` and an anchor `Vector3`.
- **Yellow highlighter on "Play"** → `.hero-title .highlight::before` rule.
- **Dashboard data** → `index.html` (Parent + Teacher dashboards in their sections).

## Browser support

- Requires WebGL (every modern desktop & mobile browser since 2017).
- Uses `<script type="importmap">` (Chrome 89+, Edge 89+, Safari 16.4+,
  Firefox 108+).
- Honours `prefers-reduced-motion` — animations slow drastically when the
  user has motion-reduction enabled.
