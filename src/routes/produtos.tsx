import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Flame, Sparkles, ChevronDown, Loader2 } from "lucide-react";
import { Header, Subfooter, Footer } from "./index";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { useCartSync } from "@/hooks/useCartSync";
import { Button } from "@/components/ui/button";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";

const OLIVE = "#4A5A3B";
const RED = "#E63946";
const GOLD = "#C6A87C";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Todos os Produtos — Solze Tactical" },
      {
        name: "description",
        content:
          "Explore toda a linha Solze: mochilas táticas, bolsas operacionais, MOLLE, EDC e acessórios. Pronta entrega e garantia vitalícia.",
      },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  useCartSync();
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"relevance" | "asc" | "desc">("relevance");
  const [visible, setVisible] = useState(16);

  const cat = CATEGORIES.find((c) => c.handle === activeCat);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["produtos", activeCat],
    queryFn: () => fetchProducts(100, cat?.query),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let r = products.filter((p) =>
      q ? p.node.title.toLowerCase().includes(q) || p.node.description?.toLowerCase().includes(q) : true,
    );
    if (sort === "asc")
      r = [...r].sort(
        (a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount),
      );
    if (sort === "desc")
      r = [...r].sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount),
      );
    return r;
  }, [products, search, sort]);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      <CartDrawer />

      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: `radial-gradient(1200px 500px at 80% 10%, ${GOLD}33 0%, transparent 60%), linear-gradient(120deg,#0d120a 0%,${OLIVE} 70%,#1a2010 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 14px)",
        }} />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-5"
            style={{ color: GOLD }}
          >
            <Sparkles className="h-4 w-4" /> Catálogo completo
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display uppercase text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95]"
          >
            TODOS OS<br />
            <span style={{ color: GOLD }}>PRODUTOS</span> SOLZE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-base md:text-lg text-white/85"
          >
            Equipamento tático construído em Cordura® 1000D para quem leva a missão a sério.
            Filtre por coleção, busque por nome e encontre seu próximo setup.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar mochila, bolsa, MOLLE..."
                className="w-full h-14 rounded-full bg-white text-neutral-900 pl-14 pr-6 text-base focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-xl"
          >
            {[
              { v: "100+", l: "Produtos" },
              { v: "24h", l: "Envio expresso" },
              { v: "∞", l: "Garantia" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="font-display text-3xl md:text-4xl font-bold" style={{ color: GOLD }}>
                  {s.v}
                </p>
                <p className="text-xs uppercase tracking-wider text-white/70 mt-1">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sticky category pills */}
      <div className="sticky top-[116px] z-20 bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCat("todos")}
            className={`shrink-0 px-4 h-10 rounded-full font-display uppercase tracking-wider text-xs transition-colors ${
              activeCat === "todos"
                ? "text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
            style={activeCat === "todos" ? { backgroundColor: OLIVE } : {}}
          >
            Todos
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.handle}
              onClick={() => setActiveCat(c.handle)}
              className={`shrink-0 px-4 h-10 rounded-full font-display uppercase tracking-wider text-xs transition-colors inline-flex items-center gap-1.5 ${
                activeCat === c.handle
                  ? "text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
              style={activeCat === c.handle ? { backgroundColor: OLIVE } : {}}
            >
              {c.handle === "outlet" && <Flame className="h-3.5 w-3.5" style={{ color: activeCat === c.handle ? GOLD : RED }} />}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-border">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              "Carregando produtos..."
            ) : (
              <>
                <span className="text-foreground font-semibold">{filtered.length}</span> produtos
                {cat && (
                  <>
                    {" "}em <span className="text-foreground font-semibold">{cat.label}</span>
                  </>
                )}
              </>
            )}
          </p>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="appearance-none rounded-full border border-border bg-background pl-4 pr-10 h-10 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="relevance">Ordenar por: Relevância</option>
              <option value="asc">Menor preço</option>
              <option value="desc">Maior preço</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center py-20 rounded-[20px] border border-dashed border-border">
            <Loader2 className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
            <Button
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => {
                setActiveCat("todos");
                setSearch("");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {filtered.slice(0, visible).map((p: ShopifyProduct, i: number) => (
                <ProductCard key={p.node.id} product={p} index={i} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={() => setVisible((v) => v + 16)}
                  className="rounded-full h-12 px-8 font-display uppercase tracking-wider text-white"
                  style={{ background: OLIVE }}
                >
                  Carregar mais produtos
                </Button>
              </div>
            )}
          </>
        )}

        {/* Bottom collection CTA */}
        <div className="mt-20 grid md:grid-cols-3 gap-4">
          {CATEGORIES.slice(0, 3).map((c) => (
            <Link
              key={c.handle}
              to="/collection/$handle"
              params={{ handle: c.handle }}
              className="group relative rounded-[20px] overflow-hidden text-white p-7 min-h-[180px] flex flex-col justify-end transition-transform hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg,${OLIVE} 0%,#1a1f12 100%)` }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                {c.eyebrow}
              </p>
              <h3 className="font-display uppercase text-2xl mt-1">{c.title}</h3>
              <p className="text-sm text-white/70 mt-2 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <Subfooter />
      <Footer />
    </div>
  );
}
