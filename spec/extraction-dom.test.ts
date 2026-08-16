import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { movies, PANEL_MOVIE_ID } from "../src/data/movies";
import { wireUpExtraction } from "../src/scripts/extraction-dom";

// Runs against the BUILT site (same pattern as invariants.test.ts — run
// `pnpm build` first, the `check` script does), but goes further: it wires
// up the real extraction script against the parsed markup and dispatches
// real clicks/inputs, checking the end-to-end behaviour rather than just the
// markup's shape.
const DIST_INDEX = resolve("dist/index.html");
const gridMovies = movies.filter((m) => m.id !== PANEL_MOVIE_ID);

function freshDocument(): Document {
  const dom = new JSDOM(readFileSync(DIST_INDEX, "utf8"));
  wireUpExtraction(dom.window.document);
  return dom.window.document;
}

function clickAll(doc: Document, facet: string): void {
  const buttons = doc.querySelectorAll<HTMLButtonElement>(`.movie-panel button.anchor[data-facet="${facet}"]`);
  for (const button of Array.from(buttons)) button.click();
}

function fire(el: Element, type: string): void {
  el.dispatchEvent(new (el.ownerDocument.defaultView as typeof window).Event(type, { bubbles: true }));
}

function visibleGridIds(doc: Document): string[] {
  const grid = doc.querySelector(".movie-grid");
  if (!grid) return [];
  return Array.from(grid.children)
    .filter((card) => !(card as HTMLElement).hidden)
    .map((card) => (card as HTMLElement).dataset.movie ?? "");
}

