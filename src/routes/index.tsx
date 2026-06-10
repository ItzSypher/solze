import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { HeroSlider } from "@/components/HeroSlider";
import { Categories } from "@/components/Categories";
import { Benefits } from "@/components/Benefits";
import { Brands } from "@/components/Brands";
import { ProductGrid } from "@/components/ProductGrid";
import { Reviews } from "@/components/Reviews";
import { useCartSync } from "@/hooks/useCartSync";
import { useTabTitle } from "@/hooks/useTabTitle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solze — Bolsas táticas e profissionais premium" },
      {
        name: "description",
        content:
          "Bolsas táticas de alta performance. CORDURA® 1000D, sistema MOLLE, garantia vitalícia. Frete expresso em 24h.",
      },
      { property: "og:title", content: "Solze — Tactical Grade" },
      {
        property: "og:description",
        content: "Equipamento de alta performance para profissionais.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useCartSync();
  useTabTitle("Solze — Tactical Grade");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSlider />
        <Categories />
        <Benefits />
        <ProductGrid eyebrow="/ Drop atual" title="Operator Series" />
        <Brands />
        <ProductGrid
          eyebrow="/ Bestsellers"
          title="Mais escolhidas em campo"
          limit={4}
        />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
