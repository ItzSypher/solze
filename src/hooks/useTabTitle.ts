import { useEffect } from "react";

const AWAY_TITLES = [
  "Forgot something? 🛒",
  "Come back! Your cart is waiting ✨",
  "Don't miss out — your picks are still here ☀️",
  "Psst… come check LOJA SOLZE",
];

export function useTabTitle(originalTitle: string) {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let idx = 0;

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        document.title = AWAY_TITLES[0];
        idx = 1;
        interval = setInterval(() => {
          document.title = AWAY_TITLES[idx % AWAY_TITLES.length];
          idx++;
        }, 3500);
      } else {
        if (interval) clearInterval(interval);
        interval = null;
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (interval) clearInterval(interval);
      document.title = originalTitle;
    };
  }, [originalTitle]);
}
