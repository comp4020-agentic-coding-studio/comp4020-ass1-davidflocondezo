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
    expect(doc.querySelector('[data-control="taxonomy"]')?.hasAttribute("hidden")).toBe(true);
  });

  it("completing releaseDate reveals it on every card and unlocks the sort control", () => {
    const doc = freshDocument();

    clickAll(doc, "releaseDate");

    const sections = Array.from(doc.querySelectorAll('.structured-facts [data-facet="releaseDate"]'));
    expect(sections).toHaveLength(movies.length);
    for (const section of sections) expect((section as HTMLElement).hidden).toBe(false);
    expect(doc.querySelector('[data-control="releaseDate"]')?.hasAttribute("hidden")).toBe(false);
  });

  it("completing taxonomy reveals it everywhere and unlocks the genre/director filters", () => {
    const doc = freshDocument();

    clickAll(doc, "taxonomy");

    for (const section of Array.from(doc.querySelectorAll('.structured-facts [data-facet="taxonomy"]'))) {
      expect((section as HTMLElement).hidden).toBe(false);
    }
    expect(doc.querySelector('[data-control="taxonomy"]')?.hasAttribute("hidden")).toBe(false);
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

  it("filters the grid by genre immediately on change, combined with search text", () => {
    const doc = freshDocument();
    clickAll(doc, "taxonomy");

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

  it("sorts the grid ascending by release date as soon as the toggle is checked", () => {
    const doc = freshDocument();
    clickAll(doc, "releaseDate");

    const sortToggle = doc.querySelector<HTMLInputElement>("#sort-toggle");
    if (!sortToggle) throw new Error("sort-toggle checkbox not found");
    sortToggle.checked = true;
    fire(sortToggle, "change");

    const grid = doc.querySelector(".movie-grid");
    if (!grid) throw new Error(".movie-grid not found");
    const ids = Array.from(grid.children).map((card) => (card as HTMLElement).dataset.movie);

    const expectedIds = [...gridMovies]
      .sort((a, b) => a.data.releaseDate.localeCompare(b.data.releaseDate))
      .map((m) => m.id);
    expect(ids).toEqual(expectedIds);
  });
});
