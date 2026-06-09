import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    eyebrow: "Summer Edit 2026",
    title: "Sun-kissed essentials,\nmade to wear daily.",
    sub: "Slow design and warm tones for the brighter season.",
    cta: "Shop the edit",
    bg: "from-amber-100 via-orange-50 to-rose-100",
  },
  {
    eyebrow: "Limited drop",
    title: "Linen, lightly\ntouched by the sun.",
    sub: "Breathable pieces in just a few colorways. Once they're gone, they're gone.",
    cta: "See the drop",
    bg: "from-yellow-50 via-amber-100 to-orange-100",
  },
  {
    eyebrow: "Free shipping",
    title: "On every order\nover $80.",
    sub: "Delivered fast, packaged kindly. No surprises at checkout.",
    cta: "Start shopping",
    bg: "from-stone-100 via-amber-50 to-yellow-100",
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-6">
      <div className="relative overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`relative bg-gradient-to-br ${SLIDES[i].bg} min-h-[420px] sm:min-h-[520px] flex items-center`}
          >
            <div className="px-8 sm:px-16 py-16 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs uppercase tracking-[0.2em] text-foreground/70"
              >
                {SLIDES[i].eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-4xl sm:text-6xl font-semibold tracking-tight text-foreground whitespace-pre-line leading-[1.05]"
              >
                {SLIDES[i].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 text-base sm:text-lg text-foreground/80 max-w-md"
              >
                {SLIDES[i].sub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex gap-3"
              >
                <Button
                  size="lg"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {SLIDES[i].cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-foreground/20 bg-background/50 backdrop-blur"
                >
                  Learn more
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-8 bg-foreground" : "w-4 bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
