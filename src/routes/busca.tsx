import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Search as SearchIcon, ShoppingBag, Loader2, X } from "lucide-react";
import { Header, Subfooter, Footer } from "@/routes/index";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import { useTabTitle } from "@/hooks/useTabTitle";
import { useCartStore } from "@/stores/cartStore";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";

const OLIVE = "#4A5A3B";
const RED = "#E63946";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/busca")({
  validateSearch: zodValidator(searchSchema),
  head: ({ search }) => ({
    meta: [
      {
        title: search.q
          ? `Busca: ${search.q} — Solze`
          : "Buscar produtos — Solze",
      },
      {
        name: "description",
        content: "Encontre mochilas táticas, EDC, MOLLE e acessórios Solze.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: SearchPage,
});

function formatBRL(amount: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(amount));
}

function SearchPage() {
  useCartSync();
  const { q } = Route.useSearch();
  useTabTitle(q ? `Busca: ${q} — Solze` : "Buscar — Solze");
  const navigate = useNavigate({ from: "/busca" });
  const [term, setTerm] = useState(q);

  const trimmed = q.trim();
  const shopifyQuery = trimmed
    ? `title:*${trimmed}* OR tag:${trimmed} OR product_type:${trimmed}`
    : undefined;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search", trimmed],
    queryFn: () => fetchProducts(48, shopifyQuery),
    enabled: trimmed.length > 0,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: { q: term.trim() } });
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pb-20">
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-8 sm:pt-12">
          <p className="font-display uppercase tracking-[0.25em] text-xs text-neutral-500">
            Resultados da busca
          </p>
          <h1 className="font-display uppercase text-3xl sm:text-5xl mt-1">
            {trimmed ? `"${trimmed}"` : "BUSCAR PRODUTOS"}
          </h1>

          <form onSubmit={submit} className="mt-6 max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="O que você procura?"
                className="w-full h-13 sm:h-14 pl-11 pr-28 rounded-[20px] border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-neutral-400"
                autoFocus
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  aria-label="Limpar"
                  className="absolute right-24 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 px-4 rounded-[20px] text-white font-display uppercase tracking-wider text-xs"
                style={{ backgroundColor: OLIVE }}
              >
                Buscar
              </button>
            </div>
          </form>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-10">
          {!trimmed ? (
            <EmptyState
              title="Digite para começar"
              sub="Tente: mochila, operator, edc, molle..."
            />
          ) : isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-[20px] bg-neutral-100 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title={`Nenhum resultado para "${trimmed}"`}
              sub="Verifique a grafia ou explore nossas coleções."
            />
          ) : (
            <>
              <p className="text-sm text-neutral-500 mb-4">
                {products.length} produto{products.length === 1 ? "" : "s"} encontrado
                {products.length === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p, i) => (
                  <ResultCard key={p.node.id} product={p} index={i} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Subfooter />
      <Footer />
      <CartDrawer />
    </div>
  );
}

function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-[20px] border border-dashed border-neutral-300 bg-neutral-50 py-20 text-center">
      <SearchIcon className="h-8 w-8 mx-auto text-neutral-400" />
      <p className="font-display uppercase text-lg mt-3">{title}</p>
      <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">{sub}</p>
      <Link
        to="/produtos"
        className="inline-block mt-5 h-11 px-6 rounded-[20px] text-white font-display uppercase tracking-wider text-xs leading-[2.75rem]"
        style={{ backgroundColor: OLIVE }}
      >
        Ver todos os produtos
      </Link>
    </div>
  );
}

function ResultCard({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  return (
    <div
      className="group rounded-[20px] border border-neutral-200 bg-white overflow-hidden flex flex-col animate-fade-up hover:shadow-lg transition-shadow"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Link
        to="/product/$handle"
        params={{ handle: product.node.handle }}
        className="relative aspect-square bg-neutral-50 flex items-center justify-center p-4"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-neutral-400 text-sm">Sem imagem</div>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm text-neutral-800 line-clamp-2 min-h-[2.5rem]">
          {product.node.title}
        </h3>
        <p
          className="font-display text-2xl leading-none"
          style={{ color: RED }}
        >
          {formatBRL(price.amount)}
        </p>
        <button
          disabled={!variant}
          onClick={() =>
            variant &&
            addItem({
              product,
              variantId: variant.id,
              variantTitle: variant.title,
              price: variant.price,
              quantity: 1,
              selectedOptions: variant.selectedOptions || [],
            })
          }
          className="bg-conversion hover:bg-conversion-hover transition-colors mt-auto h-11 rounded-[20px] font-display uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2 text-white disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4" /> Comprar
        </button>
      </div>
    </div>
  );
}
