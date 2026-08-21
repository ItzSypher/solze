import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { Header, Subfooter, Footer } from "./index";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { useCartSync } from "@/hooks/useCartSync";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { findCategory, CATEGORIES } from "@/lib/categories";

const OLIVE = "#4A5A3B";

export const Route = createFileRoute("/collection/$handle")({
  head: ({ params }) => {
    const c = findCategory(params.handle);
    return {
      meta: [
        { title: `${c.title} — Solze` },
        { name: "description", content: c.description },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  useCartSync();
  const { handle } = Route.useParams();
  const meta = findCategory(handle);

  const [price, setPrice] = useState<[number, number]>([0, 3000]);
  const [readyOnly, setReadyOnly] = useState(false);
  const [sort, setSort] = useState<"relevance" | "asc" | "desc">("relevance");
  const [visible, setVisible] = useState(12);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["collection", meta.handle],
    queryFn: () => fetchProducts(50, meta.query),
  });

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      const amt = parseFloat(p.node.priceRange.minVariantPrice.amount);
      const available = p.node.variants.edges.some((v) => v.node.availableForSale);
      return amt >= price[0] && amt <= price[1] && (!readyOnly || available);
    });
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
  }, [products, price, readyOnly, sort]);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      <CartDrawer />

      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(120deg,#1f2a18 0%,${OLIVE} 60%,#6b7a55 100%)` }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 md:py-20 text-white">
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/70 mb-6"
          >
            <Link to="/" className="hover:text-white">Início</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/produtos" className="hover:text-white">Produtos</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{meta.title}</span>
          </motion.nav>
          <p className="text-xs uppercase tracking-[0.25em] text-white/80 mb-3">{meta.eyebrow}</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/85">{meta.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.handle !== meta.handle).slice(0, 6).map((c) => (
              <Link
                key={c.handle}
                to="/collection/$handle"
                params={{ handle: c.handle }}
                className="px-3 h-8 rounded-full text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 transition-colors inline-flex items-center"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <div className="flex items-center gap-2 font-display text-lg uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </div>

            <div className="rounded-[20px] border border-border bg-card/50 p-5">
              <h3 className="font-display uppercase text-sm tracking-wider mb-4">Preço</h3>
              <Slider
                value={price}
                onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
                min={0}
                max={3000}
                step={50}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ {price[0]}</span>
                <span>R$ {price[1]}</span>
              </div>
            </div>

            <div className="rounded-[20px] border border-border bg-card/50 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display uppercase text-sm tracking-wider">Pronta Entrega</h3>
                <p className="text-xs text-muted-foreground mt-1">Disponível agora</p>
              </div>
              <Switch checked={readyOnly} onCheckedChange={setReadyOnly} />
            </div>

            <div className="rounded-[20px] border border-border bg-card/50 p-5">
              <h3 className="font-display uppercase text-sm tracking-wider mb-3">Coleções</h3>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.handle}
                    to="/collection/$handle"
                    params={{ handle: c.handle }}
                    className={`text-sm py-1.5 transition-colors ${
                      c.handle === meta.handle
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Carregando produtos..."
                ) : (
                  <>
                    Mostrando{" "}
                    <span className="text-foreground font-semibold">
                      {Math.min(visible, filtered.length)}
                    </span>{" "}
                    de <span className="text-foreground font-semibold">{filtered.length}</span> produtos
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
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-16 text-center py-20 rounded-[20px] border border-dashed border-border">
                <Loader2 className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhum produto encontrado nesta coleção.</p>
                <Link
                  to="/produtos"
                  className="inline-block mt-4 text-sm font-semibold text-foreground underline"
                >
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                  {filtered.slice(0, visible).map((p: ShopifyProduct, i: number) => (
                    <ProductCard key={p.node.id} product={p} index={i} />
                  ))}
                </div>
                {visible < filtered.length && (
                  <div className="mt-12 flex justify-center">
                    <Button
                      onClick={() => setVisible((v) => v + 12)}
                      variant="outline"
                      className="rounded-full h-12 px-8 font-display uppercase tracking-wider"
                    >
                      Carregar mais produtos
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Subfooter />
      <Footer />
    </div>
  );
}
