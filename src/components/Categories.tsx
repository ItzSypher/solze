import { motion } from "framer-motion";
import {
  Backpack,
  Briefcase,
  Package,
  Target,
  Shield,
  Zap,
  Crosshair,
  Box,
  Layers,
  Compass,
} from "lucide-react";

const CATEGORIES = [
  { label: "Mochilas Táticas", icon: Backpack },
  { label: "Operator Series", icon: Shield },
  { label: "EDC Urbano", icon: Briefcase },
  { label: "Range Bags", icon: Target },
  { label: "MOLLE", icon: Layers },
  { label: "Coldres & Cintos", icon: Crosshair },
  { label: "Porta-Equipamento", icon: Box },
  { label: "Acessórios", icon: Package },
  { label: "Outdoor", icon: Compass },
  { label: "Edição Limitada", icon: Zap },
];

export function Categories() {
  return (
    <section id="categorias" className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent">
            / Coleções
          </p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Equipamento para cada missão.
          </h2>
        </div>
        <a
          href="#promos"
          className="hidden sm:inline text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          Ver tudo →
        </a>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
      >
        {CATEGORIES.map(({ label, icon: Icon }) => (
          <motion.a
            key={label}
            href="#promos"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-card p-5 overflow-hidden hover:border-accent/40 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-accent/10 group-hover:to-accent/5 transition-all" />
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-foreground/80 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="relative font-display text-sm font-bold leading-tight text-foreground">
              {label}
            </span>
            <span className="relative text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
              Explorar →
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
