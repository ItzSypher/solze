import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductGrid } from "@/components/ProductGrid";
import { Reviews } from "@/components/Reviews";
import { useCartSync } from "@/hooks/useCartSync";
import { useTabTitle } from "@/hooks/useTabTitle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOJA SOLZE — Sun-kissed essentials" },
      {
        name: "description",
        content:
          "Slow design, warm tones and everyday pieces for sunlit days. Shop the LOJA SOLZE summer edit.",
      },
      { property: "og:title", content: "LOJA SOLZE — Sun-kissed essentials" },
      {
        property: "og:description",
        content:
          "Slow design, warm tones and everyday pieces for sunlit days.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useCartSync();
  useTabTitle("LOJA SOLZE — Sun-kissed essentials");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSlider />
        <ProductGrid eyebrow="Super promotions" title="Limited-time picks" />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
