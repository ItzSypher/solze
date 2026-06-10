import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";

const NAV = [
  { label: "Mochilas Táticas", href: "#categorias" },
  { label: "Operator", href: "#categorias" },
  { label: "EDC", href: "#categorias" },
  { label: "MOLLE & Acessórios", href: "#categorias" },
  { label: "Range Bags", href: "#categorias" },
  { label: "Outlet", href: "#promos" },
];

export function Header() {
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="hidden md:flex h-9 items-center justify-between max-w-[1400px] mx-auto px-4 sm:px-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-accent" /> Expresso em 24h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Garantia vitalícia
          </span>
        </div>
        <span>Frete grátis acima de R$ 399</span>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground font-display font-extrabold">
              S
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              SOLZE
              <span className="ml-1.5 text-[10px] uppercase tracking-[0.2em] text-accent align-middle">
                Tactical
              </span>
            </span>
          </Link>

          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar bolsas, mochilas, MOLLE..."
                className="pl-10 h-10 rounded-full bg-secondary/60 border-white/10 focus-visible:ring-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/5"
              onClick={() => setOpen(true)}
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground border-0">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <nav className="hidden md:flex h-11 items-center gap-7 max-w-[1400px] mx-auto px-4 sm:px-6 text-[13px] font-medium text-muted-foreground border-t border-white/5 overflow-x-auto">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="relative hover:text-foreground transition-colors whitespace-nowrap py-3 group"
            >
              {n.label}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
