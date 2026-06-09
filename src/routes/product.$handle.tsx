import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  PlayCircle,
  RotateCw,
  ShoppingBag,
  Truck,
  Package,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { useTabTitle } from "@/hooks/useTabTitle";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — LOJA SOLZE` },
      {
        name: "description",
        content: `Shop ${params.handle} at LOJA SOLZE.`,
      },
    ],
  }),
  component: ProductPage,
});

function formatPrice(amount: string, currency: string) {
  const n = parseFloat(amount);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

function ProductPage() {
  const { handle } = Route.useParams();
  useCartSync();
  useTabTitle(`${handle} — LOJA SOLZE`);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProduct(handle),
  });

  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  const [imgIdx, setImgIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [postalCode, setPostalCode] = useState("");
  const [shippingShown, setShippingShown] = useState(false);

  const variant = useMemo(() => {
    if (!product) return null;
    const variants = product.node.variants.edges;
    const match = variants.find((v) =>
      v.node.selectedOptions.every((o) => selected[o.name] === o.value),
    );
    return (match ?? variants[0])?.node ?? null;
  }, [product, selected]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!product) {
    throw notFound();
  }

  const images = product.node.images.edges;
  const price = variant?.price ?? product.node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 md:pb-12">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to shop
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <motion.div
            key={imgIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-secondary"
          >
            {images[imgIdx]?.node ? (
              <img
                src={images[imgIdx].node.url}
                alt={images[imgIdx].node.altText ?? product.node.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}

            <div className="absolute bottom-4 left-4 flex gap-2">
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur rounded-full gap-1"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Video coming soon
              </Badge>
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur rounded-full gap-1"
              >
                <RotateCw className="h-3.5 w-3.5" />
                360° view
              </Badge>
            </div>
          </motion.div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square overflow-hidden rounded-xl bg-secondary transition ${
                    i === imgIdx
                      ? "ring-2 ring-foreground"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.node.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            LOJA SOLZE
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            {product.node.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {onSale && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(compareAt!.amount, compareAt!.currencyCode)}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.node.description || "A piece made to wear daily."}
          </p>

          {/* Variant selectors */}
          {product.node.options.map((opt) => {
            if (opt.values.length <= 1) return null;
            const current =
              selected[opt.name] ??
              variant?.selectedOptions.find((o) => o.name === opt.name)?.value;
            return (
              <div key={opt.name} className="mt-6">
                <p className="text-sm font-medium mb-2">
                  {opt.name}
                  {current && (
                    <span className="ml-2 text-muted-foreground font-normal">
                      {current}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSelected((p) => ({ ...p, [opt.name]: val }))
                      }
                      className={`min-w-12 rounded-full border px-4 py-2 text-sm transition ${
                        current === val
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background hover:border-foreground/40"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Shipping calculator */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Shipping</p>
            </div>
            <div className="flex gap-2">
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
                className="rounded-full"
              />
              <Button
                variant="outline"
                onClick={() => setShippingShown(postalCode.trim().length > 0)}
                className="rounded-full"
              >
                Calculate
              </Button>
            </div>
            {shippingShown && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-2 text-sm"
              >
                <div className="flex justify-between items-center rounded-xl bg-secondary/60 px-3 py-2">
                  <span>Get it tomorrow</span>
                  <span className="font-semibold">$15.00</span>
                </div>
                <div className="flex justify-between items-center rounded-xl bg-accent/20 px-3 py-2">
                  <span>Get it in 7 days</span>
                  <span className="font-semibold">FREE</span>
                </div>
              </motion.div>
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              30-day easy returns
            </div>
          </div>

          {/* Desktop add to cart */}
          <Button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            size="lg"
            className="mt-8 hidden md:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 px-8"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to cart — {formatPrice(price.amount, price.currencyCode)}
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Sticky mobile add to cart */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
        <Button
          onClick={handleAdd}
          disabled={isAdding || !variant?.availableForSale}
          className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-12"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add — {formatPrice(price.amount, price.currencyCode)}
            </>
          )}
        </Button>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
