// Living icons and the rotating-word glyph (same approach as the Wi-Fi portal):
// icons only animate while on screen, and touches replay a richer reaction.
const reduced = () => document.documentElement.classList.contains("no-motion");

function press(selector: string, ms = 650) {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.addEventListener("pointerdown", () => {
      if (reduced()) return;
      el.classList.remove("is-active");
      void el.offsetWidth; // restart on repeated taps
      el.classList.add("is-active");
      window.setTimeout(() => el.classList.remove("is-active"), ms);
    });
  });
}

export function initLiving() {
  const icons = document.querySelectorAll(".alive");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
      { rootMargin: "80px" },
    );
    icons.forEach((el) => io.observe(el));
  } else {
    icons.forEach((el) => el.classList.add("is-live"));
  }
  press(".btn, .quick, .phones a, .action-bar a, .fert, .addr");
  press(".tile", 1100);
}

/** Keeps the glyph in front of the rotating word in sync ("women's health" uses the health glyph). */
export function setGlyph(word: string) {
  const glyph = document.getElementById("rot-glyph");
  if (glyph) glyph.dataset.word = word.includes("health") ? "health" : word;
}
