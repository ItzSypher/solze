import { useEffect, useState } from "react";
import { X, Mail, Tag } from "lucide-react";
import logoAsset from "@/assets/solze-logo.png.asset.json";
import { subscribeEmail } from "@/lib/newsletter";

const STORAGE_KEY = "solze:welcome-popup-dismissed";
const OLIVE = "#4A5A3B";
const RED = "#E63946";
const GOLD = "#C6A87C";

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    const res = await subscribeEmail(email, "welcome-popup");
    setLoading(false);
    if (res === "invalid") {
      setError("Digite um e-mail válido.");
      return;
    }
    if (res === "error") {
      setError("Não conseguimos cadastrar agora. Tente de novo.");
      return;
    }
    setSubmitted(true);
    setTimeout(close, 2400);
  }


  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Oferta de boas-vindas"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md sm:max-w-lg rounded-[20px] overflow-hidden bg-white shadow-2xl animate-in zoom-in-95"
      >
        <button
          onClick={close}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="p-7 sm:p-9 text-white"
          style={{ background: `linear-gradient(135deg, ${OLIVE} 0%, #1a1f12 100%)` }}
        >
          <img
            src={logoAsset.url}
            alt="Solze"
            className="h-10 w-auto object-contain mb-5 brightness-0 invert"
          />
          <span
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${GOLD}30`, color: GOLD, fontFamily: "var(--font-sora)" }}
          >
            <Tag className="h-3 w-3" /> Oferta de boas-vindas
          </span>
          <h2 className="font-display uppercase text-3xl sm:text-4xl leading-[0.95] mt-3">
            GANHE <span style={{ color: GOLD }}>10% OFF</span>
            <br />
            NA PRIMEIRA COMPRA
          </h2>
          <p className="text-white/80 text-sm mt-3" style={{ fontFamily: "var(--font-sora)" }}>
            Entre no pelotão Solze e receba o cupom direto no seu e-mail. Drops, lançamentos e ofertas exclusivas.
          </p>
        </div>

        <div className="p-6 sm:p-7">
          {submitted ? (
            <div className="py-6 text-center">
              <div
                className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: `${OLIVE}15`, color: OLIVE }}
              >
                <Mail className="h-5 w-5" />
              </div>
              <p className="font-display uppercase text-sm tracking-wider">
                Cupom enviado!
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Confira sua caixa de entrada em instantes.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <label className="block text-xs font-display uppercase tracking-wider text-neutral-600">
                Seu melhor e-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full h-12 rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 text-sm focus:outline-none focus:border-neutral-400"
              />
              {error && (
                <p className="text-xs" style={{ color: RED }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-[20px] text-white font-display uppercase tracking-wider text-sm hover:opacity-95 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: RED }}
              >
                {loading ? "Enviando..." : "Quero meu cupom de 10%"}
              </button>
              <button
                type="button"
                onClick={close}
                className="w-full text-[11px] text-neutral-500 hover:text-neutral-700 mt-1"
              >
                Não, obrigado
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