describe("wireUpExtraction", () => {
  it("starts with every structured-facts section and control hidden", () => {
    const doc = freshDocument();

    for (const section of Array.from(doc.querySelectorAll(".structured-facts section"))) {
      expect((section as HTMLElement).hidden).toBe(true);
    }
    expect(doc.querySelector('[data-control="releaseDate"]')?.hasAttribute("hidden")).toBe(true);
    expect(doc.querySelector('[data-control="genre"]')?.hasAttribute("hidden")).toBe(true);
    expect(doc.querySelector('[data-control="director"]')?.hasAttribute("hidden")).toBe(true);
  });

  it("shows per-click progress on a multi-anchor facet before it completes", () => {
    const doc = freshDocument();
    const progress = doc.querySelector('[data-facet-progress="plot"]');
    expect(progress?.textContent).toBe("0/4");

    const [first, second] = Array.from(
      doc.querySelectorAll<HTMLButtonElement>('.movie-panel button.anchor[data-facet="plot"]'),
    );
    first.click();
    expect(progress?.textContent).toBe("1/4");
    second.click();
    expect(progress?.textContent).toBe("2/4");

    expect(doc.querySelector('.guided-steps li[data-facet="plot"]')?.classList.contains("done")).toBe(false);
  });

  it("completing releaseDate reveals it on every card and unlocks the sort control", () => {
    const doc = freshDocument();

    clickAll(doc, "releaseDate");

    const sections = Array.from(doc.querySelectorAll('.structured-facts [data-facet="releaseDate"]'));
    expect(sections).toHaveLength(movies.length);
    for (const section of sections) expect((section as HTMLElement).hidden).toBe(false);
    expect(doc.querySelector('[data-control="releaseDate"]')?.hasAttribute("hidden")).toBe(false);
  });

  it("completing genre reveals it everywhere and unlocks the genre filter, independently of director", () => {
    const doc = freshDocument();

    clickAll(doc, "genre");

    for (const section of Array.from(doc.querySelectorAll('.structured-facts [data-facet="genre"]'))) {
      expect((section as HTMLElement).hidden).toBe(false);
    }
    expect(doc.querySelector('[data-control="genre"]')?.hasAttribute("hidden")).toBe(false);
    expect(doc.querySelector('[data-control="director"]')?.hasAttribute("hidden")).toBe(true);
    for (const section of Array.from(doc.querySelectorAll('.structured-facts [data-facet="director"]'))) {
      expect((section as HTMLElement).hidden).toBe(true);
    }
  });

  it("completing director reveals it everywhere and unlocks the director filter, independently of genre", () => {
    const doc = freshDocument();

    clickAll(doc, "director");

    for (const section of Array.from(doc.querySelectorAll('.structured-facts [data-facet="director"]'))) {
      expect((section as HTMLElement).hidden).toBe(false);
    }
    expect(doc.querySelector('[data-control="director"]')?.hasAttribute("hidden")).toBe(false);
    expect(doc.querySelector('[data-control="genre"]')?.hasAttribute("hidden")).toBe(true);
    for (const section of Array.from(doc.querySelectorAll('.structured-facts [data-facet="genre"]'))) {
      expect((section as HTMLElement).hidden).toBe(true);
    }
  });

  it("completing component reveals cast everywhere and widens the search box instead of adding a new one", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    expect(search?.placeholder).toBe("Search by title…");

    clickAll(doc, "component");

    for (const section of Array.from(doc.querySelectorAll('.structured-facts [data-facet="component"]'))) {
      expect((section as HTMLElement).hidden).toBe(false);
    }
    expect(search?.placeholder).toBe("Search by title or cast…");
  });

  it("completing media and plot reveals them everywhere without adding any new control", () => {
    const doc = freshDocument();

    clickAll(doc, "media");
    clickAll(doc, "plot");

    for (const facet of ["media", "plot"]) {
      for (const section of Array.from(doc.querySelectorAll(`.structured-facts [data-facet="${facet}"]`))) {
        expect((section as HTMLElement).hidden).toBe(false);
      }
    }
    expect(doc.querySelector('[data-control="media"]')).toBeNull();
    expect(doc.querySelector('[data-control="plot"]')).toBeNull();
  });

  it("hides the extracted phrase in grid cards' blobs once its facet completes, but leaves the panel's blob text in place", () => {
    const doc = freshDocument();

    const panelAnchorsBefore = Array.from(
      doc.querySelectorAll<HTMLElement>('.movie-panel .blob [data-facet="releaseDate"]'),
    );
    const gridAnchorsBefore = Array.from(
      doc.querySelectorAll<HTMLElement>('.movie-card .blob [data-facet="releaseDate"]'),
    );
    expect(panelAnchorsBefore.length).toBeGreaterThan(0);
    expect(gridAnchorsBefore.length).toBeGreaterThan(0);
    for (const el of [...panelAnchorsBefore, ...gridAnchorsBefore]) expect(el.hidden).toBe(false);

    clickAll(doc, "releaseDate");

    for (const el of Array.from(doc.querySelectorAll<HTMLElement>('.movie-panel .blob [data-facet="releaseDate"]'))) {
      expect(el.hidden).toBe(false);
      expect(el.classList.contains("revealed")).toBe(true);
    }
    for (const el of Array.from(doc.querySelectorAll<HTMLElement>('.movie-card .blob [data-facet="releaseDate"]'))) {
      expect(el.hidden).toBe(true);
    }
  });

  it("hides the entire grid blob and dims the panel once every facet is complete, but leaves the panel's blob in place", () => {
    const doc = freshDocument();

    for (const facet of ["releaseDate", "genre", "director", "component", "media", "plot"]) {
      clickAll(doc, facet);
    }

    for (const blob of Array.from(doc.querySelectorAll<HTMLElement>(".movie-card .blob"))) {
      expect(blob.hidden).toBe(true);
    }
    expect(doc.querySelector<HTMLElement>(".movie-panel .blob")?.hidden).toBe(false);
    expect(doc.querySelector(".movie-panel")?.classList.contains("panel-complete")).toBe(true);
  });

  it("does not dim the panel while a facet is still incomplete", () => {
    const doc = freshDocument();

    clickAll(doc, "releaseDate");
    clickAll(doc, "genre");
    clickAll(doc, "director");
    clickAll(doc, "component");
    clickAll(doc, "media");
    // plot deliberately left incomplete

    expect(doc.querySelector(".movie-panel")?.classList.contains("panel-complete")).toBe(false);
  });

  it("does not hide any grid blob while a facet is still incomplete", () => {
    const doc = freshDocument();

    clickAll(doc, "releaseDate");
    clickAll(doc, "genre");
    clickAll(doc, "director");
    clickAll(doc, "component");
    clickAll(doc, "media");
    // plot deliberately left incomplete

    for (const blob of Array.from(doc.querySelectorAll<HTMLElement>(".movie-card .blob"))) {
      expect(blob.hidden).toBe(false);
    }
  });

  it("filters the grid live by title as soon as text is typed", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    if (!search) throw new Error("catalog-search input not found");

    search.value = "martian";
    fire(search, "input");

    expect(visibleGridIds(doc)).toEqual(["the-martian"]);
  });

  it("does not match actor names until Component unlocks, then does", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    if (!search) throw new Error("catalog-search input not found");

    search.value = "damon";
    fire(search, "input");
    expect(visibleGridIds(doc)).toEqual([]);

    clickAll(doc, "component");
    fire(search, "input");
    expect(visibleGridIds(doc).sort()).toEqual(["the-martian", "the-odyssey"]);
  });

  it("shows a nudge to search a genre before anything is typed, with the panel and Next button both hidden", () => {
    const doc = freshDocument();
    const hint = doc.querySelector("[data-search-hint]");
    expect(hint?.textContent).toContain("horror");
    expect(doc.querySelector(".movie-panel")?.hasAttribute("hidden")).toBe(true);
    expect(doc.querySelector("[data-guidance-next]")?.hasAttribute("hidden")).toBe(true);
  });

  it("searching a genre name comes up empty, explains why, and reveals the Next button — but the panel stays hidden", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    const hint = doc.querySelector("[data-search-hint]");
    if (!search) throw new Error("catalog-search input not found");

    search.value = "horror";
    fire(search, "input");

    expect(visibleGridIds(doc)).toEqual([]);
    expect(hint?.textContent).toContain("Genre");
    expect(doc.querySelector(".movie-panel")?.hasAttribute("hidden")).toBe(true);
    expect(doc.querySelector("[data-guidance-next]")?.hasAttribute("hidden")).toBe(false);
  });

  it("leaves the explanatory message in place across further typing, until Next is clicked", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    const hint = doc.querySelector("[data-search-hint]");
    if (!search) throw new Error("catalog-search input not found");

    search.value = "horror";
    fire(search, "input");
    search.value = "";
    fire(search, "input");

    expect(hint?.textContent).toContain("Genre");
    expect(doc.querySelector(".movie-panel")?.hasAttribute("hidden")).toBe(true);
    expect(doc.querySelector("[data-guidance-next]")?.hasAttribute("hidden")).toBe(false);
  });

  it("clicking Next reveals the panel, hides itself, and switches the guidance text to narrate the extraction steps", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    const hint = doc.querySelector("[data-search-hint]");
    const next = doc.querySelector<HTMLButtonElement>("[data-guidance-next]");
    if (!search) throw new Error("catalog-search input not found");
    if (!next) throw new Error("guidance-next button not found");

    search.value = "horror";
    fire(search, "input");
    next.click();

    expect(doc.querySelector(".movie-panel")?.hasAttribute("hidden")).toBe(false);
    expect(next.hasAttribute("hidden")).toBe(true);
    expect(hint?.textContent).toContain("Release date");
  });

  it("keeps guiding toward the panel for ordinary searches once Next has been clicked", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    const hint = doc.querySelector("[data-search-hint]");
    const next = doc.querySelector<HTMLButtonElement>("[data-guidance-next]");
    if (!search) throw new Error("catalog-search input not found");
    if (!next) throw new Error("guidance-next button not found");

    search.value = "horror";
    fire(search, "input");
    next.click();
    search.value = "martian";
    fire(search, "input");

    expect(visibleGridIds(doc)).toEqual(["the-martian"]);
    expect(hint?.textContent).toContain("Release date");
  });

  it("does not match genre names until Genre unlocks, then does", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    if (!search) throw new Error("catalog-search input not found");

    search.value = "horror";
    fire(search, "input");
    expect(visibleGridIds(doc)).toEqual([]);

    clickAll(doc, "genre");
    fire(search, "input");

    const expectedByGenre = gridMovies.filter((m) => m.data.genres.includes("Horror")).map((m) => m.id);
    expect(visibleGridIds(doc).sort()).toEqual(expectedByGenre.sort());
  });

  it("widens the search placeholder to mention genre once it unlocks, combining with cast if already unlocked", () => {
    const doc = freshDocument();
    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    if (!search) throw new Error("catalog-search input not found");

    clickAll(doc, "genre");
    expect(search.placeholder).toBe("Search by title or genre…");

    clickAll(doc, "component");
    expect(search.placeholder).toBe("Search by title or cast or genre…");
  });

  it("filters the grid by genre immediately on change, combined with search text", () => {
    const doc = freshDocument();
    clickAll(doc, "genre");

    const genreFilter = doc.querySelector<HTMLSelectElement>("#genre-filter");
    if (!genreFilter) throw new Error("genre-filter select not found");
    const horror = Array.from(genreFilter.options).find((o) => o.value === "Horror");
    if (!horror) throw new Error('no "Horror" option in genre-filter');
    horror.selected = true;
    fire(genreFilter, "change");

    const expectedByGenre = gridMovies.filter((m) => m.data.genres.includes("Horror")).map((m) => m.id);
    expect(visibleGridIds(doc).sort()).toEqual(expectedByGenre.sort());

    const search = doc.querySelector<HTMLInputElement>("#catalog-search");
    if (!search) throw new Error("catalog-search input not found");
    search.value = "sinners";
    fire(search, "input");

    expect(visibleGridIds(doc)).toEqual(["sinners"]);
  });

  it("collapses and expands the panel body via the collapse toggle", () => {
    const doc = freshDocument();
    const toggle = doc.querySelector<HTMLButtonElement>("[data-panel-collapse]");
    const panel = doc.querySelector<HTMLElement>(".movie-panel");
    if (!toggle) throw new Error("panel-collapse toggle not found");
    if (!panel) throw new Error(".movie-panel not found");

    expect(panel.classList.contains("collapsed")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.textContent?.trim()).toBe("Collapse");

    toggle.click();
    expect(panel.classList.contains("collapsed")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.textContent?.trim()).toBe("Expand");

    toggle.click();
    expect(panel.classList.contains("collapsed")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.textContent?.trim()).toBe("Collapse");
  });

  it("sorts the grid by title by default as soon as it unlocks", () => {
    const doc = freshDocument();
    clickAll(doc, "releaseDate");

    const grid = doc.querySelector(".movie-grid");
    if (!grid) throw new Error(".movie-grid not found");
    const ids = Array.from(grid.children).map((card) => (card as HTMLElement).dataset.movie);

    const expectedIds = [...gridMovies].sort((a, b) => a.data.title.localeCompare(b.data.title)).map((m) => m.id);
    expect(ids).toEqual(expectedIds);
  });

  it("switches to release-date sort as soon as it's selected", () => {
    const doc = freshDocument();
    clickAll(doc, "releaseDate");

    const sortSelect = doc.querySelector<HTMLSelectElement>("#sort-select");
    if (!sortSelect) throw new Error("sort-select not found");
    sortSelect.value = "release";
    fire(sortSelect, "change");

    const grid = doc.querySelector(".movie-grid");
    if (!grid) throw new Error(".movie-grid not found");
    const ids = Array.from(grid.children).map((card) => (card as HTMLElement).dataset.movie);

    const expectedIds = [...gridMovies]
      .sort((a, b) => a.data.releaseDate.localeCompare(b.data.releaseDate))
      .map((m) => m.id);
    expect(ids).toEqual(expectedIds);
  });

  it("does not sort the grid before releaseDate unlocks", () => {
    const doc = freshDocument();

    const grid = doc.querySelector(".movie-grid");
    if (!grid) throw new Error(".movie-grid not found");
    const ids = Array.from(grid.children).map((card) => (card as HTMLElement).dataset.movie);

    expect(ids).toEqual(gridMovies.map((m) => m.id));
  });
});
