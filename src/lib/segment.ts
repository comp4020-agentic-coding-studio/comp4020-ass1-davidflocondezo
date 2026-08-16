import type { FacetGroup } from "../types/facets";
import type { MovieRecord } from "../types/movie";

// One flattened, ordered-within-facet view of every anchor in a movie's
// `anchors`, tagged with which of the 5 guided steps it belongs to. This is
// the single place that decides that mapping — everything downstream (DOM
// wiring, required-click counting, segmentation) reads it rather than
// re-deriving it from `Anchors` directly.
export type Anchor = {
  facet: FacetGroup;
  key: string;
  text: string;
  // Whether clicking this anchor counts toward its facet's completion. Only
  // poster.credit is excluded: Media stays a single click on the poster
  // description, matching Component's per-item pattern rather than forcing
  // two clicks for one facet.
  countsTowardCompletion: boolean;
};

export type Segment = { type: "text"; text: string } | { type: "anchor"; anchor: Anchor };

export function collectAnchors(movie: MovieRecord): Anchor[] {
  const { anchors } = movie;
  const list: Anchor[] = [
    { facet: "releaseDate", key: "releaseDate", text: anchors.releaseDate, countsTowardCompletion: true },
  ];

  anchors.genres.forEach((text, i) => {
    list.push({ facet: "taxonomy", key: `genres:${i}`, text, countsTowardCompletion: true });
  });
  anchors.director.forEach((text, i) => {
    list.push({ facet: "taxonomy", key: `director:${i}`, text, countsTowardCompletion: true });
  });

  anchors.cast.forEach((c, i) => {
    list.push({ facet: "component", key: `cast:${i}`, text: c.anchor, countsTowardCompletion: true });
  });

  list.push({ facet: "media", key: "poster", text: anchors.poster.anchor, countsTowardCompletion: true });
  list.push({ facet: "media", key: "poster.credit", text: anchors.poster.credit, countsTowardCompletion: false });

  anchors.plot.forEach((text, i) => {
    list.push({ facet: "plot", key: `plot:${i}`, text, countsTowardCompletion: true });
  });

  return list;
}

export function requiredKeys(anchors: Anchor[], facet: FacetGroup): string[] {
  return anchors.filter((a) => a.facet === facet && a.countsTowardCompletion).map((a) => a.key);
}

// Locates every anchor by `indexOf` against the original, unmutated blob,
// sorts by start index, then slices once left-to-right. Never replaces
// in-place: doing that sequentially would let an earlier replacement shift
// the indices a later `indexOf` depends on.
export function segmentBlob(movie: MovieRecord): Segment[] {
  const { blob } = movie;
  const anchors = collectAnchors(movie);

  const located = anchors.map((anchor) => {
    const start = blob.indexOf(anchor.text);
    if (start === -1) {
      throw new Error(`Anchor not found in blob: movie "${movie.id}", facet "${anchor.facet}", key "${anchor.key}"`);
    }
    return { anchor, start, end: start + anchor.text.length };
  });

  located.sort((a, b) => a.start - b.start);

  for (let i = 1; i < located.length; i++) {
    const prev = located[i - 1];
    const current = located[i];
    if (current.start < prev.end) {
      throw new Error(
        `Overlapping anchors in movie "${movie.id}": "${prev.anchor.key}" and "${current.anchor.key}"`,
      );
    }
  }

  const segments: Segment[] = [];
  let cursor = 0;
  for (const { anchor, start, end } of located) {
    if (start > cursor) {
      segments.push({ type: "text", text: blob.slice(cursor, start) });
    }
    segments.push({ type: "anchor", anchor });
    cursor = end;
  }
  if (cursor < blob.length) {
    segments.push({ type: "text", text: blob.slice(cursor) });
  }

  return segments;
}
