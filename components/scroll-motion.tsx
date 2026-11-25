"use client";

import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => { element.dataset.visible = "true"; });
      return;
    }

    document.documentElement.classList.add("scroll-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("scroll-motion");
    };
  }, []);

  return null;
}
