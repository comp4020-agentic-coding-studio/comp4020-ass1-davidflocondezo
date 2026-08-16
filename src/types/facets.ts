// The five guided extraction steps shown in the panel and referenced by
// CatalogControls. This is a UI/labeling grouping on top of Anchors
// (src/types/movie.ts), not a change to the dataset: every anchor stays
// clickable from the start regardless of which step it's grouped under.
export type FacetGroup = "releaseDate" | "taxonomy" | "component" | "media" | "plot";
