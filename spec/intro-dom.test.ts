import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";
import { wireUpIntro } from "../src/scripts/intro";

// Runs against the BUILT site (same pattern as extraction-dom.test.ts — run
// `pnpm build` first, the `check` script does).
const DIST_INDEX = resolve("dist/index.html");

function freshDocument(): Document {
  const dom = new JSDOM(readFileSync(DIST_INDEX, "utf8"));
  wireUpIntro(dom.window.document);
  return dom.window.document;
}

describe("wireUpIntro", () => {
  it("starts with the catalog inert and hidden, and the intro visible", () => {
    const doc = freshDocument();
    const pageContent = doc.querySelector("#page-content");
    const intro = doc.querySelector<HTMLElement>("#intro-screen");

    expect(pageContent?.hasAttribute("inert")).toBe(true);
    expect(pageContent?.classList.contains("page-visible")).toBe(false);
    expect(intro?.hidden).toBe(false);
  });

  it("declares the intro's h1 as the page's only top-level heading", () => {
    const doc = freshDocument();
    expect(doc.querySelectorAll("h1").length).toBe(1);
    expect(doc.querySelector("#intro-screen h1")).toBeTruthy();
  });

  it("reveals the catalog and starts fading the intro on click", () => {
    const doc = freshDocument();
    const button = doc.querySelector<HTMLButtonElement>("#intro-start");
    const pageContent = doc.querySelector<HTMLElement>("#page-content");
    const intro = doc.querySelector<HTMLElement>("#intro-screen");

    button?.click();

    expect(pageContent?.hasAttribute("inert")).toBe(false);
    expect(pageContent?.classList.contains("page-visible")).toBe(true);
    expect(intro?.classList.contains("intro-fading")).toBe(true);
  });

  it("hides the intro and focuses the catalog heading after the fade", () => {
    vi.useFakeTimers();
    try {
      const doc = freshDocument();
      const button = doc.querySelector<HTMLButtonElement>("#intro-start");
      const intro = doc.querySelector<HTMLElement>("#intro-screen");
      const heading = doc.querySelector<HTMLElement>("#page-content h2");

      button?.click();
      expect(intro?.hidden).toBe(false);

      vi.advanceTimersByTime(500);

      expect(intro?.hidden).toBe(true);
      expect(doc.activeElement).toBe(heading);
    } finally {
      vi.useRealTimers();
    }
  });
});
