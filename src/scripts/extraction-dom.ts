// Wires up the extraction panel and the catalog-wide controls it unlocks.
// Only the panel movie's blob renders <button>s (see BlobText.astro), so
// querying for them naturally scopes clicks to the panel — every other
// card's blob is inert markup with no listeners attached.
import { movies, PANEL_MOVIE_ID } from "../data/movies";
import { click, createRevealState, type RequiredKeysByFacet } from "../lib/reveal-state";
import { collectAnchors, requiredKeys } from "../lib/segment";
import type { FacetGroup } from "../types/facets";

const FACETS: FacetGroup[] = ["releaseDate", "taxonomy", "component", "media", "plot"];

export function wireUpExtraction(root: ParentNode): void {
  const panelMovie = movies.find((m) => m.id === PANEL_MOVIE_ID);
  if (!panelMovie) return;

  const anchors = collectAnchors(panelMovie);
  const required = FACETS.reduce((acc, facet) => {
    acc[facet] = requiredKeys(anchors, facet);
    return acc;
  }, {} as RequiredKeysByFacet);

  let revealState = createRevealState(required);
  let searchIncludesCast = false;

  const searchInput = root.querySelector<HTMLInputElement>("#catalog-search");
  const sortToggle = root.querySelector<HTMLInputElement>("#sort-toggle");
  const genreFilter = root.querySelector<HTMLSelectElement>("#genre-filter");
  const directorFilter = root.querySelector<HTMLSelectElement>("#director-filter");
  const grid = root.querySelector<HTMLElement>(".movie-grid");
  const originalOrder = grid ? Array.from(grid.children) : [];

  function selectedValues(select: HTMLSelectElement | null): string[] {
    if (!select) return [];
    return Array.from(select.selectedOptions).map((option) => option.value);
  }

  // Recomputes every card's visibility and order from every active filter
  // together, reading live from `movies` rather than DOM text — so search,
  // genre, director, and sort never fight each other.
  function applyGridView(): void {
    if (!grid) return;

    const query = (searchInput?.value ?? "").trim().toLowerCase();
    const selectedGenres = selectedValues(genreFilter);
    const selectedDirectors = selectedValues(directorFilter);
    const sortByRelease = sortToggle?.checked ?? false;

    for (const card of Array.from(grid.children)) {
      const movie = movies.find((m) => m.id === (card as HTMLElement).dataset.movie);
      if (!movie) continue;

      const matchesQuery =
        query === "" ||
        movie.data.title.toLowerCase().includes(query) ||
        (searchIncludesCast &&
          movie.data.cast.some(
            (c) => c.actor.toLowerCase().includes(query) || c.character.toLowerCase().includes(query),
          ));

      const matchesGenre = selectedGenres.length === 0 || movie.data.genres.some((g) => selectedGenres.includes(g));
      const matchesDirector =
        selectedDirectors.length === 0 || movie.data.director.some((d) => selectedDirectors.includes(d));

      (card as HTMLElement).hidden = !(matchesQuery && matchesGenre && matchesDirector);
    }

    const order = sortByRelease
      ? [...originalOrder].sort((a, b) => {
          const ma = movies.find((m) => m.id === (a as HTMLElement).dataset.movie);
          const mb = movies.find((m) => m.id === (b as HTMLElement).dataset.movie);
          return (ma?.data.releaseDate ?? "").localeCompare(mb?.data.releaseDate ?? "");
        })
      : originalOrder;

    for (const node of order) grid.appendChild(node);
  }

  searchInput?.addEventListener("input", applyGridView);
  sortToggle?.addEventListener("change", applyGridView);
  genreFilter?.addEventListener("change", applyGridView);
  directorFilter?.addEventListener("change", applyGridView);

  function revealFacet(facet: FacetGroup): void {
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(`.blob [data-facet="${facet}"]`))) {
      el.classList.add("revealed");
    }
    for (const section of Array.from(
      root.querySelectorAll<HTMLElement>(`.structured-facts [data-facet="${facet}"]`),
    )) {
      section.hidden = false;
    }

    if (facet === "releaseDate" || facet === "taxonomy") {
      const control = root.querySelector<HTMLElement>(`[data-control="${facet}"]`);
      if (control) control.hidden = false;
    }

    if (facet === "component") {
      searchIncludesCast = true;
      if (searchInput) searchInput.placeholder = "Search by title or cast…";
    }

    applyGridView();
  }

  const panelButtons = root.querySelectorAll<HTMLButtonElement>(".movie-panel button.anchor");
  for (const button of Array.from(panelButtons)) {
    button.addEventListener("click", () => {
      const facet = button.dataset.facet as FacetGroup | undefined;
      const key = button.dataset.key;
      if (!facet || !key) return;

      button.classList.add("clicked");

      const result = click(revealState, required, facet, key);
      revealState = result.state;

      if (revealState[facet].completed) {
        root.querySelector(`.guided-steps li[data-facet="${facet}"]`)?.classList.add("done");
      }

      if (result.justRevealed) revealFacet(facet);
    });
  }
}
