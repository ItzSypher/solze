import { motion } from "framer-motion";

const BRANDS = [
  "Bosch",
  "Makita",
  "DeWalt",
  "Tramontina",
  "Vonder",
  "Tigre",
  "Suvinil",
  "Coral",
  "Deca",
  "Philips",
];

export function Brands() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        As marcas que sua obra confia
      </p>
      <div className="mt-6 overflow-hidden">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground/40 hover:text-foreground/80 transition-colors"
            >
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
