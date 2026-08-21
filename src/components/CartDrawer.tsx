import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Plus as PlusIcon,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cartStore";
import { fetchProducts } from "@/lib/shopify";
import logoAsset from "@/assets/solze-logo.png.asset.json";


function formatBRL(amount: number) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  } catch {
    return `R$ ${amount.toFixed(2)}`;
  }
}

function formatPrice(amount: number, _currency?: string) {
  return formatBRL(amount);
}

function useOrderBumps(excludeHandles: string[]) {
  const { data = [] } = useQuery({
    queryKey: ["products", { query: undefined, limit: 12 }],
    queryFn: () => fetchProducts(12),
    staleTime: 5 * 60 * 1000,
  });
  return data
    .filter((p) => !excludeHandles.includes(p.node.handle))
    .sort(
      (a, b) =>
        parseFloat(a.node.priceRange.minVariantPrice.amount) -
        parseFloat(b.node.priceRange.minVariantPrice.amount),
    )
    .slice(0, 3);
}


export function CartDrawer() {
  const {
    isOpen,
    setOpen,
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
    addItem,
  } = useCartStore();

  const bumps = useOrderBumps(items.map((i) => i.product.node.handle));

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);


  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "BRL";
  const totalPrice = items.reduce(
    (s, i) => s + parseFloat(i.price.amount) * i.quantity,
    0,
  );

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 bg-card border-l border-border">
        <SheetHeader className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <img src={logoAsset.url} alt="Solze" className="h-7 w-auto object-contain" />
          </div>
          <SheetTitle className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Seu equipamento
          </SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-sora)" }}>
            {totalItems === 0
              ? "Nenhum item ainda"
              : `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Comece a montar seu loadout.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => {
                  const img =
                    item.product.node.images?.edges?.[0]?.node?.url;
                  return (
                    <motion.div
                      key={item.variantId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                        {img && (
                          <img
                            src={img}
                            alt={item.product.node.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-bold truncate">
                          {item.product.node.title}
                        </h4>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {item.selectedOptions
                              .map((o) => o.value)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/40">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-display text-sm font-bold whitespace-nowrap">
                            {formatPrice(
                              parseFloat(item.price.amount) * item.quantity,
                              item.price.currencyCode,
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.variantId)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  );
                })}

                {/* Order Bump — produtos reais da loja */}
                {bumps.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-accent flex items-center gap-1.5">
                      <Zap className="h-3 w-3" /> Adicione agora
                    </p>
                    <p className="mt-1 font-display text-sm font-bold">
                      Complete seu kit
                    </p>
                    <div className="mt-3 space-y-2">
                      {bumps.map((p) => {
                        const v = p.node.variants.edges[0]?.node;
                        const img = p.node.images.edges[0]?.node;
                        return (
                          <motion.button
                            key={p.node.id}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!v || isLoading}
                            onClick={() =>
                              v &&
                              addItem({
                                product: p,
                                variantId: v.id,
                                variantTitle: v.title,
                                price: v.price,
                                quantity: 1,
                                selectedOptions: v.selectedOptions || [],
                              })
                            }
                            className="w-full flex items-center justify-between gap-3 rounded-xl bg-card border border-border p-3 hover:border-accent/40 transition-colors text-left group disabled:opacity-60"
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                                {img && (
                                  <img
                                    src={img.url}
                                    alt={p.node.title}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                  />
                                )}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium truncate">
                                  {p.node.title}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                  <PlusIcon className="h-3 w-3" /> Adicionar
                                </span>
                              </span>
                            </span>
                            <span className="font-display text-sm font-bold text-accent whitespace-nowrap shrink-0">
                              +{" "}
                              {formatBRL(
                                parseFloat(
                                  (v?.price ?? p.node.priceRange.minVariantPrice)
                                    .amount,
                                ),
                              )}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              <div className="border-t border-border px-6 py-5 space-y-3 bg-card">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl font-extrabold tracking-tight">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Frete e impostos calculados no checkout.
                </p>
                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold glow-accent"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Finalizar compra
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
