import { motion } from "framer-motion";

const FEATURES = [
  "CORDURA® 1000D",
  "YKK® Zippers",
  "MOLLE / PALS",
  "Hypalon Reinforced",
  "Duraflex® Buckles",
  "Hydration Ready",
  "Ballistic Compatible",
  "IPX4 Weatherproof",
];

export function Brands() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-24">
      <p className="text-center text-[11px] uppercase tracking-[0.24em] text-accent">
        / Spec sheet
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Componentes de grau militar em cada peça
      </p>
      <div className="mt-8 overflow-hidden border-y border-border py-6">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...FEATURES, ...FEATURES].map((b, i) => (
            <span
              key={i}
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground/30 hover:text-accent transition-colors"
            >
              {b} <span className="ml-12 text-accent/60">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
