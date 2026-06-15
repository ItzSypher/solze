import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { Header, Subfooter, Footer } from "./index";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const OLIVE = "#4A5A3B";
const RED = "#E63946";

const COLLECTIONS: Record<
  string,
  { title: string; description: string; eyebrow: string }
> = {
  bolsas: {
    eyebrow: "Coleção Solze",
    title: "BOLSAS OPERACIONAIS",
    description:
      "Construídas em Cordura® 1000D, com costuras reforçadas e garantia vitalícia. Para quem leva o trabalho a sério.",
  },
  mochilas: {
    eyebrow: "Linha Tactical",
    title: "MOCHILAS TÁTICAS",
    description:
      "Capacidade, organização modular MOLLE e conforto para missões longas e o dia a dia urbano.",
  },
  cintos: {
    eyebrow: "EDC Essentials",
    title: "CINTOS TÁTICOS",
    description:
      "Fivelas de liga metálica e webbing reforçado. Suporte real para coldres, pouches e acessórios.",
  },
  estojos: {
    eyebrow: "Range Ready",
    title: "ESTOJOS E ORGANIZADORES",
    description:
      "Proteção interna em EVA e divisórias ajustáveis. Transporte seguro do seu equipamento.",
  },
};

export const Route = createFileRoute("/collection/$handle")({
  head: ({ params }) => {
    const c = COLLECTIONS[params.handle] ?? {
      title: params.handle.toUpperCase(),
      description: "Coleção Solze",
    };
    return {
      meta: [
        { title: `${c.title} — Solze` },
        { name: "description", content: c.description },
      ],
    };
  },
  component: CollectionPage,
});

type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number;
  color: string;
  inStock: boolean;
  emoji: string;
  bg: string;
};

const COLORS = ["Preto", "Verde Oliva", "Coyote", "Cinza", "Multicam"];

const PRODUCTS: Product[] = [
  { id: "1", title: "Mochila Operator 45L", price: 899, compareAt: 1099, color: "Verde Oliva", inStock: true, emoji: "🎒", bg: "#4A5A3B" },
  { id: "2", title: "Bolsa Range Tactical", price: 549, color: "Preto", inStock: true, emoji: "👜", bg: "#1a1a1a" },
  { id: "3", title: "Mochila EDC 25L", price: 449, compareAt: 599, color: "Coyote", inStock: true, emoji: "🎒", bg: "#8B7355" },
  { id: "4", title: "Bolsa Transversal MOLLE", price: 289, color: "Preto", inStock: true, emoji: "👝", bg: "#2a2a2a" },
  { id: "5", title: "Mochila Assault 35L", price: 749, color: "Multicam", inStock: false, emoji: "🎒", bg: "#5a5a3a" },
  { id: "6", title: "Bolsa Operacional Pro", price: 1199, compareAt: 1499, color: "Verde Oliva", inStock: true, emoji: "💼", bg: "#4A5A3B" },
  { id: "7", title: "Estojo Tático Compacto", price: 199, color: "Cinza", inStock: true, emoji: "🧰", bg: "#6b6b6b" },
  { id: "8", title: "Mochila Recon 50L", price: 1049, color: "Coyote", inStock: true, emoji: "🎒", bg: "#8B7355" },
  { id: "9", title: "Bolsa Sling Urban", price: 329, compareAt: 429, color: "Preto", inStock: true, emoji: "👜", bg: "#1a1a1a" },
];

