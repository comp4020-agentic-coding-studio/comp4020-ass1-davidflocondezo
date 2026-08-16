import { describe, expect, it } from "vitest";
import { movies, PANEL_MOVIE_ID } from "../src/data/movies";
import { collectAnchors, requiredKeys, segmentBlob } from "../src/lib/segment";

describe("segmentBlob", () => {
  for (const movie of movies) {
    it(`segments ${movie.id} without throwing, rejoining to the exact blob`, () => {
      const segments = segmentBlob(movie);
      const rejoined = segments.map((s) => (s.type === "text" ? s.text : s.anchor.text)).join("");
      expect(rejoined).toBe(movie.blob);
    });

    it(`carries every collected anchor for ${movie.id} through as its own segment`, () => {
      const segments = segmentBlob(movie);
      const anchorSegments = segments.filter((s) => s.type === "anchor");
      expect(anchorSegments).toHaveLength(collectAnchors(movie).length);
    });
  }
});

describe("requiredKeys", () => {
  const alien = movies.find((m) => m.id === PANEL_MOVIE_ID);
  if (!alien) throw new Error("PANEL_MOVIE_ID doesn't match a movie");
  const anchors = collectAnchors(alien);

  it("counts Alien's required anchors per facet", () => {
    expect(requiredKeys(anchors, "releaseDate")).toHaveLength(1);
    expect(requiredKeys(anchors, "genre")).toHaveLength(2);
    expect(requiredKeys(anchors, "director")).toHaveLength(1);
    expect(requiredKeys(anchors, "component")).toHaveLength(2);
    expect(requiredKeys(anchors, "media")).toHaveLength(1);
    expect(requiredKeys(anchors, "plot")).toHaveLength(4);
  });
});
