import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    eyebrow: "Novo drop · Operator Series",
    title: "Engineered\nfor the field.",
    sub: "Bolsas profissionais reforçadas com organização inteligente, tecido CORDURA® 1000D e garantia vitalícia.",
    cta: "Explorar coleção",
    accent: "from-[#0a0e1a] via-[#10172a] to-[#1a1f3a]",
    grid: "rgba(255,120,40,0.18)",
  },
  {
    eyebrow: "EDC · Everyday Carry",
    title: "Sua rotina,\nem alta performance.",
    sub: "Mochilas urbanas com compartimentos modulares e proteção balística opcional.",
    cta: "Ver mochilas",
    accent: "from-[#0d0d10] via-[#1c1d22] to-[#2a2a30]",
    grid: "rgba(255,200,0,0.16)",
  },
  {
    eyebrow: "Frete Expresso em 24h",
    title: "Receba hoje.\nMissão amanhã.",
    sub: "Expresso (1 dia) ou Padrão grátis (7 dias). Você decide o ritmo.",
    cta: "Comprar agora",
    accent: "from-[#0a1a18] via-[#102826] to-[#1a3a36]",
    grid: "rgba(0,220,180,0.14)",
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[i];

  return (
    <section className="relative mx-auto max-w-[1400px] px-4 sm:px-6 pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`relative bg-gradient-to-br ${s.accent} min-h-[520px] sm:min-h-[640px] flex items-center`}
            style={{
              backgroundImage: `radial-gradient(circle at 80% 20%, ${s.grid}, transparent 60%)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              }}
            />

            <div className="relative px-8 sm:px-16 py-20 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-accent"
              >
                <Zap className="h-3 w-3" /> {s.eyebrow}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display mt-5 text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white whitespace-pre-line leading-[0.95]"
              >
                {s.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
              >
                {s.sub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Button
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.03] active:scale-[0.98] transition-transform glow-accent font-semibold h-12 px-7"
                >
                  {s.cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur h-12 px-7"
                >
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  Garantia vitalícia
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-14 grid grid-cols-3 gap-6 max-w-md text-white/70"
              >
                {[
                  ["1000D", "CORDURA®"],
                  ["IPX4", "Resistente"],
                  ["10+", "anos garantia"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="font-display text-2xl font-bold text-white">{k}</div>
                    <div className="text-[11px] uppercase tracking-widest">{v}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1 rounded-full transition-all ${
                idx === i ? "w-10 bg-accent" : "w-5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
