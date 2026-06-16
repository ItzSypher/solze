import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/_authenticated/favoritos")({
  head: () => ({ meta: [{ title: "Favoritos — Solze" }] }),
  component: FavPage,
});

function FavPage() {
  const { favorites, toggle } = useFavorites();

  return (
    <div className="min-h-screen bg-neutral-50 font-body">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold tracking-wider" style={{ color: "#4A5A3B" }}>SOLZE</Link>
          <Link to="/conta" className="text-sm font-display uppercase tracking-wider hover:underline">Minha conta</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-7 w-7" style={{ color: "#E63946" }} fill="#E63946" />
          <h1 className="font-display text-3xl font-bold tracking-wider uppercase">Meus favoritos</h1>
          <span className="text-sm text-muted-foreground">({favorites.length})</span>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-[20px] p-16 text-center border">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum favorito ainda</p>
            <p className="text-sm text-muted-foreground mt-2">Toque no coração nos produtos para salvar aqui.</p>
            <Link to="/" className="inline-block mt-6">
              <Button className="font-display uppercase tracking-wider" style={{ backgroundColor: "#E63946" }}>Explorar produtos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favorites.map((f, i) => (
              <motion.div
                key={f.product_handle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-[20px] border overflow-hidden group"
              >
                <Link to="/product/$handle" params={{ handle: f.product_handle }} className="block">
                  <div className="aspect-square bg-neutral-100 flex items-center justify-center p-4">
                    {f.product_image ? (
                      <img src={f.product_image} alt={f.product_title ?? ""} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-1">{f.product_title}</h3>
                    <p className="font-display font-bold text-lg mt-1" style={{ color: "#E63946" }}>{f.product_price}</p>
                  </div>
                </Link>
                <button
                  onClick={() => toggle({ product_handle: f.product_handle, product_title: f.product_title, product_image: f.product_image, product_price: f.product_price })}
                  className="w-full border-t py-2 text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-red-600 flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
