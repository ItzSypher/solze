import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header, Subfooter, Footer } from "./index";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "★ Ofertas da Semana — Solze" },
      { name: "description", content: "Promoções imperdíveis em bolsas, mochilas e acessórios para ferramentas Solze. Descontos por tempo limitado." },
    ],
  }),
  component: OfertasPage,
});

const RED = "#E63946";

function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function OfertasPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", { query: "ofertas-page", limit: 16 }],
    queryFn: () => fetchProducts(16),
  });
  const target = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 12 + 1000 * 60 * 45);
  const { d, h, m, s } = useCountdown(target);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <CartDrawer />

      {/* Promo Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-[#3a0a0e] to-[#7a0e18] text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0 2px,transparent 2px 24px)" }} />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 mb-6 text-xs uppercase tracking-[0.3em] border border-white/20">
            <Flame className="h-3.5 w-3.5" style={{ color: RED }} /> Promoção por tempo limitado
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="font-display uppercase font-bold tracking-tight text-[clamp(3rem,9vw,8rem)] leading-[0.85]">
            ★ Ofertas <span style={{ color: RED }}>da Semana</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            Até <span className="font-bold text-white">44% OFF</span> em bolsas e acessórios para ferramentas. Estoque limitado.
          </motion.p>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-10 inline-flex flex-col items-center gap-3 rounded-[20px] bg-black/40 backdrop-blur border border-white/10 px-8 py-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
              <Clock className="h-3.5 w-3.5" /> Termina em
            </div>
            <div className="flex items-center gap-3 md:gap-5 font-display">
              {[
                { v: d, l: "Dias" },
                { v: h, l: "Horas" },
                { v: m, l: "Min" },
                { v: s, l: "Seg" },
              ].map((u) => (
                <div key={u.l} className="flex flex-col items-center">
                  <div className="text-4xl md:text-6xl font-bold tabular-nums leading-none" style={{ color: RED }}>{pad(u.v)}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/60 mt-2">{u.l}</div>
                </div>
              )).reduce<React.ReactNode[]>((acc, el, i, arr) => {
                acc.push(el);
                if (i < arr.length - 1) acc.push(<div key={`sep-${i}`} className="text-3xl md:text-5xl text-white/40 font-bold">:</div>);
                return acc;
              }, [])}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offer grid */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display uppercase text-3xl md:text-4xl font-bold">Aproveite agora</h2>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Carregando produtos..." : `${products.length} produtos em promoção`}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-display uppercase tracking-wider px-4 py-2 rounded-full text-white" style={{ background: RED }}>
            <Zap className="h-4 w-4" /> Estoque limitado
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[20px] bg-secondary/40 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.node.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <Subfooter />
      <Footer />
    </div>
  );
}
