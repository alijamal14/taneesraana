// Google Ads conversions — the same events the old site fired inline:
//   tel: taps            → AW-817969533/IZ5zCIaIuaocEP3yhIYD
//   calendar booking     → AW-817969533/AzWOCIOIuaocEP3yhIYD
// Wired once via [data-conversion] so every call/book link reports consistently.

const SEND_TO: Record<string, string> = {
  call: "AW-817969533/IZ5zCIaIuaocEP3yhIYD",
  book: "AW-817969533/AzWOCIOIuaocEP3yhIYD",
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function initConversions() {
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-conversion]");
      const sendTo = el && SEND_TO[el.dataset.conversion || ""];
      if (sendTo && typeof window.gtag === "function") {
        // Beacon transport: the tel:/calendar navigation starts immediately and
        // would otherwise cancel the request (the old inline onclick had the same race).
        window.gtag("event", "conversion", { send_to: sendTo, transport_type: "beacon" });
      }
    },
    { capture: true },
  );
}
