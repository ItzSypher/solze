import { motion } from "framer-motion";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Entrega para a obra",
    sub: "Frete rápido em capitais e região metropolitana.",
  },
  {
    icon: CreditCard,
    title: "Parcelamento em 12x",
    sub: "Sem juros no cartão em compras acima de R$ 300.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia de fábrica",
    sub: "Produtos originais com nota fiscal e garantia.",
  },
  {
    icon: Headphones,
    title: "Atendimento técnico",
    sub: "Especialistas para te ajudar a escolher o material certo.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ITEMS.map(({ icon: Icon, title, sub }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                {sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
