// The content model for this explainer's one example content type. Each
// comment block names which of the four facets (fields, taxonomy, component,
// media) the properties below it demonstrate.

export type Movie = {
  // Fields — single values, no internal structure.
  title: string;
  // Stored ISO YYYY-MM-DD — sorts correctly as a plain string and parses
  // reliably with `new Date(...)`. Format to DD-MM-YYYY only when displaying
  // it; the stored shape and the displayed shape are separate concerns.
  releaseDate: string;
  // Plain string is enough here: nothing in the guided steps or unlocked
  // features needs plot's internal structure, only its content. A CMS would
  // still expose this as a distinct "long text" field type for the textarea
  // UI it implies, even though it stores the same string primitive.
  plot: string;

  // Taxonomy — controlled, shared lists filtered/browsed by. Values are drawn
  // from a fixed list, not free text, so every movie can be reliably grouped.
  genres: string[];
  director: string[];

  // Component — a repeatable structured group. Each cast member pairs an
  // actor with the character they play; a component keeps that pairing
  // intact where two flat parallel lists would lose it.
  cast: { actor: string; character: string }[];

  // Media — an asset with its own metadata, not a bare URL.
  poster: { url: string; alt: string; credit: string };
};
