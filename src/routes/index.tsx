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
      { title: "SOLZE Construção — Materiais e ferramentas para sua obra" },
      {
        name: "description",
        content:
          "Ferramentas, tintas, elétrica, hidráulica e materiais de construção com entrega rápida. Marcas pro e melhores preços.",
      },
      { property: "og:title", content: "SOLZE Construção" },
      {
        property: "og:description",
        content:
          "Tudo para sua obra com entrega rápida e parcelamento em até 12x.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useCartSync();
  useTabTitle("SOLZE Construção — Tudo para sua obra");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSlider />
        <Categories />
        <Benefits />
        <ProductGrid eyebrow="Ofertas da semana" title="Promoções da obra" />
        <Brands />
        <ProductGrid
          eyebrow="Mais vendidos"
          title="Top de vendas"
          limit={4}
        />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
