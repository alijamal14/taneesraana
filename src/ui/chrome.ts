// Site chrome: theme switch, mobile menu, header shadow, active nav link,
// mobile action bar, copy buttons and the service-worker update toast.
import { animate } from "motion";

type Theme = "system" | "light" | "dark";
const ORDER: Theme[] = ["system", "light", "dark"];
const ICON: Record<Theme, string> = { system: "#i-monitor", light: "#i-sun", dark: "#i-moon" };

export function initTheme() {
  const btn = document.getElementById("theme-btn");
  if (!btn) return;
  const root = document.documentElement;
  let theme: Theme = (root.getAttribute("data-theme") as Theme) || "system";
  const paint = () => {
    btn.querySelector("use")?.setAttribute("href", ICON[theme]);
    btn.setAttribute("aria-label", `Theme: ${theme}. Switch theme`);
  };
  paint();
  btn.addEventListener("click", () => {
    theme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      if (theme === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", theme);
    } catch {
      /* private mode */
    }
    paint();
    animate(btn, { rotate: [-30, 0], scale: [0.85, 1] }, { type: "spring", stiffness: 400, damping: 18 });
  });
}

export function initMenu() {
  const sheet = document.getElementById("mobile-menu");
  const open = document.getElementById("menu-btn");
  const close = document.getElementById("menu-close");
  if (!sheet || !open || !close) return;
  const set = (on: boolean) => {
    sheet.hidden = !on;
    open.setAttribute("aria-expanded", String(on));
    document.body.style.overflow = on ? "hidden" : "";
    if (on) close.focus();
    else open.focus();
  };
  open.addEventListener("click", () => set(true));
  close.addEventListener("click", () => set(false));
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet || (e.target as Element).closest("a")) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) set(false);
  });
}

export function initHeaderAndNav() {
  const header = document.querySelector(".site-header");
  const bar = document.querySelector(".action-bar");
  const footer = document.querySelector(".site-footer");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hide the mobile action bar over the footer (which repeats the contacts).
  if (bar && footer && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle("is-hidden", e.isIntersecting), { threshold: 0.1 }).observe(footer);
  }

  // Highlight the nav link of the section in view.
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-main a"));
  if (links.length && "IntersectionObserver" in window) {
    const byId = new Map(links.map((a) => [a.getAttribute("href")!.slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          links.forEach((a) => a.classList.remove("is-active"));
          byId.get(e.target.id)?.classList.add("is-active");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    byId.forEach((_, id) => {
      const s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

export function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
    const use = btn.querySelector("use");
    btn.addEventListener("click", async () => {
      if (!(await copyText(btn.dataset.copy || ""))) return;
      btn.classList.add("is-copied");
      use?.setAttribute("href", "#i-check");
      setTimeout(() => {
        btn.classList.remove("is-copied");
        use?.setAttribute("href", "#i-copy");
      }, 1500);
    });
  });
}

/** Registers the service worker and shows a quiet refresh toast when an update is ready. */
export function initServiceWorker() {
  if (!("serviceWorker" in navigator) || location.hostname === "localhost") return;
  const toast = document.getElementById("update-toast");
  const btn = document.getElementById("update-btn");
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => {
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        w?.addEventListener("statechange", () => {
          if (w.state === "installed" && navigator.serviceWorker.controller && toast) toast.hidden = false;
        });
      });
    })
    .catch(() => {
      /* offline support is optional */
    });
  btn?.addEventListener("click", () => location.reload());
}
