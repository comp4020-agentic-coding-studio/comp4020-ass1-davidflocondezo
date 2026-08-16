# COMP4020 prototype

Your starter repo for a COMP4020 prototype: a static site in HTML/CSS/TypeScript
that builds to plain HTML/CSS/JS and deploys to GitHub Pages. The deployed site
is what gets marked, not this repo.

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec, and this repo's name tells you
which deliverable applies. Read both before you plan or build.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## The checks

`typecheck`, `build`, `deploy`, `spec`, `lint`, `tests`, `evidence`, `links`,
`secrets`. Run `pnpm check`. Read the failure.

`spec/README.md`, `PROCESS.md` and `reflections/README.md` are in this repo and
say what they are for.

## This file is yours

A starting point, not a rulebook. As you learn what your prototype needs --- a
convention the work has to hold to, a sensor that keeps catching you out, a fact
about the stack that is easy to get wrong --- write it down here. Growing this
file is the work.

- `scrollIntoView` isn't implemented in jsdom. Any DOM-wiring code that calls it
  must feature-detect first (`typeof el.scrollIntoView === "function"`), or the
  jsdom-based tests throw.
- `[hidden]` is easy to lose to CSS. If a selector also sets `display` on the
  same element elsewhere in the stylesheet, that rule wins and the element
  stays visible even with the attribute present --- add an explicit
  `.foo[hidden] { display: none; }` override wherever both apply.
- Don't hand-place elements in a shared CSS Grid with per-item `grid-column`
  only. Auto-placement fills whatever cell comes next for anything missing an
  explicit row, which silently produces gaps in unrelated places once one
  element's height changes (bit us once with the collapsible panel and the
  filter sidebar). Use `grid-template-areas` for any layout with more than two
  grid children.
- Asset paths (poster `src`, etc.) must be built through
  `import.meta.env.BASE_URL`-safe joins (strip the leading/trailing slash
  before concatenating), never as a root-absolute path --- root-absolute works
  on localhost and 404s under the Pages base path.
- `extraction-dom.test.ts` builds `dist/` and parses the real static HTML via
  JSDOM rather than hand-authored fixture markup --- keep new DOM-wiring tests
  in that pattern so they stay honest against what actually ships.
