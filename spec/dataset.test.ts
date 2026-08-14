import { describe, expect, it } from "vitest";
import { PANEL_MOVIE_ID, movies } from "../src/data/movies";

// The dataset is the single source the extraction UI will read from: a typo
// in an anchor doesn't fail loudly there, it just makes a phrase silently
// unclickable/un-highlightable. These assertions exist to catch that here,
// before it becomes a UI bug.

describe("movie dataset", () => {
  it("has exactly 12 movies with unique ids", () => {
    expect(movies).toHaveLength(12);
    const ids = movies.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a panel movie id that matches an actual movie", () => {
    expect(movies.some((m) => m.id === PANEL_MOVIE_ID)).toBe(true);
  });

  for (const movie of movies) {
    describe(movie.id, () => {
      it("has non-empty genres, director, and cast", () => {
        expect(movie.data.genres.length).toBeGreaterThan(0);
        expect(movie.data.director.length).toBeGreaterThan(0);
        expect(movie.data.cast.length).toBeGreaterThan(0);
      });

      it("has a release date anchor findable in its blob", () => {
        expect(movie.blob).toContain(movie.anchors.releaseDate);
      });

      it("has a plot anchor findable in its blob", () => {
        expect(movie.blob).toContain(movie.anchors.plot);
      });

      it("has every genre anchor findable in its blob", () => {
        for (const genre of movie.anchors.genres) {
          expect(movie.blob).toContain(genre);
        }
      });

      it("has every director anchor findable in its blob", () => {
        for (const director of movie.anchors.director) {
          expect(movie.blob).toContain(director);
        }
      });

      it("has every cast anchor findable in its blob", () => {
        for (const cast of movie.anchors.cast) {
          expect(movie.blob).toContain(cast.anchor);
        }
      });

      it("has the poster anchor and credit findable in its blob", () => {
        expect(movie.blob).toContain(movie.anchors.poster.anchor);
        expect(movie.blob).toContain(movie.anchors.poster.credit);
      });

      it("has anchors.cast pairs matching data.cast pairs", () => {
        expect(movie.anchors.cast.map((c) => ({ actor: c.actor, character: c.character }))).toEqual(
          movie.data.cast,
        );
      });

      it("has anchors.genres and anchors.director matching data", () => {
        expect(movie.anchors.genres).toEqual(movie.data.genres);
        expect(movie.anchors.director).toEqual(movie.data.director);
      });

      it("has a poster credit matching data.poster.credit", () => {
        expect(movie.anchors.poster.credit).toBe(movie.data.poster.credit);
      });
    });
  }
});
