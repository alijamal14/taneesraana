// Islamabad / Nowshera switch with a sliding spring pill, and live opening
// status per clinic in Pakistan time (UTC+5, no DST). Shared logic with the
// Wi-Fi portal (router repo: portal/src/ui/clinics.ts).
import { animate } from "motion";

// Minutes since midnight per weekday (index 0 = Sunday); null = closed.
type Schedule = Array<[number, number] | null>;
export const ISLAMABAD: Schedule = [
  [480, 1200], // Sun 8 am – 8 pm
  [1080, 1200], [1080, 1200], [1080, 1200], [1080, 1200], // Mon–Thu 6 pm – 8 pm
  [480, 1200], [480, 1200], // Fri–Sat 8 am – 8 pm
];
export const NOWSHERA: Schedule = [
  null,
  [600, 720], [600, 720], [600, 720], [600, 720], // Mon–Thu 10 am – 12 pm
  null, null,
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmt(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h < 12 ? "am" : "pm"}`;
}

/** `name` prefixes the text ("Islamabad clinic open now…"); pass "" for a bare badge ("Open now…"). */
export function openStatus(
  schedule: Schedule,
  name: string,
  now = new Date(),
): { tone: "open" | "soon" | "closed"; text: string; today: string } {
  const pk = new Date(now.getTime() + 5 * 3600_000);
  const day = pk.getUTCDay();
  const mins = pk.getUTCHours() * 60 + pk.getUTCMinutes();
  const h = schedule[day];
  const today = h ? `${fmt(h[0])} – ${fmt(h[1])}` : "closed";
  const say = (phrase: string) => (name ? `${name} ${phrase}` : phrase.charAt(0).toUpperCase() + phrase.slice(1));

  if (h && mins >= h[0] && mins < h[1]) {
    return h[1] - mins <= 45
      ? { tone: "soon", text: say(`closing soon · ${fmt(h[1])}`), today }
      : { tone: "open", text: say(`open now · until ${fmt(h[1])}`), today };
  }
  if (h && mins < h[0]) return { tone: "closed", text: say(`opens today at ${fmt(h[0])}`), today };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = schedule[d];
    if (next) return { tone: "closed", text: say(`opens ${i === 1 ? "tomorrow" : DAYS[d]} at ${fmt(next[0])}`), today };
  }
  return { tone: "closed", text: say("closed"), today };
}

function paintBadge(id: string, schedule: Schedule, name: string) {
  const badge = document.getElementById(id);
  if (!badge) return null;
  const s = openStatus(schedule, name);
  badge.dataset.tone = s.tone;
  badge.querySelector("b")!.textContent = s.text;
  badge.hidden = false;
  return s;
}

export function initOpenStatus() {
  const today = document.getElementById("today-hours");
  const paint = () => {
    const s = paintBadge("open-badge", ISLAMABAD, "Islamabad clinic");
    paintBadge("open-isb", ISLAMABAD, "");
    paintBadge("open-nsh", NOWSHERA, "");
    if (today && s) today.textContent = s.today;
  };
  paint();
  setInterval(paint, 60_000);
}

export function initClinicTabs() {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".seg-btn"));
  const pill = document.querySelector<HTMLElement>(".seg-pill");
  if (!tabs.length || !pill) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const offset = (i: number) => tabs[i].offsetLeft - tabs[0].offsetLeft;
  function select(idx: number, focus = false) {
    tabs.forEach((t, i) => {
      const on = i === idx;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls") || "");
      if (!panel) return;
      panel.hidden = !on;
      if (on && !reduce) animate(panel, { opacity: [0, 1], y: [8, 0] }, { duration: 0.3, ease: "easeOut" });
    });
    if (reduce) pill!.style.transform = `translateX(${offset(idx)}px)`;
    else animate(pill!, { x: offset(idx) }, { type: "spring", stiffness: 420, damping: 32 });
    if (focus) tabs[idx].focus();
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        select((i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length, true);
      }
    });
  });
  window.addEventListener("resize", () => {
    const idx = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    pill.style.transform = `translateX(${offset(idx)}px)`;
  });
}
