// Wires up the extraction panel and the catalog-wide controls it unlocks.
// Only the panel movie's blob renders <button>s (see BlobText.astro), so
// querying for them naturally scopes clicks to the panel — every other
// card's blob is inert markup with no listeners attached.
import { movies, PANEL_MOVIE_ID } from "../data/movies";
import { click, createRevealState, type RequiredKeysByFacet } from "../lib/reveal-state";
import { collectAnchors, requiredKeys } from "../lib/segment";
import type { FacetGroup } from "../types/facets";

const FACETS: FacetGroup[] = ["releaseDate", "genre", "director", "component", "media", "plot"];

// Search doesn't match genre until the Genre facet unlocks — typing a genre
// name before then is meant to fail, so the hint can explain why and point at
// the Genre step instead of at a search bug. Same widen-on-unlock pattern as
// Component/cast, below.
const ALL_GENRES = [...new Set(movies.flatMap((m) => m.data.genres))];

export function wireUpExtraction(root: ParentNode): void {
  const panelMovie = movies.find((m) => m.id === PANEL_MOVIE_ID);
  if (!panelMovie) return;
  const panelTitle = panelMovie.data.title;

  const anchors = collectAnchors(panelMovie);
  const required = FACETS.reduce((acc, facet) => {
    acc[facet] = requiredKeys(anchors, facet);
    return acc;
  }, {} as RequiredKeysByFacet);

  let revealState = createRevealState(required);
  let searchIncludesCast = false;
  let searchIncludesGenre = false;
  let explorationSeen = false;
  let explorationDone = false;

  const searchInput = root.querySelector<HTMLInputElement>("#catalog-search");
  const searchHint = root.querySelector<HTMLElement>("[data-search-hint]");
  const guidanceNext = root.querySelector<HTMLButtonElement>("[data-guidance-next]");
  const moviePanel = root.querySelector<HTMLElement>(".movie-panel");
  const panelCollapseToggle = root.querySelector<HTMLButtonElement>("[data-panel-collapse]");
  const sortSelect = root.querySelector<HTMLSelectElement>("#sort-select");
  const sortControl = root.querySelector<HTMLElement>('[data-control="releaseDate"]');
  const genreFilter = root.querySelector<HTMLSelectElement>("#genre-filter");
  const directorFilter = root.querySelector<HTMLSelectElement>("#director-filter");
  const grid = root.querySelector<HTMLElement>(".movie-grid");
  const originalOrder = grid ? Array.from(grid.children) : [];

  function selectedValues(select: HTMLSelectElement | null): string[] {
    if (!select) return [];
    return Array.from(select.selectedOptions).map((option) => option.value);
  }

  function updateSearchPlaceholder(): void {
    if (!searchInput) return;
    const extras = [searchIncludesCast && "cast", searchIncludesGenre && "genre"].filter(
      (extra): extra is string => Boolean(extra),
    );
    searchInput.placeholder = extras.length === 0 ? "Search by title…" : `Search by title or ${extras.join(" or ")}…`;
  }

  // The guidance box is the one place onboarding/step copy lives. It opens by
  // sending the visitor to search a genre — which always comes up empty,
  // since search only ever matches title/cast, never genre. That explanation
  // sticks (and the Next button stays up) regardless of what's typed next, so
  // it can't be missed by clearing the box; only clicking Next reveals the
  // panel and advances the guidance to narrating its steps.
  function updateSearchHint(query: string, visibleCount: number): void {
    if (!searchHint) return;

    const isGenreQuery = query !== "" && ALL_GENRES.some((g) => g.toLowerCase() === query);

    if (!explorationDone) {
      if (isGenreQuery && visibleCount === 0) {
        explorationSeen = true;
        searchHint.textContent = `No matches for "${query}" — genre isn't structured data yet, it's still just plain text in the blob below. Work through the Genre step in the panel to extract it.`;
      } else if (!explorationSeen) {
        searchHint.textContent = 'Try searching for a genre, like "horror" — see what happens.';
      }
      if (guidanceNext) guidanceNext.hidden = !explorationSeen;
      return;
    }

    if (isGenreQuery && visibleCount === 0 && !searchIncludesGenre) {
      searchHint.textContent = `No matches for "${query}" — genre isn't structured data yet, it's still just plain text in the blob below. Work through the Genre step in the panel to extract it.`;
      return;
    }

    searchHint.textContent = `Click phrases in ${panelTitle}'s raw text below to extract them into structured data. Each extraction demonstrates one facet of the content model — release date, genre, director, cast, poster, plot — and unlocks a matching feature across every other movie in the catalog below. Start with Release date.`;
  }

  // Recomputes every card's visibility and order from every active filter
  // together, reading live from `movies` rather than DOM text — so search,
  // genre, director, and sort never fight each other.
  function applyGridView(): void {
    if (!grid) return;

    const query = (searchInput?.value ?? "").trim().toLowerCase();
    const selectedGenres = selectedValues(genreFilter);
    const selectedDirectors = selectedValues(directorFilter);
    const sortUnlocked = sortControl ? !sortControl.hidden : false;
    const sortBy = sortUnlocked ? (sortSelect?.value ?? "title") : null;
    let visibleCount = 0;

    for (const card of Array.from(grid.children)) {
      const movie = movies.find((m) => m.id === (card as HTMLElement).dataset.movie);
      if (!movie) continue;

      const matchesQuery =
        query === "" ||
        movie.data.title.toLowerCase().includes(query) ||
        (searchIncludesCast &&
          movie.data.cast.some(
            (c) => c.actor.toLowerCase().includes(query) || c.character.toLowerCase().includes(query),
          )) ||
        (searchIncludesGenre && movie.data.genres.some((g) => g.toLowerCase().includes(query)));

      const matchesGenre = selectedGenres.length === 0 || movie.data.genres.some((g) => selectedGenres.includes(g));
      const matchesDirector =
        selectedDirectors.length === 0 || movie.data.director.some((d) => selectedDirectors.includes(d));

      const visible = matchesQuery && matchesGenre && matchesDirector;
      (card as HTMLElement).hidden = !visible;
      if (visible) visibleCount++;
    }

    updateSearchHint(query, visibleCount);

    function movieFor(node: ChildNode) {
      return movies.find((m) => m.id === (node as HTMLElement).dataset.movie);
    }

    const order =
      sortBy === "release"
        ? [...originalOrder].sort((a, b) =>
            (movieFor(a)?.data.releaseDate ?? "").localeCompare(movieFor(b)?.data.releaseDate ?? ""),
          )
        : sortBy === "title"
          ? [...originalOrder].sort((a, b) => (movieFor(a)?.data.title ?? "").localeCompare(movieFor(b)?.data.title ?? ""))
          : originalOrder;

    for (const node of order) grid.appendChild(node);
  }

  searchInput?.addEventListener("input", applyGridView);
  sortSelect?.addEventListener("change", applyGridView);
  genreFilter?.addEventListener("change", applyGridView);
  directorFilter?.addEventListener("change", applyGridView);

  panelCollapseToggle?.addEventListener("click", () => {
    const collapsed = moviePanel?.classList.toggle("collapsed") ?? false;
    panelCollapseToggle.setAttribute("aria-expanded", String(!collapsed));
    panelCollapseToggle.textContent = collapsed ? "Expand" : "Collapse";
  });

  guidanceNext?.addEventListener("click", () => {
    explorationDone = true;
    if (moviePanel) moviePanel.hidden = false;
    guidanceNext.hidden = true;
    if (searchInput) searchInput.value = "";
    applyGridView();
  });

  function revealFacet(facet: FacetGroup): void {
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(`.movie-panel .blob [data-facet="${facet}"]`))) {
      el.classList.add("revealed");
    }
    // In the grid (not the panel), the raw phrase disappears once its facet
    // is extracted — the structured fact now carries that information, so
    // the passive cards don't keep showing both.
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(`.movie-card .blob [data-facet="${facet}"]`))) {
      el.hidden = true;
    }
    for (const section of Array.from(
      root.querySelectorAll<HTMLElement>(`.structured-facts [data-facet="${facet}"]`),
    )) {
      section.hidden = false;
      section.classList.add("just-revealed");
    }

    const revealedSection = moviePanel?.querySelector<HTMLElement>(`.structured-facts [data-facet="${facet}"]`);
    if (revealedSection && typeof revealedSection.scrollIntoView === "function") {
      setTimeout(() => revealedSection.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
    }

    if (facet === "releaseDate" || facet === "genre" || facet === "director") {
      const control = root.querySelector<HTMLElement>(`[data-control="${facet}"]`);
      if (control) {
        control.hidden = false;
        control.classList.add("just-revealed");
      }
    }

    if (facet === "component") {
      searchIncludesCast = true;
      updateSearchPlaceholder();
    }

    if (facet === "genre") {
      searchIncludesGenre = true;
      updateSearchPlaceholder();
    }

    applyGridView();
  }

  // Once every facet has been extracted, the grid's raw blobs have nothing
  // left to demonstrate — each phrase has already been pulled into structured
  // data. The panel itself stays in place (it's still the worked example the
  // grid echoes) but recedes visually, since it no longer has anything left
  // to invite a click on.
  function applyCompletionStateIfDone(): void {
    if (!FACETS.every((facet) => revealState[facet].completed)) return;
    for (const blob of Array.from(root.querySelectorAll<HTMLElement>(".movie-card .blob"))) {
      blob.hidden = true;
    }
    moviePanel?.classList.add("panel-complete");
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

      const progress = root.querySelector(`.guided-steps [data-facet-progress="${facet}"]`);
      if (progress) progress.textContent = `${revealState[facet].clicked.size}/${required[facet].length}`;

      if (revealState[facet].completed) {
        root.querySelector(`.guided-steps li[data-facet="${facet}"]`)?.classList.add("done");
      }

      if (result.justRevealed) revealFacet(facet);

      applyCompletionStateIfDone();
    });
  }
}