function CollectionPage() {
  useCartSync();
  const { handle } = Route.useParams();
  const setOpen = useCartStore((s) => s.setOpen);
  const meta = COLLECTIONS[handle] ?? {
    eyebrow: "Coleção",
    title: handle.toUpperCase(),
    description: "Produtos selecionados Solze.",
  };

  const [price, setPrice] = useState<[number, number]>([0, 1500]);
  const [colors, setColors] = useState<string[]>([]);
  const [readyOnly, setReadyOnly] = useState(false);
  const [sort, setSort] = useState("mais-vendidos");

  const filtered = useMemo(() => {
    let r = PRODUCTS.filter(
      (p) =>
        p.price >= price[0] &&
        p.price <= price[1] &&
        (colors.length === 0 || colors.includes(p.color)) &&
        (!readyOnly || p.inStock),
    );
    if (sort === "menor-preco") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "maior-preco") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [price, colors, readyOnly, sort]);

  const toggleColor = (c: string) =>
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      <CartDrawer />

      {/* Page Header Banner */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(120deg,#1f2a18 0%,${OLIVE} 60%,#6b7a55 100%)` }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 md:py-24 text-white">
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/70 mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span>Coleções</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{meta.title}</span>
          </motion.nav>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xs uppercase tracking-[0.25em] text-white/80 mb-3"
          >
            {meta.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            {meta.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 max-w-2xl text-base md:text-lg text-white/85"
          >
            {meta.description}
          </motion.p>
        </div>
      </section>

      {/* Main: filters + grid */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="flex items-center gap-2 font-display text-lg uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </div>

            <div className="rounded-[20px] border border-border bg-card/50 p-5">
              <h3 className="font-display uppercase text-sm tracking-wider mb-4">Preço</h3>
              <Slider
                value={price}
                onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
                min={0}
                max={1500}
                step={50}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ {price[0]}</span>
                <span>R$ {price[1]}</span>
              </div>
            </div>

            <div className="rounded-[20px] border border-border bg-card/50 p-5">
              <h3 className="font-display uppercase text-sm tracking-wider mb-4">Cor</h3>
              <div className="space-y-3">
                {COLORS.map((c) => (
                  <label key={c} className="flex items-center gap-3 text-sm cursor-pointer">
                    <Checkbox
                      checked={colors.includes(c)}
                      onCheckedChange={() => toggleColor(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-border bg-card/50 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display uppercase text-sm tracking-wider">Pronta Entrega</h3>
                <p className="text-xs text-muted-foreground mt-1">Envio em 24h</p>
              </div>
              <Switch checked={readyOnly} onCheckedChange={setReadyOnly} />
            </div>
          </aside>

          {/* Product area */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando <span className="text-foreground font-semibold">{filtered.length}</span>{" "}
                produtos
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-full border border-border bg-background pl-4 pr-10 h-10 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="mais-vendidos">Ordenar por: Mais Vendidos</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                  <option value="lancamentos">Lançamentos</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {filtered.map((p, i) => (
                <ProductCardRetail key={p.id} product={p} index={i} onBuy={() => setOpen(true)} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-16 text-center py-20 rounded-[20px] border border-dashed border-border">
                <Loader2 className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Nenhum produto encontrado com esses filtros.
                </p>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-full h-12 px-8 font-display uppercase tracking-wider"
                >
                  Carregar mais produtos
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Subfooter />
      <Footer />
    </div>
  );
}

function ProductCardRetail({
  product,
  index,
  onBuy,
}: {
  product: Product;
  index: number;
  onBuy: () => void;
}) {
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="group rounded-[20px] bg-white border border-border overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
    >
      <div
        className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ background: "#f4f4f1" }}
      >
        {discount > 0 && (
          <span
            className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full font-display text-xs uppercase tracking-wider text-white"
            style={{ background: RED }}
          >
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-black/70 text-white text-xs uppercase tracking-wider">
            Esgotado
          </span>
        )}
        <div
          className="w-3/4 h-3/4 rounded-2xl flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500"
          style={{ background: product.bg }}
        >
          <span className="drop-shadow-lg">{product.emoji}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.color}</p>
        <h3 className="font-display uppercase text-base mt-1 leading-tight line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          {product.compareAt && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {product.compareAt}
            </span>
          )}
          <span className="font-display text-3xl font-bold" style={{ color: RED }}>
            R$ {product.price}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ou 10x de R$ {(product.price / 10).toFixed(2).replace(".", ",")} sem juros
        </p>
        <Button
          onClick={onBuy}
          disabled={!product.inStock}
          className="mt-4 w-full h-11 rounded-full font-display uppercase tracking-wider text-white hover:opacity-90"
          style={{ background: product.inStock ? RED : "#999" }}
        >
          {product.inStock ? "Comprar" : "Indisponível"}
        </Button>
      </div>
    </motion.div>
  );
}
