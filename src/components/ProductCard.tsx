import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

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

export function ProductCard({ product, index = 0 }: { product: ShopifyProduct; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const discountPct = onSale
    ? Math.round(
        (1 - parseFloat(price.amount) / parseFloat(compareAt!.amount)) * 100,
      )
    : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="group"
    >
      <Link
        to="/product/$handle"
        params={{ handle: product.node.handle }}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.node.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {onSale && (
              <Badge className="bg-accent text-accent-foreground border-0 rounded-full">
                -{discountPct}%
              </Badge>
            )}
            {product.node.tags?.includes("limited") && (
              <Badge variant="outline" className="bg-background/80 rounded-full">
                Limited
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            onClick={handleAdd}
            disabled={isLoading || !variant}
            className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover:opacity-100 hover:bg-foreground/90"
            aria-label="Add to cart"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-3 px-1">
          <h3 className="text-sm font-medium text-foreground line-clamp-1">
            {product.node.title}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-semibold">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(compareAt!.amount, compareAt!.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
