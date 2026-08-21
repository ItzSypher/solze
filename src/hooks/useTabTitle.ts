import { useEffect } from "react";

const AWAY_TITLES = [
  "Ficou faltando algo? 🛒 | Solze",
  "Ficou faltando algo? 🛒 | Solze",
  "Volte e finalize sua compra | Solze",
];

const GREETING_TITLES = [
  "👋 Bem-vindo à Solze!",
  "Pronto pra encarar o dia? | Solze",
];

export function useTabTitle(originalTitle: string) {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let idx = 0;

    // Greet user when they land on the page
    let greetIdx = 0;
    document.title = GREETING_TITLES[0];
    const greetInterval = setInterval(() => {
      greetIdx++;
      if (greetIdx >= GREETING_TITLES.length) {
        clearInterval(greetInterval);
        document.title = originalTitle;
      } else {
        document.title = GREETING_TITLES[greetIdx];
      }
    }, 1800);
    const greetDone = setTimeout(() => {
      clearInterval(greetInterval);
      document.title = originalTitle;
    }, GREETING_TITLES.length * 1800);

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
      clearInterval(greetInterval);
      clearTimeout(greetDone);
      document.title = originalTitle;
    };
  }, [originalTitle]);
}
