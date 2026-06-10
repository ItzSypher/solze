import { motion } from "framer-motion";
import {
  Hammer,
  Wrench,
  HardHat,
  PaintBucket,
  Plug,
  Lightbulb,
  Pipette,
  Droplets,
  Drill,
  Ruler,
  TreePine,
  Wrench as Tool,
  Bath,
  DoorOpen,
  Layers,
  Truck,
} from "lucide-react";

const CATEGORIES = [
  { label: "Ferramentas", icon: Hammer, hue: "from-amber-100 to-orange-200" },
  { label: "Elétrica", icon: Plug, hue: "from-yellow-100 to-amber-200" },
  { label: "Hidráulica", icon: Droplets, hue: "from-sky-100 to-blue-200" },
  { label: "Tintas", icon: PaintBucket, hue: "from-rose-100 to-orange-200" },
  { label: "Iluminação", icon: Lightbulb, hue: "from-yellow-50 to-yellow-200" },
  { label: "Construção", icon: HardHat, hue: "from-stone-100 to-stone-300" },
  { label: "Furadeiras", icon: Drill, hue: "from-zinc-100 to-zinc-300" },
  { label: "Medição", icon: Ruler, hue: "from-emerald-100 to-teal-200" },
  { label: "Jardim", icon: TreePine, hue: "from-lime-100 to-green-200" },
  { label: "Banheiro", icon: Bath, hue: "from-cyan-100 to-sky-200" },
  { label: "Portas & Janelas", icon: DoorOpen, hue: "from-amber-50 to-yellow-200" },
  { label: "Pisos & Revestimentos", icon: Layers, hue: "from-stone-100 to-amber-200" },
  { label: "Pintura Pro", icon: Pipette, hue: "from-pink-100 to-rose-200" },
  { label: "Acessórios", icon: Wrench, hue: "from-orange-100 to-amber-300" },
  { label: "EPI & Segurança", icon: Tool, hue: "from-yellow-100 to-orange-300" },
  { label: "Entrega Rápida", icon: Truck, hue: "from-amber-100 to-yellow-200" },
];

export function Categories() {
  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/80">
            Navegue por categoria
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Tudo para sua obra
          </h2>
        </div>
        <a
          href="#promos"
          className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todas →
        </a>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04 } },
        }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4"
      >
        {CATEGORIES.map(({ label, icon: Icon, hue }) => (
          <motion.a
            key={label}
            href="#promos"
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 sm:p-4 text-center hover:border-accent/60 hover:shadow-sm transition-colors"
          >
            <span
              className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${hue} text-foreground/80 group-hover:text-foreground transition-colors`}
            >
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <span className="text-[11px] sm:text-xs font-medium leading-tight text-foreground/85">
              {label}
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
