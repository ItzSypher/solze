import { ArrowRight, Shield, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";

const OLIVE = "#4A5A3B";
const GOLD = "#C6A87C";
const RED = "#E63946";

type Variant = "operator" | "edc" | "outlet";

const VARIANTS: Record<
  Variant,
  {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    href: string;
    handle?: string;
    bg: string;
    accent: string;
    icon: typeof Shield;
  }
> = {
  operator: {
    eyebrow: "Testado no trabalho",
    title: "FEITO PRA QUEM\nNÃO PODE PARAR",
    sub: "Equipamento resistente, pensado pra aguentar o ritmo de quem trabalha com ferramentas todos os dias.",
    cta: "Ver linha profissional",
    href: "/collection/$handle",
    handle: "bolsas",
    bg: `linear-gradient(115deg, #0f150a 0%, ${OLIVE} 55%, #6b7a55 100%)`,
    accent: GOLD,
    icon: Shield,
  },
  edc: {
    eyebrow: "Acessórios multiuso",
    title: "O ESSENCIAL\nSEMPRE À MÃO",
    sub: "Estojos e acessórios compactos pra organizar o que você mais usa durante o trabalho.",
    cta: "Ver acessórios",
    href: "/collection/$handle",
    handle: "acessorios",
    bg: `linear-gradient(115deg, #1a1a1a 0%, #2a2a2a 60%, ${GOLD} 130%)`,
    accent: GOLD,
    icon: Truck,
  },
  outlet: {
    eyebrow: "Ofertas Solze",
    title: "ATÉ 50% OFF\nEM SELECIONADOS",
    sub: "Peças com desconto e a mesma resistência de sempre. Estoque limitado.",
    cta: "Aproveitar ofertas",
    href: "/ofertas",
    bg: `linear-gradient(115deg, #2a0e0e 0%, #5a1f1f 55%, ${RED} 120%)`,
    accent: "#fff",
    icon: Shield,
  },

};

export function LifestyleBanner({ variant }: { variant: Variant }) {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  const ctaProps = v.handle
    ? { to: v.href, params: { handle: v.handle } }
    : ({ to: v.href } as const);

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-14">
      <div
        className="relative overflow-hidden rounded-[20px] text-white"
        style={{ background: v.bg }}
      >
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 14px)",
          }}
        />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-10 items-center p-7 sm:p-10 lg:p-14 min-h-[260px] lg:min-h-[320px]">
          <div>
            <p
              className="inline-flex items-center gap-2 font-display uppercase tracking-[0.25em] text-[10px] sm:text-xs"
              style={{ color: v.accent }}
            >
              <Icon className="h-3.5 w-3.5" /> {v.eyebrow}
            </p>
            <h3 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.95] whitespace-pre-line mt-3">
              {v.title}
            </h3>
            <p className="text-white/80 text-sm sm:text-base mt-4 max-w-md">
              {v.sub}
            </p>
            <Link
              {...(ctaProps as any)}
              className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-[20px] bg-white text-neutral-900 font-display uppercase tracking-wider text-xs sm:text-sm hover:bg-neutral-100 transition-colors"
            >
              {v.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="hidden lg:flex justify-end">
            <div
              className="h-44 w-44 xl:h-56 xl:w-56 rounded-[24px] backdrop-blur-md flex items-center justify-center text-7xl"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              {variant === "operator" ? "🎒" : variant === "edc" ? "🔦" : "🏷️"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
