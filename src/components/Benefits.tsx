import { motion } from "framer-motion";
import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Expresso 24h",
    sub: "Receba no dia seguinte em capitais.",
  },
  {
    icon: CreditCard,
    title: "12x sem juros",
    sub: "Em todo o site, acima de R$ 199.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia vitalícia",
    sub: "Reparo ou troca pra sempre.",
  },
  {
    icon: RotateCcw,
    title: "30 dias de teste",
    sub: "Não gostou? Devolução sem custo.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ITEMS.map(({ icon: Icon, title, sub }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                {sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
