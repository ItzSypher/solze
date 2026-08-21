import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2, Check, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const OLIVE = "#4A5A3B";
const GOLD = "#C6A87C";
const RED = "#E63946";

const MAX_REVIEWS = 30;

type Review = {
  id: string;
  user_id: string;
  author_name: string;
  author_role: string | null;
  rating: number;
  body: string;
  created_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "Hoje";
  if (d < 7) return `Há ${d} dia${d > 1 ? "s" : ""}`;
  if (d < 30) return `Há ${Math.floor(d / 7)} semana(s)`;
  if (d < 365) return `Há ${Math.floor(d / 30)} mês(es)`;
  return `Há ${Math.floor(d / 365)} ano(s)`;
}

export function ProductReviews({ handle }: { handle: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("id,user_id,author_name,author_role,rating,body,created_at")
        .eq("product_handle", handle)
        .order("created_at", { ascending: false })
        .limit(MAX_REVIEWS);
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((s) => ({
      s,
      p: total ? Math.round((reviews.filter((r) => r.rating === s).length / total) * 100) : 0,
    }));
    return { total, avg, dist };
  }, [reviews]);

  const alreadyReviewed = !!user && reviews.some((r) => r.user_id === user.id);

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Faça login para avaliar.");
      const { error } = await supabase.from("product_reviews").insert({
        user_id: user.id,
        product_handle: handle,
        author_name: name.trim().slice(0, 60),
        author_role: role.trim().slice(0, 60) || null,
        rating,
        body: body.trim().slice(0, 1000),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      setOpen(false);
      setError(null);
      qc.invalidateQueries({ queryKey: ["reviews", handle] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Erro ao enviar avaliação.";
      setError(
        msg.includes("duplicate") || msg.includes("unique")
          ? "Você já avaliou este produto."
          : msg,
      );
    },
  });

  const canSubmit = name.trim().length >= 2 && body.trim().length >= 10 && !submit.isPending;

  return (
    <div className="rounded-[20px] border border-neutral-200 p-6 sm:p-8 lg:p-12 grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
      {/* Score */}
      <div className="min-w-0 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-neutral-200 lg:pr-10 pb-8 lg:pb-0">
        <p className="font-display uppercase tracking-[0.25em] text-xs text-neutral-500">Avaliações</p>
        <p className="font-display text-6xl sm:text-7xl font-bold leading-none mt-2">
          {stats.total ? stats.avg.toFixed(1) : "—"}
        </p>
        <div className="flex items-center justify-center lg:justify-start gap-0.5 mt-3" style={{ color: GOLD }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`h-5 w-5 ${s <= Math.round(stats.avg) ? "fill-current" : ""}`} />
          ))}
        </div>
        <p className="text-sm text-neutral-500 mt-2">
          {stats.total
            ? `Baseado em ${stats.total} avaliaç${stats.total > 1 ? "ões" : "ão"}`
            : "Ainda não há avaliações"}
        </p>
        <div className="mt-6 space-y-2">
          {stats.dist.map(({ s, p }) => (
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

      {/* List + form */}
      <div className="min-w-0 space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando avaliações...
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Seja o primeiro a avaliar este produto depois de recebê-lo.
          </p>
        ) : (
          reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
              className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-white font-display font-bold"
                  style={{ backgroundColor: OLIVE }}
                >
                  {r.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-display uppercase tracking-wider text-sm font-bold truncate">
                    {r.author_name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {r.author_role ? `${r.author_role} · ` : ""}
                    {timeAgo(r.created_at)}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-0.5 shrink-0" style={{ color: GOLD }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mt-3 text-sm leading-relaxed break-words">"{r.body}"</p>
            </motion.div>
          ))
        )}

        {reviews.length >= MAX_REVIEWS && (
          <p className="text-xs text-neutral-500">Exibindo as {MAX_REVIEWS} avaliações mais recentes.</p>
        )}

        {/* Write review */}
        <div className="rounded-[20px] border-2 border-dashed border-neutral-200 p-5">
          {!user ? (
            <div className="text-center">
              <p className="font-display uppercase tracking-wider text-sm font-bold">
                Comprou e quer avaliar?
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Entre na sua conta de cliente para publicar sua avaliação.
              </p>
              <Link
                to="/auth"
                className="mt-4 inline-flex h-11 items-center rounded-[20px] px-6 font-display uppercase tracking-wider text-xs font-bold text-white"
                style={{ backgroundColor: OLIVE }}
              >
                Entrar para avaliar
              </Link>
            </div>
          ) : alreadyReviewed ? (
            <p className="text-sm text-neutral-600 inline-flex items-center gap-2">
              <Check className="h-4 w-4" style={{ color: OLIVE }} /> Você já avaliou este produto. Obrigado!
            </p>
          ) : !open ? (
            <button
              onClick={() => setOpen(true)}
              className="w-full h-12 rounded-[20px] border-2 border-neutral-900 font-display uppercase tracking-wider text-sm font-bold hover:bg-neutral-900 hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <PenLine className="h-4 w-4" /> Escrever avaliação
            </button>
          ) : (
            <div className="space-y-3">
              <p className="font-display uppercase tracking-wider text-sm font-bold">Sua avaliação</p>
              <div className="flex items-center gap-1" style={{ color: GOLD }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-label={`${s} estrela${s > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                  >
                    <Star className={`h-7 w-7 ${s <= (hover || rating) ? "fill-current" : "opacity-30"}`} />
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="h-11 rounded-[20px] border border-neutral-200 px-4 text-sm focus:outline-none focus:border-neutral-400"
                />
                <input
                  value={role}
                  maxLength={60}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Profissão (opcional)"
                  className="h-11 rounded-[20px] border border-neutral-200 px-4 text-sm focus:outline-none focus:border-neutral-400"
                />
              </div>
              <textarea
                value={body}
                maxLength={1000}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Conte como foi sua experiência com o produto (mínimo 10 caracteres)"
                className="w-full rounded-[20px] border border-neutral-200 p-4 text-sm focus:outline-none focus:border-neutral-400 resize-none"
              />
              {error && <p className="text-xs" style={{ color: RED }}>{error}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => submit.mutate()}
                  disabled={!canSubmit}
                  className="h-12 px-6 rounded-[20px] font-display uppercase tracking-wider text-sm font-bold text-white disabled:opacity-50 inline-flex items-center gap-2"
                  style={{ backgroundColor: RED }}
                >
                  {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publicar avaliação"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="h-12 px-5 rounded-[20px] border border-neutral-200 font-display uppercase tracking-wider text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
