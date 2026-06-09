import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({
  title,
  eyebrow,
  query,
  limit = 8,
}: {
  title: string;
  eyebrow?: string;
  query?: string;
  limit?: number;
}) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", { query, limit }],
    queryFn: () => fetchProducts(limit, query),
  });

  return (
    <section id="promos" className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between gap-4 mb-8"
      >
        <div>
          {eyebrow && (
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-secondary animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/30 py-16 text-center">
          <p className="text-lg font-medium">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Your store is empty. Tell the chat what you'd like to sell — for
            example, "Add a linen shirt for $59" — and it'll appear here
            instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.node.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
