import { subscribeEmail } from "@/lib/newsletter";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  Phone,
  Truck,
  RefreshCcw,
  ShieldCheck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import { useTabTitle } from "@/hooks/useTabTitle";
import { useCartStore } from "@/stores/cartStore";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { InstagramFeed as IGFeed } from "@/components/InstagramFeed";
import { WelcomePopup } from "@/components/WelcomePopup";
import { LifestyleBanner } from "@/components/LifestyleBanner";
import logoAsset from "@/assets/solze-logo.png.asset.json";
import heroDurar from "@/assets/hero-durar.png.asset.json";
import heroMochilas from "@/assets/hero-mochilas.png.asset.json";
import heroReforco from "@/assets/hero-reforco.png.asset.json";
import promo24h from "@/assets/promo-24h.png.asset.json";
import promo50off from "@/assets/promo-50off.png.asset.json";
import promo50offWide from "@/assets/promo-50off-wide.png.asset.json";
import essencialImg from "@/assets/essencial.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solze — Bolsas e acessórios para ferramentas" },
      {
        name: "description",
        content:
          "Loja oficial Solze. Bolsas, mochilas, estojos e cintos para ferramentas. Feitos pra aguentar o dia a dia de quem trabalha com as mãos.",
      },
      { property: "og:title", content: "Solze — Bolsas e acessórios para ferramentas" },
      {
        property: "og:description",
        content:
          "Loja oficial Solze. Bolsas, mochilas, estojos e cintos para ferramentas.",
      },
      { property: "og:url", content: "https://shop-love-joy.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://shop-love-joy.lovable.app/" }],
  }),
  component: HomePage,
});

const OLIVE = "#4A5A3B";
const RED = "#E63946";
const GOLD = "#C6A87C";

const DEPARTMENTS = CATEGORIES.filter((c) => c.handle !== "outlet");

const HERO_SLIDES = [
  {
    eyebrow: "Linha Profissional",
    title: "BOLSAS E MOCHILAS\nCONSTRUÍDAS PARA DURAR",
    cta: "COMPRAR AGORA",
    bg: "linear-gradient(120deg,#1f2a18 0%,#4A5A3B 60%,#6b7a55 100%)",
    img: heroDurar.url,
  },
  {
    eyebrow: "Frete grátis acima de R$ 399",
    title: "FEITO PRA AGUENTAR\nO TRABALHO",
    cta: "VER COLEÇÃO",
    bg: "linear-gradient(120deg,#0f0f0f 0%,#2a2a2a 60%,#4A5A3B 100%)",
    img: heroMochilas.url,
  },
  {
    eyebrow: "Material reforçado",
    title: "REFORÇO DUPLO\nEM CADA COSTURA",
    cta: "EXPLORAR",
    bg: "linear-gradient(120deg,#2a1a0e 0%,#5a3a1f 60%,#C6A87C 100%)",
    img: heroReforco.url,
  },
];


function formatBRL(amount: string) {
  const n = parseFloat(amount);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

function HomePage() {
  useCartSync();
  useTabTitle("Solze — Acessórios para Ferramentas");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pb-20">
        <Hero />
        <BentoCollections />
        <ProductsCarousel
          title="MAIS VENDIDOS"
          eyebrow="Top da semana"
          limit={8}
        />
        <LifestyleBanner variant="operator" />
        <ProductsCarousel
          title="LANÇAMENTOS"
          eyebrow="Acabou de chegar"
          limit={8}
          query="tag:new"
        />
        <LifestyleBanner variant="edc" />
        <ProductsCarousel
          title="OFERTAS DA SEMANA"
          eyebrow="Ofertas Solze"
          limit={8}
          query="tag:sale OR tag:outlet"
        />
        <LifestyleBanner variant="outlet" />
        <IGFeed />
      </main>
      <Subfooter />
      <Footer />
      <CartDrawer />
      <WelcomePopup />
    </div>
  );
}

