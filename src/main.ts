import "./app.css";
import { animate, inView, stagger } from "motion";
import { initConversions } from "./ui/conversions";
import { initClinicTabs, initOpenStatus } from "./ui/clinics";
import { initCopyButtons, initHeaderAndNav, initMenu, initServiceWorker, initTheme } from "./ui/chrome";
import { initLiving, setGlyph } from "./ui/living";

const root = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) root.classList.add("no-motion");

// Tracking and core interactions first, so a visual-effect failure never breaks them.
initConversions();
initTheme();
initMenu();
initHeaderAndNav();
initClinicTabs();
initOpenStatus();
initCopyButtons();
initServiceWorker();
root.classList.add("booted");
initLiving();

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// Pointer spotlight on glass cards (mouse only: on touch it would run during every scroll).
if (window.matchMedia("(pointer: fine)").matches) document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((el) => {
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  el.addEventListener("pointermove", move, { passive: true });
  el.addEventListener("pointerenter", (e) => {
    move(e);
    el.classList.add("is-lit");
  });
  el.addEventListener("pointerleave", () => el.classList.remove("is-lit"));
});

if (!reduce) {
  const EASE = [0.16, 1, 0.3, 1] as const;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  // Scroll reveals (hero runs immediately).
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    inView(
      el,
      () => {
        animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.75, ease: EASE });
      },
      { amount: 0.15 },
    );
  });
  // Hero stays visible from first paint (fast LCP); only small accents animate in.
  animate(".chip", { scale: [0.85, 1] }, { type: "spring", stiffness: 380, damping: 20, delay: stagger(0.05, { startDelay: 0.2 }) });

  // Draw service icons as they appear.
  inView(".draw", (el) => {
    el.classList.add("is-drawn");
  }, { amount: 0.6 });

  // Count-up for the trust strip.
  inView("[data-count]", (el) => {
    const target = Number((el as HTMLElement).dataset.count || "0");
    animate(0, target, { duration: 1.2, ease: EASE, onUpdate: (v) => (el.textContent = String(Math.round(v))) });
  });

  // Rotating headline word with a blur morph.
  const rotator = document.getElementById("rotator");
  const words = ["pregnancy", "fertility", "women's health", "motherhood"];
  if (rotator) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      animate(rotator, coarse ? { opacity: [1, 0], y: [0, -10] } : { opacity: [1, 0], y: [0, -10], filter: ["blur(0px)", "blur(8px)"] }, { duration: 0.28, ease: "easeIn" }).then(() => {
        rotator.textContent = words[i];
        setGlyph(words[i]);
        animate(rotator, coarse ? { opacity: [0, 1], y: [12, 0] } : { opacity: [0, 1], y: [12, 0], filter: ["blur(8px)", "blur(0px)"] }, { duration: 0.5, ease: EASE });
      });
    }, 3000);
  }
} else {
  document.querySelectorAll(".draw").forEach((el) => el.classList.add("is-drawn"));
}
