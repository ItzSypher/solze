import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, CreditCard, QrCode, ShieldCheck, Check } from "lucide-react";
import logoAsset from "@/assets/solze-logo.png.asset.json";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout Seguro — Solze" }],
  }),
  component: CheckoutPage,
});

const RED = "#E63946";
const WHATS = "#25D366";

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CheckoutPage() {
  const [payment, setPayment] = useState<"card" | "pix">("card");
  const [bump, setBump] = useState(true);

  const product = { title: "Mochila Operator 45L", price: 899, emoji: "🎒" };
  const bumpItem = { title: "Cinto Tático Reforçado", price: 19.9, emoji: "🪖" };
  const subtotal = product.price + (bump ? bumpItem.price : 0);

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Minimal header */}
      <header className="bg-white border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-emerald-600" /> Ambiente seguro
          </div>
          <Link to="/" className="md:absolute md:left-1/2 md:-translate-x-1/2">
            <img src={logoAsset.url} alt="Solze" className="h-10 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> SSL 256-bit
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display uppercase text-3xl md:text-4xl font-bold mb-8">
          Finalize seu pedido
        </motion.h1>

        <div className="grid lg:grid-cols-[1fr_440px] gap-8">
          {/* LEFT: Forms */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Email */}
            <section className="bg-white rounded-[20px] p-6 border border-border">
              <h2 className="font-display uppercase text-lg font-bold mb-4">1. Identificação</h2>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">E-mail</label>
              <input type="email" placeholder="seu@email.com" className="w-full h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground transition" />
            </section>

            {/* Address */}
            <section className="bg-white rounded-[20px] p-6 border border-border">
              <h2 className="font-display uppercase text-lg font-bold mb-4">2. Endereço de entrega</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="Nome completo" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground sm:col-span-2" />
                <input placeholder="CEP" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground" />
                <input placeholder="Cidade / UF" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground" />
                <input placeholder="Rua, número e complemento" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground sm:col-span-2" />
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-[20px] p-6 border border-border">
              <h2 className="font-display uppercase text-lg font-bold mb-4">3. Pagamento</h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button onClick={() => setPayment("card")}
                  className={`h-20 rounded-[20px] border-2 flex flex-col items-center justify-center gap-1 transition ${payment === "card" ? "border-foreground bg-secondary/60" : "border-border bg-secondary/20"}`}>
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm font-medium">Cartão de Crédito</span>
                </button>
                <button onClick={() => setPayment("pix")}
                  className={`h-20 rounded-[20px] border-2 flex flex-col items-center justify-center gap-1 transition ${payment === "pix" ? "border-foreground bg-secondary/60" : "border-border bg-secondary/20"}`}>
                  <QrCode className="h-5 w-5" />
                  <span className="text-sm font-medium">PIX <span className="text-emerald-600 text-xs">-5%</span></span>
                </button>
              </div>
              {payment === "card" ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder="Número do cartão" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground sm:col-span-2" />
                  <input placeholder="Validade (MM/AA)" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground" />
                  <input placeholder="CVV" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground" />
                  <input placeholder="Nome impresso no cartão" className="h-12 rounded-[20px] border border-border bg-secondary/40 px-4 focus:outline-none focus:border-foreground sm:col-span-2" />
                </div>
              ) : (
                <div className="rounded-[20px] bg-emerald-50 border border-emerald-200 p-5 text-sm text-emerald-900">
                  <p className="font-medium mb-1">Pague com PIX e ganhe 5% de desconto.</p>
                  <p className="text-emerald-800/80">Você receberá o QR Code após confirmar o pedido.</p>
                </div>
              )}
            </section>
          </motion.div>

          {/* RIGHT: Summary */}
          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-6 self-start space-y-5">
            <div className="bg-white rounded-[20px] p-6 border border-border">
              <h2 className="font-display uppercase text-lg font-bold mb-5">Resumo do pedido</h2>

              <div className="flex gap-4 pb-5 border-b border-border">
                <div className="w-20 h-20 rounded-[16px] bg-secondary flex items-center justify-center text-4xl shrink-0">{product.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{product.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Qtd: 1</p>
                  <p className="font-display font-bold mt-1">{brl(product.price)}</p>
                </div>
              </div>

              {bump && (
                <div className="flex gap-4 py-4 border-b border-border">
                  <div className="w-16 h-16 rounded-[16px] bg-secondary flex items-center justify-center text-3xl shrink-0">{bumpItem.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{bumpItem.title}</h3>
                    <p className="font-display font-bold text-sm mt-1" style={{ color: RED }}>+ {brl(bumpItem.price)}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm pt-4">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Frete</span><span className="text-emerald-600 font-medium">GRÁTIS</span></div>
                <div className="flex justify-between items-baseline pt-3 border-t border-border mt-3">
                  <span className="font-display uppercase font-bold">Total</span>
                  <span className="font-display font-bold text-3xl" style={{ color: RED }}>{brl(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">ou 10x de {brl(subtotal / 10)} sem juros</p>
              </div>
            </div>

            {/* ORDER BUMP */}
            <motion.div animate={{ scale: [1, 1.01, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="rounded-[20px] p-5 border-2 border-dashed border-yellow-500 bg-yellow-50">
              <h3 className="font-display uppercase font-bold text-base text-yellow-900">
                ★ Oferta Exclusiva: Leve também o Cinto Tático por apenas <span style={{ color: RED }}>R$ 19,90</span>
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-[14px] bg-white border border-yellow-300 flex items-center justify-center text-3xl shrink-0">🪖</div>
                <div className="flex-1 text-xs text-yellow-900/80">
                  Cinto reforçado nylon 1000D — fivela em aço. <span className="line-through">R$ 149,00</span>{" "}
                  <span className="font-bold">por R$ 19,90</span>
                </div>
                <button
                  onClick={() => setBump(!bump)}
                  className={`relative w-12 h-7 rounded-full transition shrink-0 ${bump ? "bg-emerald-500" : "bg-gray-300"}`}
                  aria-label="Adicionar oferta"
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform flex items-center justify-center ${bump ? "translate-x-5" : ""}`}>
                    {bump && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                  </span>
                </button>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full h-16 rounded-[20px] text-white font-display uppercase text-lg tracking-wider shadow-2xl hover:opacity-95 transition flex items-center justify-center gap-2"
              style={{ background: WHATS, boxShadow: `0 10px 40px -10px ${WHATS}` }}
            >
              <Lock className="h-5 w-5" /> Finalizar Compra Segura
            </motion.button>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Compra protegida</span>
              <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-emerald-600" /> SSL 256-bit</span>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
