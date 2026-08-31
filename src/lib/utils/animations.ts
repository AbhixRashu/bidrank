"use client";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function staggerChildren(
  parentSelector: string,
  childSelector: string,
  delay: number = 80
): void {
  if (prefersReducedMotion()) return;

  const parent = document.querySelector(parentSelector);
  if (!parent) return;

  const children = parent.querySelectorAll(childSelector);
  children.forEach((child, i) => {
    (child as HTMLElement).style.transitionDelay = `${i * delay}ms`;
    (child as HTMLElement).classList.add("reveal-up");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  children.forEach((child) => observer.observe(child));
}

export function scrollReveal(element: HTMLElement, threshold: number = 0.1): void {
  if (prefersReducedMotion()) {
    element.classList.add("revealed");
    return;
  }

  element.classList.add("reveal-up");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    },
    { threshold, rootMargin: "0px 0px -40px 0px" }
  );

  observer.observe(element);
}

export function countUp(
  element: HTMLElement,
  target: number,
  duration: number = 1500
): void {
  if (prefersReducedMotion()) {
    element.textContent = target.toLocaleString("en-IN");
    return;
  }

  const start = performance.now();
  const startValue = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startValue + (target - startValue) * eased);

    element.textContent = current.toLocaleString("en-IN");

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}
