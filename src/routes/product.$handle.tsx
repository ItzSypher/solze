import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Check,
  X,
  Plus,
  Star,
  Play,
  Minus,
  Package,
  Award,
  Heart,
} from "lucide-react";
import { Header, Subfooter, Footer } from "@/routes/index";
import { CartDrawer } from "@/components/CartDrawer";
import { fetchProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { useTabTitle } from "@/hooks/useTabTitle";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const name = params.handle
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const title = `${name} — Solze`;
    const description = `${name}: acessório Solze para ferramentas, resistente e com reforço nas costuras, garantia de 3 meses. Compre com frete rápido e parcelamento em 10x.`;
    const url = `https://shop-love-joy.lovable.app/product/${params.handle}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProductPage,
});

const OLIVE = "#4A5A3B";
const RED = "#E63946";
const GOLD = "#C6A87C";

function formatBRL(amount: string) {
  const n = parseFloat(amount);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function ProductPage() {
  const { handle } = Route.useParams();
  useCartSync();
  useTabTitle(`${handle} — Solze`);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProduct(handle),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", { query: undefined, limit: 12 }],
    queryFn: () => fetchProducts(12),
    staleTime: 5 * 60 * 1000,
  });

  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  const [imgIdx, setImgIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingShown, setShippingShown] = useState(false);


  const variant = useMemo(() => {
    if (!product) return null;
    const variants = product.node.variants.edges;
    const match = variants.find((v) =>
      v.node.selectedOptions.every((o) => selected[o.name] === o.value),
    );
    return (match ?? variants[0])?.node ?? null;
  }, [product, selected]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

  if (!product) throw notFound();

  const images = product.node.images.edges;
  const price = variant?.price ?? product.node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const discountPct = onSale
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAt!.amount)) * 100)
    : 0;

  const installment = (parseFloat(price.amount) / 10).toFixed(2);

  const handleAdd = async () => {
    if (!variant) return;
    for (let i = 0; i < qty; i++) {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
    }
  };

  const firstImage = images[0]?.node;
  const heroImg = images[imgIdx]?.node ?? firstImage;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pb-24">
      <Header />

      {/* Breadcrumb */}
      <motion.div {...fadeIn(0)} className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 uppercase tracking-wider font-display">
          <ChevronLeft className="h-3.5 w-3.5" /> Voltar para a loja
        </Link>
      </motion.div>

      {/* ============ SECTION 1: BUY BOX ============ */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <motion.div {...fadeIn(0.05)}>
          <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-[20px] bg-neutral-50 border border-neutral-200">
            {heroImg ? (
              <motion.img
                key={imgIdx}
                src={heroImg.url}
                alt={heroImg.altText ?? product.node.title}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full object-contain p-2 sm:p-3"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400 text-sm">
                Sem imagem
              </div>
            )}
            {onSale && (
              <span
                className="absolute left-4 top-4 rounded-[20px] px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: RED }}
              >
                -{discountPct}% OFF
              </span>
            )}
            <button aria-label="Adicionar aos favoritos" className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 flex items-center justify-center transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square overflow-hidden rounded-[20px] bg-neutral-50 border-2 transition ${
                    i === imgIdx ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <img src={img.node.url} alt="" className="h-full w-full object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div {...fadeIn(0.15)}>
          <p className="text-[11px] font-display uppercase tracking-[0.25em]" style={{ color: OLIVE }}>
            / SOLZE TACTICAL
          </p>
          <h1 className="font-display uppercase mt-3 text-4xl sm:text-5xl font-bold leading-[1.05] text-balance">
            {product.node.title}
          </h1>

          {/* rating row */}
          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-0.5" style={{ color: GOLD }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="font-display font-bold">4.9</span>
            <span className="text-neutral-500">(287 avaliações)</span>
            <span className="text-neutral-300">|</span>
            <span className="inline-flex items-center gap-1 text-neutral-500">
              <Package className="h-3.5 w-3.5" /> Em estoque
            </span>
          </div>

          {/* Price block */}
          <div className="mt-6 rounded-[20px] border border-neutral-200 bg-neutral-50 p-6">
            {onSale && (
              <p className="text-sm text-neutral-500 line-through">
                De {formatBRL(compareAt!.amount)}
              </p>
            )}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold" style={{ color: RED }}>
                {formatBRL(price.amount)}
              </span>
              {onSale && (
                <span
                  className="font-display text-sm font-bold rounded-[20px] px-2 py-1 text-white"
                  style={{ backgroundColor: RED }}
                >
                  -{discountPct}%
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              ou <strong className="font-display">10x de R$ {installment}</strong> sem juros
            </p>
            <p className="text-xs mt-1" style={{ color: OLIVE }}>
              <strong>5% OFF</strong> no PIX — {formatBRL((parseFloat(price.amount) * 0.95).toString())}
            </p>
          </div>

          {/* Variant selectors */}
          {product.node.options.map((opt) => {
            if (opt.values.length <= 1) return null;
            const current =
              selected[opt.name] ??
              variant?.selectedOptions.find((o) => o.name === opt.name)?.value;
            return (
              <div key={opt.name} className="mt-6">
                <p className="font-display uppercase tracking-wider text-xs font-bold mb-2">
                  {opt.name}: <span className="text-neutral-500">{current}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelected((p) => ({ ...p, [opt.name]: val }))}
                      className={`min-w-12 rounded-[20px] border-2 px-4 py-2 text-sm font-display uppercase tracking-wider transition ${
                        current === val
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white hover:border-neutral-400"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Quantity */}
          <div className="mt-6">
            <p className="font-display uppercase tracking-wider text-xs font-bold mb-2">Quantidade</p>
            <div className="inline-flex items-center rounded-[20px] border-2 border-neutral-200">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="h-12 w-12 flex items-center justify-center hover:bg-neutral-50 rounded-l-[18px]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-display text-lg font-bold w-12 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Aumentar quantidade"
                className="h-12 w-12 flex items-center justify-center hover:bg-neutral-50 rounded-r-[18px]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            className="mt-6 w-full h-16 rounded-[20px] font-display uppercase tracking-wider text-lg font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ backgroundColor: RED }}
          >
            {isAdding ? <Loader2 className="h-5 w-5 animate-spin" /> : <>🛒 COMPRAR AGORA</>}
          </button>
          <button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            className="mt-3 w-full h-12 rounded-[20px] border-2 border-neutral-900 bg-white text-neutral-900 font-display uppercase tracking-wider text-sm font-bold hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Adicionar ao carrinho
          </button>

          {/* Shipping calculator */}
          <div className="mt-6 rounded-[20px] border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4" style={{ color: OLIVE }} />
              <p className="font-display uppercase tracking-wider text-sm font-bold">
                Calcular frete e prazo
              </p>
            </div>
            <div className="flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP"
                className="flex-1 h-11 rounded-[20px] border border-neutral-200 px-4 text-sm focus:outline-none focus:border-neutral-400"
              />
              <button
                onClick={() => setShippingShown(cep.trim().length > 0)}
                className="h-11 px-5 rounded-[20px] font-display uppercase tracking-wider text-xs text-white"
                style={{ backgroundColor: OLIVE }}
              >
                Calcular
              </button>
            </div>
            {shippingShown && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-2 text-sm"
              >
                <div className="flex justify-between rounded-[20px] bg-neutral-50 px-4 py-3 border border-neutral-200">
                  <span><strong className="font-display">SEDEX</strong> · 1 dia útil</span>
                  <span className="font-display font-bold">R$ 24,90</span>
                </div>
                <div className="flex justify-between rounded-[20px] px-4 py-3 border" style={{ backgroundColor: `${OLIVE}10`, borderColor: `${OLIVE}40` }}>
                  <span><strong className="font-display">PAC</strong> · 7 dias úteis</span>
                  <span className="font-display font-bold" style={{ color: OLIVE }}>GRÁTIS</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* trust row */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { i: ShieldCheck, t: "Garantia\n3 meses" },
              { i: RefreshCcw, t: "30 dias\npara troca" },
              { i: Truck, t: "Frete grátis\nacima R$399" },
            ].map((b, i) => (
              <div key={i} className="rounded-[20px] border border-neutral-200 p-3">
                <b.i className="h-5 w-5 mx-auto" style={{ color: OLIVE }} />
                <p className="text-[11px] font-display uppercase tracking-wider mt-2 whitespace-pre-line">
                  {b.t}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 2: IDEAL PARA + COMPARATIVO ============ */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-24">
        <motion.div {...fade()} className="grid lg:grid-cols-2 gap-6">
          {/* Ideal Para */}
          <div className="rounded-[20px] p-8 text-white" style={{ background: `linear-gradient(135deg, ${OLIVE} 0%, #2a3520 100%)` }}>
            <p className="font-display uppercase tracking-[0.25em] text-xs mb-2" style={{ color: GOLD }}>
              Feita para você
            </p>
            <h2 className="font-display uppercase text-3xl lg:text-4xl font-bold">IDEAL PARA</h2>
            <p className="text-white/80 text-sm mt-3 mb-6 max-w-md">
              Projetada para profissionais e entusiastas que exigem resistência, organização e estilo no dia a dia.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Eletricistas",
                "Obra Pesada",
                "Bombeiros",
                "Forças Especiais",
                "Tiro Esportivo",
                "Aventureiros",
                "Mecânicos",
                "Field Tech",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-[20px] border border-white/20 bg-white/10 backdrop-blur px-4 py-2 text-sm font-display uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Comparativo */}
          <div className="rounded-[20px] border-2 border-neutral-200 p-8">
            <p className="font-display uppercase tracking-[0.25em] text-xs mb-2 text-neutral-500">
              Por que escolher Solze
            </p>
            <h2 className="font-display uppercase text-3xl lg:text-4xl font-bold">COMPARATIVO</h2>
            <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-y-3 gap-x-4 text-sm">
              <div></div>
              <div className="text-center font-display uppercase tracking-wider text-xs font-bold" style={{ color: OLIVE }}>
                Solze
              </div>
              <div className="text-center font-display uppercase tracking-wider text-xs text-neutral-400">
                Concorrência
              </div>
              {[
                ["Fundo Rígido reforçado", true, false],
                ["Tecido Lona Premium 1000D", true, false],
                ["Costura dupla militar", true, false],
                ["Garantia Vitalícia", true, false],
                ["Reforço duplo nas costuras", true, false],
                ["Zíperes YKK®", true, false],
                ["Fundo de Tecido fino", false, true],
                ["Nylon comum 600D", false, true],
              ].map(([label, s, c], i) => (
                <div key={i} className="contents">
                  <div className="border-t border-neutral-100 pt-3 text-neutral-700">{label}</div>
                  <div className="border-t border-neutral-100 pt-3 flex justify-center">
                    {s ? <Check className="h-5 w-5" style={{ color: OLIVE }} /> : <X className="h-5 w-5 text-neutral-300" />}
                  </div>
                  <div className="border-t border-neutral-100 pt-3 flex justify-center">
                    {c ? <Check className="h-5 w-5 text-neutral-400" /> : <X className="h-5 w-5" style={{ color: RED }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 3: COMPRE JUNTO ============ */}
      {bundleExtras.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-24">
          <motion.div {...fade()}>
            <p className="font-display uppercase tracking-[0.25em] text-xs mb-2" style={{ color: RED }}>
              Economize comprando o kit
            </p>
            <h2 className="font-display uppercase text-3xl lg:text-4xl font-bold">COMPRE JUNTO</h2>

            <div className="mt-8 rounded-[20px] border-2 border-neutral-200 p-4 sm:p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:items-center lg:gap-6 lg:flex-1">
                  <BundleItem
                    img={firstImage?.url}
                    title={product.node.title}
                    price={formatBRL(price.amount)}
                    main
                  />
                  {bundleExtras.map((p) => (
                    <BundleItem
                      key={p.node.id}
                      img={p.node.images.edges[0]?.node?.url}
                      title={p.node.title}
                      price={formatBRL(
                        (p.node.variants.edges[0]?.node?.price ?? p.node.priceRange.minVariantPrice).amount,
                      )}
                    />
                  ))}
                </div>
                <div className="h-px w-full lg:h-24 lg:w-px bg-neutral-200 shrink-0" />
                <div className="text-center lg:text-left shrink-0">
                  <p className="text-xs font-display uppercase tracking-wider text-neutral-500">Total do kit</p>
                  <p className="text-sm line-through text-neutral-400">{formatBRL(bundleTotal.toString())}</p>
                  <p className="font-display text-3xl font-bold" style={{ color: RED }}>
                    {formatBRL((bundleTotal - bundleDiscount).toString())}
                  </p>
                  <p className="text-[11px] font-display uppercase tracking-wider mt-1" style={{ color: OLIVE }}>
                    Economize {formatBRL(bundleDiscount.toString())}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddBundle}
                disabled={isAdding}
                className="mt-8 w-full h-14 rounded-[20px] font-display uppercase tracking-wider text-base sm:text-lg font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                style={{ backgroundColor: RED }}
              >
                ADICIONAR KIT AO CARRINHO
              </button>
            </div>
          </motion.div>
        </section>
      )}


      {/* ============ SECTION 4: DESCRIPTION ============ */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-24">
        <motion.div {...fade()} className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-display uppercase tracking-[0.25em] text-xs mb-2" style={{ color: OLIVE }}>
              Engenharia Solze
            </p>
            <h2 className="font-display uppercase text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05]">
              CONSTRUÍDA<br />PARA NÃO FALHAR<br /><span style={{ color: RED }}>QUANDO IMPORTA.</span>
            </h2>
            <p className="text-neutral-600 leading-relaxed mt-6">
              Cada costura, cada zíper, cada milímetro de tecido foi pensado para suportar a rotina pesada de quem
              trabalha com as mãos. A {product.node.title} é feita para aguentar o dia a dia na obra, na oficina e na rua.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Lona resistente impermeabilizada",
                "Fundo rígido reforçado",
                "Alças ergonômicas com reforço",
                "Compartimentos organizadores para ferramentas",
                "Zíperes reforçados",
              ].map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  <span className="text-neutral-700">{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 inline-flex items-center gap-3 rounded-[20px] border border-neutral-200 px-5 py-3">
              <Award className="h-5 w-5" style={{ color: GOLD }} />
              <span className="text-sm">
                <strong className="font-display uppercase tracking-wider">Testado no trabalho</strong>
                <span className="text-neutral-500"> por profissionais todos os dias</span>
              </span>
            </div>
          </div>

          {firstImage && (
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-neutral-50 border border-neutral-200">
              <img
                src={firstImage.url}
                alt={product.node.title}
                loading="lazy"
                className="h-full w-full object-contain p-6"
              />
            </div>
          )}
        </motion.div>
      </section>


      {/* ============ SECTION 5: REVIEWS + INSTAGRAM ============ */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-24">
        <motion.div {...fade()} className="rounded-[20px] border border-neutral-200 p-8 lg:p-12 grid lg:grid-cols-[280px_1fr] gap-10">
          {/* Score */}
          <div className="text-center lg:text-left border-b lg:border-b-0 lg:border-r border-neutral-200 lg:pr-10 pb-8 lg:pb-0">
            <p className="font-display uppercase tracking-[0.25em] text-xs text-neutral-500">Avaliações</p>
            <p className="font-display text-7xl font-bold leading-none mt-2">4.9</p>
            <div className="flex items-center justify-center lg:justify-start gap-0.5 mt-3" style={{ color: GOLD }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-sm text-neutral-500 mt-2">Baseado em 287 avaliações</p>
            <div className="mt-6 space-y-2">
              {[
                [5, 92],
                [4, 6],
                [3, 1],
                [2, 0],
                [1, 1],
              ].map(([s, p]) => (
                <div key={s} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-display font-bold">{s}</span>
                  <Star className="h-3 w-3" style={{ color: GOLD }} fill={GOLD} />
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: OLIVE }} />
                  </div>
                  <span className="w-8 text-right text-neutral-500">{p}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-6">
            {[
              {
                name: "Rafael M.",
                role: "Eletricista Industrial",
                t: "Uso essa bolsa todo dia há 8 meses. Carrega alicate, multímetro, ferramentas pesadas — nem um arranhão. Vale cada centavo.",
                d: "Há 2 semanas",
              },
              {
                name: "Cap. Eduardo S.",
                role: "Forças Especiais",
                t: "Equipamento sério. Peguei chuva na obra e o fundo rígido salvou minhas ferramentas. Resistência de verdade.",
                d: "Há 1 mês",
              },
              {
                name: "Bruno K.",
                role: "Bombeiro Civil",
                t: "Comparei com outras 3 marcas. A diferença na qualidade do tecido e do fundo é absurda. Recomendo de olhos fechados.",
                d: "Há 1 mês",
              },
            ].map((r, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.1)}
                className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center text-white font-display font-bold"
                    style={{ backgroundColor: OLIVE }}
                  >
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-display uppercase tracking-wider text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-neutral-500">{r.role} · {r.d}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5" style={{ color: GOLD }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-700 mt-3 text-sm leading-relaxed">"{r.t}"</p>
              </motion.div>
            ))}
            <button className="w-full h-12 rounded-[20px] border-2 border-neutral-900 font-display uppercase tracking-wider text-sm font-bold hover:bg-neutral-900 hover:text-white transition-colors">
              Ver todas as 287 avaliações
            </button>
          </div>
        </motion.div>

        {/* Instagram UGC */}
        <motion.div {...fade()} className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="font-display uppercase tracking-[0.25em] text-xs" style={{ color: RED }}>
                Comunidade Solze
              </p>
              <h2 className="font-display uppercase text-3xl lg:text-4xl font-bold mt-1">
                #SOUFORTECOMOSOLZE
              </h2>
            </div>
            <a href="https://www.instagram.com/solzeacessorios/" target="_blank" rel="noopener noreferrer" className="font-display uppercase tracking-wider text-xs hover:underline" style={{ color: OLIVE }}>
              Ver no Instagram →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.05)}
                className="aspect-square rounded-[20px] overflow-hidden relative group cursor-pointer"
                style={{
                  background: `linear-gradient(${135 + i * 20}deg, ${i % 2 ? OLIVE : "#1f2a18"} 0%, ${i % 2 ? "#6b7a55" : OLIVE} 100%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">
                  {["🎒", "🪖", "🔧", "🥾", "⚙️", "🧰"][i]}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SUBFOOTER + FOOTER (reused) ============ */}
      <Subfooter />
      <Footer />

      {/* ============ STICKY BUY BAR ============ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-20 flex items-center gap-4">
          {firstImage && (
            <div className="h-14 w-14 rounded-[20px] bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0 hidden sm:block">
              <img src={firstImage.url} alt="" className="h-full w-full object-contain p-1" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display uppercase text-sm font-bold truncate">{product.node.title}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold" style={{ color: RED }}>
                {formatBRL(price.amount)}
              </span>
              <span className="text-xs text-neutral-500 hidden sm:inline">
                ou 10x R$ {installment}
              </span>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            className="h-12 px-6 sm:px-10 rounded-[20px] font-display uppercase tracking-wider text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 inline-flex items-center gap-2"
            style={{ backgroundColor: RED }}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "COMPRAR AGORA"}
          </button>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}

/* ============ Bundle helper ============ */
function BundleItem({
  img,
  title,
  price,
  emoji,
  main,
}: {
  img?: string;
  title: string;
  price: string;
  emoji?: string;
  main?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`relative aspect-square rounded-[20px] mb-3 flex items-center justify-center overflow-hidden ${
          main ? "border-2" : "border border-neutral-200 bg-neutral-50"
        }`}
        style={main ? { borderColor: RED } : undefined}
      >
        {img ? (
          <img src={img} alt={title} className="h-full w-full object-contain p-3" />
        ) : (
          <span className="text-6xl">{emoji}</span>
        )}
        {main && (
          <span
            className="absolute top-2 left-2 rounded-[20px] px-2 py-0.5 text-[10px] font-display uppercase tracking-wider text-white"
            style={{ backgroundColor: RED }}
          >
            Este
          </span>
        )}
      </div>
      <p className="font-display uppercase tracking-wider text-xs font-bold line-clamp-2 min-h-8">
        {title}
      </p>
      <p className="font-display text-lg font-bold mt-1">{price}</p>
    </div>
  );
}
