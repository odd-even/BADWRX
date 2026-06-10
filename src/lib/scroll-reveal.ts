export const SCROLL_REVEAL_CLASS = "scroll-reveal";
export const SCROLL_REVEAL_VISIBLE_CLASS = "is-visible";

export const SCROLL_REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -6% 0px",
};

let sharedObserver: IntersectionObserver | null = null;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getScrollRevealObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(SCROLL_REVEAL_VISIBLE_CLASS);
        sharedObserver?.unobserve(entry.target);
      }
    }, SCROLL_REVEAL_OBSERVER_OPTIONS);
  }

  return sharedObserver;
}

export function observeScrollReveal(el: HTMLElement): () => void {
  if (prefersReducedMotion()) {
    el.classList.add(SCROLL_REVEAL_CLASS, SCROLL_REVEAL_VISIBLE_CLASS);
    return () => {};
  }

  el.classList.add(SCROLL_REVEAL_CLASS);

  const observer = getScrollRevealObserver();
  if (!observer) {
    el.classList.add(SCROLL_REVEAL_VISIBLE_CLASS);
    return () => {};
  }

  observer.observe(el);
  return () => observer.unobserve(el);
}

function shouldSkipReveal(el: HTMLElement): boolean {
  if (el.classList.contains(SCROLL_REVEAL_CLASS)) return true;
  if (el.hasAttribute("data-no-reveal")) return true;
  if (el.closest("[data-no-reveal]")) return true;
  if (el.closest("[data-configurator]")) return true;
  return false;
}

function addDirectChildren(
  wrapper: Element,
  add: (el: HTMLElement, delayIndex?: number) => void,
) {
  Array.from(wrapper.children).forEach((child, index) => {
    if (child instanceof HTMLElement) add(child, index);
  });
}

/** Collect page blocks that should use the shared scroll-reveal animation. */
export function collectSiteScrollRevealTargets(main: HTMLElement): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const targets: HTMLElement[] = [];

  const add = (el: HTMLElement, delayIndex = 0) => {
    if (shouldSkipReveal(el) || seen.has(el)) return;
    seen.add(el);
    if (delayIndex > 0) {
      el.style.setProperty("--scroll-reveal-delay", `${delayIndex * 70}ms`);
    }
    targets.push(el);
  };

  const topSections = Array.from(main.querySelectorAll(":scope > section"));
  topSections.slice(1).forEach((section) => {
    if (section instanceof HTMLElement) add(section);
  });

  main.querySelectorAll(':scope > div[class*="max-w"]').forEach((wrapper) => {
    addDirectChildren(wrapper, add);
  });

  main.querySelectorAll(":scope > article").forEach((article) => {
    const sections = Array.from(article.querySelectorAll(":scope > section"));
    sections.slice(1).forEach((section, index) => {
      if (section instanceof HTMLElement) add(section, index);
    });

    article.querySelectorAll(':scope > div[class*="max-w"]').forEach((wrapper) => {
      addDirectChildren(wrapper, add);
    });
  });

  return targets;
}

export function initSiteScrollReveals(
  main: HTMLElement,
  pathname: string,
): () => void {
  if (pathname === "/" || pathname.startsWith("/configure")) {
    return () => {};
  }

  const cleanups = collectSiteScrollRevealTargets(main).map((target) =>
    observeScrollReveal(target),
  );

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