/* ============ HEADER ============ */
export function Header() {
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const setOpen = useCartStore((s) => s.setOpen);
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    navigate({ to: "/busca", search: { q } });
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Utility bar */}
      <div className="bg-neutral-900 text-white text-[12px]">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="hidden md:flex items-center gap-5 tracking-wide">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" style={{ color: GOLD }} /> FRETE GRÁTIS ACIMA DE R$ 399
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: GOLD }} /> GARANTIA DE 3 MESES
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 ml-auto text-white/80">
            <Link to="/produtos" className="hidden sm:inline hover:text-white">Atendimento</Link>
            <Link to="/produtos" className="hidden sm:inline hover:text-white">Rastrear pedido</Link>
            <a href="tel:+552141375008" className="hover:text-white inline-flex items-center gap-1">
              <Phone className="h-3 w-3" /> (21) 4137-5008
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto flex h-16 sm:h-20 max-w-[1400px] items-center gap-3 sm:gap-6 px-4 sm:px-6">
          <button
            className="lg:hidden text-neutral-900 shrink-0"
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="shrink-0">
            <img src={logoAsset.url} alt="Solze" className="h-8 sm:h-10 w-auto object-contain" />
          </Link>

          <form
            onSubmit={submitSearch}
            className="flex-1 max-w-2xl mx-auto hidden sm:block"
          >
            <div className="relative">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar bolsas, mochilas, cintos e acessórios..."
                className="w-full h-12 rounded-[20px] border border-neutral-200 bg-neutral-50 pl-5 pr-12 text-sm focus:outline-none focus:border-neutral-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-[20px] flex items-center justify-center text-white"
                style={{ backgroundColor: OLIVE }}
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-0 sm:gap-1 ml-auto text-neutral-700">
            <Link
              to="/busca"
              search={{ q: "" }}
              className="sm:hidden flex items-center justify-center h-10 w-10 hover:text-neutral-900"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link to="/conta" className="hidden md:flex flex-col items-center px-3 hover:text-neutral-900">
              <User className="h-5 w-5" />
              <span className="text-[10px] font-display uppercase tracking-wider mt-0.5">Conta</span>
            </Link>
            <Link to="/favoritos" className="hidden md:flex flex-col items-center px-3 hover:text-neutral-900">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] font-display uppercase tracking-wider mt-0.5">Favoritos</span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="relative flex flex-col items-center px-2 sm:px-3 hover:text-neutral-900"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline text-[10px] font-display uppercase tracking-wider mt-0.5">Carrinho</span>
              {totalItems > 0 && (
                <span
                  className="absolute top-0 right-0 sm:right-1 h-5 min-w-5 rounded-full px-1 text-[10px] font-display font-bold flex items-center justify-center text-white"
                  style={{ backgroundColor: RED }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="sm:hidden border-t border-neutral-200 px-4 py-3 bg-white">
          <form onSubmit={submitSearch} className="relative">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full h-11 rounded-[20px] border border-neutral-200 bg-neutral-50 pl-4 pr-12 text-sm focus:outline-none focus:border-neutral-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-8 w-8 rounded-[20px] flex items-center justify-center text-white"
              style={{ backgroundColor: OLIVE }}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Departments green nav */}
        <nav style={{ backgroundColor: OLIVE }} className="text-white relative hidden lg:block">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 flex items-center gap-1 h-12 overflow-visible">
            {/* Mega menu trigger */}
            <div className="relative h-full group">
              <button className="inline-flex items-center gap-2 font-display uppercase tracking-wider text-[13px] px-4 h-full bg-black/15 group-hover:bg-black/30 transition-colors">
                <Menu className="h-4 w-4" /> Departamentos
              </button>
              {/* Mega menu panel */}
              <div
                className="absolute left-0 top-full z-50 pt-0 w-[680px] max-w-[92vw]
                  opacity-0 invisible translate-y-2
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 ease-out"
              >
                <div className="bg-white text-foreground shadow-2xl rounded-b-[20px] overflow-hidden border border-border grid grid-cols-[1fr_240px]">
                  <div className="p-6">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                      Navegue por categoria
                    </p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {DEPARTMENTS.slice(0, 6).map((c) => (
                        <li key={c.handle}>
                          <Link
                            to="/collection/$handle"
                            params={{ handle: c.handle }}
                            className="group/item flex items-center justify-between py-2.5 border-b border-border/60 hover:border-transparent"
                          >
                            <span className="font-display uppercase tracking-wider text-[13px] group-hover/item:text-[color:var(--accent)] transition-colors">
                              {c.label}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/produtos"
                      className="inline-flex items-center gap-2 mt-5 font-display uppercase tracking-wider text-[12px]"
                      style={{ color: RED }}
                    >
                      Ver todos os produtos <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  {/* Featured */}
                  <Link
                    to="/collection/$handle"
                    params={{ handle: "mochilas" }}
                    className="relative block bg-secondary/60 group/feat overflow-hidden"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(160deg,#1f2a18 0%,#4A5A3B 65%,#6b7a55 100%)",
                      }}
                    />
                    <div className="relative h-full p-5 flex flex-col justify-between text-white">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] opacity-80">
                          Destaque
                        </p>
                        <h4 className="font-display uppercase text-lg leading-tight mt-1">
                          Mochila Porta-Ferramentas
                        </h4>
                      </div>
                      <div className="self-end h-24 w-24 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl transition-transform duration-500 group-hover/feat:scale-110">
                        🎒
                      </div>
                      <div>
                        <p className="font-display text-2xl" style={{ color: GOLD }}>
                          R$ 899
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider mt-1 opacity-90">
                          Comprar <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {DEPARTMENTS.map((d) => (
              <Link
                key={d.handle}
                to="/collection/$handle"
                params={{ handle: d.handle }}
                className="font-display uppercase tracking-wider text-[12.5px] px-4 h-full inline-flex items-center hover:bg-black/15 whitespace-nowrap transition-colors"
              >
                {d.label}
              </Link>
            ))}
            <Link
              to="/ofertas"
              className="ml-auto font-display uppercase tracking-wider text-[12.5px] px-4 h-full inline-flex items-center"
              style={{ color: GOLD }}
            >
              ★ Ofertas da semana
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white text-neutral-900 flex flex-col animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-200">
              <img src={logoAsset.url} alt="Solze" className="h-8 w-auto object-contain" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-neutral-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              <p className="px-5 pt-4 pb-2 text-[10px] font-display uppercase tracking-[0.25em] text-neutral-500">
                Departamentos
              </p>
              {DEPARTMENTS.map((d) => (
                <Link
                  key={d.handle}
                  to="/collection/$handle"
                  params={{ handle: d.handle }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 font-display uppercase tracking-wider text-sm border-b border-neutral-100 hover:bg-neutral-50"
                >
                  {d.label}
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </Link>
              ))}
              <Link
                to="/ofertas"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-3.5 font-display uppercase tracking-wider text-sm border-b border-neutral-100"
                style={{ color: RED }}
              >
                ★ Ofertas da semana
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/produtos"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-3.5 font-display uppercase tracking-wider text-sm border-b border-neutral-100"
              >
                Todos os produtos
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </Link>
              <p className="px-5 pt-5 pb-2 text-[10px] font-display uppercase tracking-[0.25em] text-neutral-500">
                Sua conta
              </p>
              <Link
                to="/conta"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-neutral-50"
              >
                <User className="h-4 w-4" /> Minha conta
              </Link>
              <Link
                to="/favoritos"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-neutral-50"
              >
                <Heart className="h-4 w-4" /> Favoritos
              </Link>
            </nav>
            <div className="px-5 py-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
              <p className="inline-flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" style={{ color: OLIVE }} /> (21) 4137-5008
              </p>
              <p className="inline-flex items-center gap-2">
                <Truck className="h-3.5 w-3.5" style={{ color: OLIVE }} /> Frete grátis acima R$ 399
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ============ HERO ============ */
function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[idx];

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Big slider */}
        <div
          key={idx}
          className="relative aspect-[5/4] sm:aspect-[16/9] lg:aspect-auto lg:h-[460px] rounded-[20px] overflow-hidden text-white animate-fade-up"
          style={{ background: slide.bg }}
        >
          <img
            src={slide.img}
            alt=""
            aria-hidden="true"
            fetchPriority={idx === 0 ? "high" : "low"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          <div className="absolute inset-0 p-5 sm:p-8 lg:p-14 flex flex-col justify-end">

            <p
              className="font-display uppercase tracking-[0.25em] text-[10px] sm:text-xs mb-2 sm:mb-3"
              style={{ color: GOLD }}
            >
              {slide.eyebrow}
            </p>
            <h1 className="font-display uppercase text-2xl sm:text-4xl lg:text-6xl leading-[1] sm:leading-[0.95] whitespace-pre-line text-balance">
              {slide.title}
            </h1>
            <div className="mt-4 sm:mt-6">
              <button
                className="bg-conversion hover:bg-conversion-hover transition-colors font-display uppercase tracking-wider text-xs sm:text-sm px-5 sm:px-7 h-11 sm:h-12 rounded-[20px] inline-flex items-center gap-2"
              >
                {slide.cta} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={() => setIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-[20px] bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-[20px] bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-5 right-6 flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-8 bg-white" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stacked promos */}
        <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3 sm:gap-4">
          <div
            className="relative overflow-hidden rounded-[20px] p-4 sm:p-7 flex flex-col justify-between gap-3 text-white animate-fade-up min-h-[140px] sm:min-h-[160px]"
            style={{
              animationDelay: "120ms",
              background: `linear-gradient(135deg,${OLIVE} 0%,#2a3322 100%)`,
            }}
          >
            <img
              src={promo24h.url}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(150deg, rgba(31,42,24,0.88) 0%, rgba(31,42,24,0.55) 60%, rgba(0,0,0,0.35) 100%)",
              }}
            />
            <div className="relative">
              <p className="font-display uppercase tracking-[0.25em] text-[10px]" style={{ color: GOLD }}>
                Frete expresso
              </p>
              <h2 className="font-display uppercase text-lg sm:text-2xl leading-tight mt-2">
                ENTREGA EM<br />24 HORAS
              </h2>
            </div>
            <Link to="/produtos" className="relative font-display uppercase tracking-wider text-xs inline-flex items-center gap-1">
              Saiba mais <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div
            className="relative overflow-hidden rounded-[20px] p-4 sm:p-7 flex flex-col justify-between gap-3 text-white animate-fade-up min-h-[140px] sm:min-h-[160px]"
            style={{
              animationDelay: "220ms",
              background: `linear-gradient(135deg,#1a1a1a 0%,#3a3a3a 100%)`,
            }}
          >
            <img
              src={promo50off.url}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(150deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 60%, rgba(0,0,0,0.3) 100%)",
              }}
            />
            <div className="relative">
              <p className="font-display uppercase tracking-[0.25em] text-[10px]" style={{ color: RED }}>
                Ofertas Solze
              </p>
              <h2 className="font-display uppercase text-lg sm:text-2xl leading-tight mt-2">
                ATÉ <span style={{ color: RED }}>50% OFF</span><br />EM SELECIONADOS
              </h2>
            </div>
            <Link to="/ofertas" className="relative font-display uppercase tracking-wider text-xs inline-flex items-center gap-1">
              Aproveitar <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

        </div>
      </div>

      {/* Trust strip */}
      <div className="mt-4 rounded-[20px] bg-neutral-50 border border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden">
        {[
          { icon: Truck, t: "Frete grátis", s: "Acima de R$ 399" },
          { icon: CreditCard, t: "Até 10x", s: "Sem juros" },
          { icon: RefreshCcw, t: "Troca fácil", s: "Em até 30 dias" },
          { icon: ShieldCheck, t: "Garantia", s: "3 meses em toda linha" },
        ].map((b, i) => (
          <div key={i} className="bg-white p-5 flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-[20px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: OLIVE }}
            >
              <b.icon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-display uppercase text-sm tracking-wider leading-tight">{b.t}</p>
              <p className="text-xs text-neutral-500">{b.s}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ BENTO ============ */
function BentoCollections() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="font-display uppercase tracking-[0.25em] text-xs text-neutral-500">
            Nossas categorias
          </p>
          <h2 className="font-display uppercase text-3xl lg:text-4xl mt-1">
            ENCONTRE O EQUIPAMENTO CERTO PRA SUA FUNÇÃO
          </h2>
        </div>
        <Link
          to="/produtos"
          className="hidden md:inline-flex font-display uppercase tracking-wider text-xs items-center gap-1.5"
          style={{ color: OLIVE }}
        >
          Ver todas as coleções <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:h-[480px]">
        <BentoCard
          className="sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[260px] animate-fade-up"
          handle="mochilas"
          eyebrow="Destaque"
          title="MOCHILAS"
          subtitle="Mochilas pra carregar tudo que sua função exige"
          bg={`linear-gradient(135deg,${OLIVE} 0%,#1a1f12 100%)`}
          img={heroMochilas.url}
          large
        />
        <BentoCard
          className="animate-fade-up"
          style={{ animationDelay: "120ms" }}
          handle="estojos"
          eyebrow="Organização"
          title="ESTOJOS"
          subtitle="O essencial sempre à mão"
          bg="linear-gradient(135deg,#2a2a2a 0%,#0a0a0a 100%)"
          img={promo50offWide.url}
        />
        <BentoCard
          className="animate-fade-up"
          style={{ animationDelay: "200ms" }}
          handle="acessorios"
          eyebrow="Acessórios"
          title="CINTOS & ACESSÓRIOS"
          subtitle="Ferramenta na mão, sem perder tempo procurando"
          bg={`linear-gradient(135deg,#3a2a1a 0%,${GOLD} 120%)`}
          img={essencialImg.url}
        />

      </div>
    </section>
  );
}

function BentoCard({
  handle,
  eyebrow,
  title,
  subtitle,
  bg,
  img,
  large = false,
  className = "",
  style,
}: {
  handle: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bg: string;
  img?: string;
  large?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      to="/collection/$handle"
      params={{ handle }}
      className={`group relative rounded-[20px] overflow-hidden text-white p-5 sm:p-7 flex flex-col justify-end transition-transform hover:-translate-y-1 min-h-[180px] ${className}`}
      style={{ background: bg, ...style }}
    >
      {img && (
        <>
          <img
            src={img}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        </>
      )}
      <div className="relative">
      <p
        className="font-display uppercase tracking-[0.25em] text-[10px] mb-2"
        style={{ color: GOLD }}
      >
        {eyebrow}
      </p>

      <h3
        className={`font-display uppercase leading-[0.95] ${
          large ? "text-4xl sm:text-5xl lg:text-7xl" : "text-xl sm:text-2xl lg:text-3xl"
        }`}
      >
        {title}
      </h3>
      <p className="text-sm text-white/80 mt-2">{subtitle}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 font-display uppercase text-xs tracking-wider">
        Explorar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
      </div>
    </Link>

  );
}

/* ============ PRODUCTS CAROUSEL ============ */
function ProductsCarousel({
  title,
  eyebrow,
  limit = 8,
  query,
}: {
  title: string;
  eyebrow: string;
  limit?: number;
  query?: string;
}) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", { query, limit }],
    queryFn: () => fetchProducts(limit, query),
  });

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="font-display uppercase tracking-[0.25em] text-xs text-neutral-500">
            {eyebrow}
          </p>
          <h2 className="font-display uppercase text-3xl lg:text-4xl mt-1">{title}</h2>
        </div>
        <Link
          to="/produtos"
          className="hidden md:inline-flex font-display uppercase tracking-wider text-xs items-center gap-1.5"
          style={{ color: OLIVE }}
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-[20px] bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
          <p className="font-display uppercase text-lg">Nenhum produto encontrado</p>
          <p className="text-sm text-neutral-500 mt-2">
            Adicione produtos na sua loja para vê-los aqui.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile/tablet: real horizontal carousel with snap */}
          <div className="md:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {products.map((p, i) => (
                <div
                  key={p.node.id}
                  className="snap-start shrink-0 w-[70vw] sm:w-[44vw] max-w-[280px]"
                >
                  <ProductCardRetail product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCardRetail key={p.node.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ProductCardRetail({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const discount = onSale
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAt!.amount)) * 100)
    : 0;

  return (
    <div
      className="group rounded-[20px] border border-neutral-200 bg-white overflow-hidden flex flex-col animate-fade-up hover:shadow-lg transition-shadow"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link
        to="/product/$handle"
        params={{ handle: product.node.handle }}
        className="relative aspect-square bg-neutral-50 flex items-center justify-center p-4"
      >
        {onSale && (
          <span
            className="absolute top-3 left-3 px-2.5 h-7 rounded-[20px] text-white font-display uppercase text-xs flex items-center"
            style={{ backgroundColor: RED }}
          >
            -{discount}%
          </span>
        )}
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-neutral-400 text-sm">Sem imagem</div>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm text-neutral-800 line-clamp-2 min-h-[2.5rem]">
          {product.node.title}
        </h3>
        <div className="mt-1">
          {onSale && (
            <p className="text-xs text-neutral-400 line-through font-display">
              {formatBRL(compareAt!.amount)}
            </p>
          )}
          <p
            className="font-display text-2xl lg:text-3xl leading-none"
            style={{ color: RED }}
          >
            {formatBRL(price.amount)}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            ou 10x de {formatBRL((parseFloat(price.amount) / 10).toFixed(2))} sem juros
          </p>
        </div>
        <button
          disabled={isLoading || !variant}
          onClick={() => {
            if (!variant) return;
            addItem({
              product,
              variantId: variant.id,
              variantTitle: variant.title,
              price: variant.price,
              quantity: 1,
              selectedOptions: variant.selectedOptions || [],
            });
          }}
          className="bg-conversion hover:bg-conversion-hover transition-colors mt-auto h-11 rounded-[20px] font-display uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Comprar agora
            </>
          )}
        </button>
      </div>
    </div>
  );
}


