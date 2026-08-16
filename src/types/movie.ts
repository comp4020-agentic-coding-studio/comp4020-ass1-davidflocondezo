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

// A movie's raw, unstructured form: the messy paragraph a real CMS import
// would hand you before anyone has modelled it. `anchors` points at exactly
// which substring of `blob` corresponds to each piece of `data`, so the same
// lookup (`blob.indexOf(anchor)`) drives both the worked example's clickable
// extraction and every other card's passive, non-interactive echo — there's
// only one mechanism, not two. Anchors are plain substrings rather than
// inline markup so `data` stays the single source of truth for actual
// values; a differently *worded* anchor (e.g. "summer of 1994" in prose vs.
// "1994-07-06" in `data`) is fine, and `spec/dataset.test.ts` catches any
// anchor that doesn't actually appear in its movie's blob.
export type Anchors = {
  releaseDate: string;
  // The plot is broken into sentence-level fragments scattered through the
  // blob (interrupted by genre/cast/director/poster mentions), not one
  // contiguous substring — that's what makes the blob read as a messy import
  // rather than clean prose with facts bolted on front and back. Fragments
  // stay in the same order they appear in `data.plot`, and joining them with
  // a single space reconstitutes `data.plot` exactly, so there's still only
  // one wording of the plot to maintain, not two.
  plot: string[];
  genres: string[]; // same order as data.genres
  director: string[]; // same order as data.director
  cast: { actor: string; character: string; anchor: string }[]; // anchor covers both names together, keeping the pairing intact in the blob too
  poster: { anchor: string; credit: string }; // anchor becomes alt text once extracted
};

export type MovieRecord = {
  id: string; // stable kebab-case key, e.g. "alien"
  blob: string;
  data: Movie;
  anchors: Anchors;
};
