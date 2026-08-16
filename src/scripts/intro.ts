// Fades the intro splash out and the catalog in. #page-content starts
// `inert` and opacity:0 in markup/CSS so it's neither focusable nor visible
// until this click fires — no JS-established initial state needed.
const FADE_MS = 500;

export function wireUpIntro(root: ParentNode): void {
  const intro = root.querySelector<HTMLElement>("#intro-screen");
  const pageContent = root.querySelector<HTMLElement>("#page-content");
  const startButton = root.querySelector<HTMLButtonElement>("#intro-start");
  if (!intro || !pageContent || !startButton) return;

  const view = intro.ownerDocument.defaultView;

  startButton.addEventListener("click", () => {
    intro.classList.add("intro-fading");
    pageContent.classList.add("page-visible");
    pageContent.removeAttribute("inert");

    const reduceMotion =
      typeof view?.matchMedia === "function" && view.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(
      () => {
        intro.hidden = true;
        pageContent.querySelector("h2")?.focus();
      },
      reduceMotion ? 0 : FADE_MS,
    );
  });
}
