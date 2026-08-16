import { describe, expect, it } from "vitest";
import { click, createRevealState, type RequiredKeysByFacet } from "../src/lib/reveal-state";

const required: RequiredKeysByFacet = {
  releaseDate: ["releaseDate"],
  genre: ["genres:0"],
  director: ["director:0"],
  component: ["cast:0", "cast:1"],
  media: ["poster"],
  plot: ["plot:0", "plot:1"],
};

describe("reveal-state", () => {
  it("starts with nothing completed", () => {
    const state = createRevealState(required);
    expect(state.component.completed).toBe(false);
    expect(state.releaseDate.completed).toBe(false);
  });

  it("only reports justRevealed once every required key of a facet is clicked", () => {
    let state = createRevealState(required);

    const first = click(state, required, "component", "cast:0");
    state = first.state;
    expect(first.justRevealed).toBe(false);
    expect(state.component.completed).toBe(false);

    const second = click(state, required, "component", "cast:1");
    state = second.state;
    expect(second.justRevealed).toBe(true);
    expect(state.component.completed).toBe(true);
  });

  it("does not re-report justRevealed on further clicks of an already-completed facet", () => {
    let state = createRevealState(required);
    state = click(state, required, "media", "poster").state;

    const again = click(state, required, "media", "poster");
    expect(again.justRevealed).toBe(false);
    expect(again.state.media.completed).toBe(true);
  });

  it("tracks facets independently", () => {
    let state = createRevealState(required);
    state = click(state, required, "releaseDate", "releaseDate").state;

    expect(state.releaseDate.completed).toBe(true);
    expect(state.component.completed).toBe(false);
    expect(state.plot.completed).toBe(false);
  });

  it("completes regardless of click order", () => {
    let state = createRevealState(required);
    state = click(state, required, "plot", "plot:1").state;
    const result = click(state, required, "plot", "plot:0");
    expect(result.justRevealed).toBe(true);
  });
});
