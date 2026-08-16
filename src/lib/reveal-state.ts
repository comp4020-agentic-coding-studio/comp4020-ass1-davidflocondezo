import type { FacetGroup } from "../types/facets";

export type FacetState = { clicked: ReadonlySet<string>; completed: boolean };
export type RevealState = Record<FacetGroup, FacetState>;
export type RequiredKeysByFacet = Record<FacetGroup, string[]>;

// A facet with no required keys starts already completed rather than stuck
// unreachable — doesn't happen for any real movie today, but a click() that
// can never fire for an empty facet would otherwise leave it permanently
// hidden.
export function createRevealState(required: RequiredKeysByFacet): RevealState {
  const state = {} as RevealState;
  for (const facet of Object.keys(required) as FacetGroup[]) {
    state[facet] = { clicked: new Set(), completed: required[facet].length === 0 };
  }
  return state;
}

export function click(
  state: RevealState,
  required: RequiredKeysByFacet,
  facet: FacetGroup,
  key: string,
): { state: RevealState; justRevealed: boolean } {
  const before = state[facet];
  const clicked = new Set(before.clicked);
  clicked.add(key);
  const completed = required[facet].every((k) => clicked.has(k));

  return {
    state: { ...state, [facet]: { clicked, completed } },
    justRevealed: completed && !before.completed,
  };
}
