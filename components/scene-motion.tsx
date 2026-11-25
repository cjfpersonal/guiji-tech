"use client";

import { useEffect } from "react";

export function SceneMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (reducedMotion) {
      scenes.forEach((scene) => { (scene as HTMLElement).dataset.visible = "true"; });
      return;
    }

    document.documentElement.classList.add("scene-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10%", threshold: 0.1 });
    scenes.forEach((scene) => observer.observe(scene));

    const hero = document.querySelector<HTMLElement>(".signal-hero");
    const mobile = window.matchMedia("(max-width: 900px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!hero || mobile.matches) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.min(window.innerHeight * 0.75, 680)));
      hero.style.setProperty("--hero-scale", String(1 + progress * 0.035));
      hero.style.setProperty("--hero-clip", `${progress * 3}%`);
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    if (hero) {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      mobile.addEventListener("change", requestUpdate);
      update();
    }
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("scene-motion");
      window.removeEventListener("scroll", requestUpdate);
      mobile.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