/* ============ SUBFOOTER ============ */
export function Subfooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "dup" | "err">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const res = await subscribeEmail(email, "subfooter");
    if (res === "ok") {
      setStatus("ok");
      setEmail("");
    } else if (res === "duplicate") {
      setStatus("dup");
    } else {
      setStatus("err");
    }
  }

  return (
    <section className="mt-20 bg-neutral-900 text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p
            className="font-display uppercase tracking-[0.25em] text-xs mb-3"
            style={{ color: GOLD }}
          >
            Newsletter Solze
          </p>
          <h3 className="font-display uppercase text-3xl lg:text-4xl leading-tight">
            ENTRE PRA FAMÍLIA SOLZE E GANHE<br />
            <span style={{ color: RED }}>10% OFF</span> NA PRIMEIRA COMPRA
          </h3>
          <p className="text-white/70 text-sm mt-3 max-w-md">
            Cadastre seu e-mail e receba ofertas exclusivas, lançamentos e drops antes de todo mundo.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              aria-label="Seu melhor e-mail"
              className="flex-1 h-12 rounded-[20px] bg-white text-neutral-900 px-5 text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-conversion hover:bg-conversion-hover transition-colors h-12 px-7 rounded-[20px] font-display uppercase tracking-wider text-sm disabled:opacity-60"
            >
              {status === "loading" ? "Enviando..." : "Quero receber"}
            </button>
          </form>
          {status === "ok" && (
            <p className="text-xs mt-3" style={{ color: GOLD }}>
              Pronto! Seu e-mail foi cadastrado — as ofertas chegam em breve.
            </p>
          )}
          {status === "dup" && (
            <p className="text-xs mt-3" style={{ color: GOLD }}>
              Esse e-mail já está na nossa lista. 😉
            </p>
          )}
          {status === "err" && (
            <p className="text-xs mt-3" style={{ color: RED }}>
              Não conseguimos cadastrar agora. Tente novamente.
            </p>
          )}
          <p className="text-[11px] text-white/50 mt-3">
            Ao se cadastrar, você concorda com nossa Política de Privacidade.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: Truck, t: "Entrega garantida", s: "Para todo o Brasil" },
            { icon: RefreshCcw, t: "Troca fácil", s: "Até 30 dias" },
            { icon: ShieldCheck, t: "Compra segura", s: "Ambiente protegido" },
            { icon: CreditCard, t: "Parcele em 10x", s: "Sem juros no cartão" },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-white/10 bg-white/5 p-4 sm:p-5 flex items-center gap-3"
            >
              <div
                className="h-11 w-11 rounded-[20px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: OLIVE }}
              >
                <b.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">

                <p className="font-display uppercase tracking-wider text-sm">{b.t}</p>
                <p className="text-xs text-white/60 mt-0.5">{b.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
export function Footer() {
  const cols = [
    {
      title: "Institucional",
      items: ["Sobre a Solze", "Nossa história", "Imprensa", "Trabalhe conosco", "Lojas físicas"],
    },
    {
      title: "Atendimento",
      items: ["Central de ajuda", "Trocas e devoluções", "Rastrear pedido", "Garantia de 3 meses", "FAQ"],
    },
    {
      title: "Categorias",
      items: ["Bolsas", "Mochilas", "Estojos", "Cintos", "Acessórios Multiuso", "Ofertas"],
      handles: ["bolsas", "mochilas", "estojos", "cintos", "acessorios", "outlet"],
    },
  ];

  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-700">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-14 grid gap-8 sm:gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <img src={logoAsset.url} alt="Solze" className="h-10 w-auto object-contain" />
          <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
            Acessórios para ferramentas feitos no Brasil para quem trabalha com as mãos: eletricistas, encanadores, técnicos e construção civil.
          </p>
          <div className="flex gap-2 mt-5">
            {[
              { I: Instagram, href: "https://www.instagram.com/solzeacessorios/" },
              { I: Facebook, href: "https://www.facebook.com/solzeacessorios" },
              { I: Youtube, href: "https://www.youtube.com/@solzeacessorios" },
            ].map(({ I, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-[20px] border border-neutral-200 flex items-center justify-center hover:text-white transition-colors"
                style={{ borderColor: "#e5e5e5" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = OLIVE)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-display uppercase tracking-wider text-sm text-neutral-900 mb-4">
              {c.title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {c.items.map((it, i) => {
                const handle = (c as { handles?: string[] }).handles?.[i];
                return (
                  <li key={it}>
                    {handle ? (
                      <Link
                        to="/collection/$handle"
                        params={{ handle }}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {it}
                      </Link>
                    ) : (
                      <Link to="/produtos" className="hover:text-neutral-900 transition-colors">
                        {it}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            {c.title === "Atendimento" && (
              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" style={{ color: OLIVE }} /> (21) 4137-5008
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" style={{ color: OLIVE }} /> sac@solze.com.br
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" style={{ color: OLIVE }} /> Av. Paulista, 1000 — São Paulo/SP
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment + CNPJ strip */}
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            {["VISA", "MASTER", "ELO", "AMEX", "PIX", "BOLETO"].map((p) => (
              <span
                key={p}
                className="h-8 px-3 rounded-[20px] bg-neutral-100 border border-neutral-200 text-[11px] font-display uppercase tracking-wider flex items-center"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <ShieldCheck className="h-4 w-4" style={{ color: OLIVE }} />
            Site protegido • SSL 256 bits
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 text-white/70 text-[12px]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p>© {new Date().getFullYear()} Solze Acessórios para Ferramentas. Todos os direitos reservados.</p>
          <p>SOLZE ACESSÓRIOS PARA FERRAMENTAS — CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
