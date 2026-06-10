import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";

const NAV = [
  { label: "Ferramentas", href: "#categorias" },
  { label: "Elétrica", href: "#categorias" },
  { label: "Hidráulica", href: "#categorias" },
  { label: "Tintas", href: "#categorias" },
  { label: "Construção", href: "#categorias" },
  { label: "Ofertas", href: "#promos" },
];

export function Header() {
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="hidden md:flex h-8 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 text-xs text-muted-foreground border-b border-border/40">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Entrega em todo Brasil
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> 0800 000 0000
          </span>
        </div>
        <span>Frete grátis acima de R$ 300</span>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight hidden sm:inline">
            SOLZE <span className="text-accent-foreground/80">Construção</span>
          </span>
        </Link>

        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ferramentas, tintas, materiais..."
              className="pl-9 rounded-full bg-secondary/60 border-border/80"
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
            className="relative"
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

      <nav className="hidden md:flex h-10 items-center gap-6 max-w-7xl mx-auto px-4 sm:px-6 text-sm text-muted-foreground border-t border-border/40 overflow-x-auto">
        {NAV.map((n) => (
          <a
            key={n.label}
            href={n.href}
            className="hover:text-foreground transition-colors whitespace-nowrap"
          >
            {n.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
