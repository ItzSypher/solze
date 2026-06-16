import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({ meta: [{ title: "Minha conta — Solze" }] }),
  component: ContaPage,
});

function ContaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setName(data?.display_name ?? user.email?.split("@")[0] ?? "");
    });
  }, [user]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-body">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold tracking-wider" style={{ color: "#4A5A3B" }}>SOLZE</Link>
          <Button onClick={signOut} variant="ghost" size="sm" className="font-display uppercase tracking-wider">
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-[20px] p-8 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full flex items-center justify-center text-white font-display text-xl" style={{ backgroundColor: "#4A5A3B" }}>
              {name?.[0]?.toUpperCase() ?? "S"}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Bem-vindo</p>
              <h1 className="font-display text-2xl font-bold tracking-wider uppercase">{name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Link to="/favoritos" className="bg-white rounded-[20px] p-6 border hover:shadow-md transition-shadow">
            <Heart className="h-6 w-6 mb-3" style={{ color: "#E63946" }} />
            <h3 className="font-display uppercase tracking-wider font-bold">Favoritos</h3>
            <p className="text-sm text-muted-foreground mt-1">Seus produtos salvos</p>
          </Link>
          <div className="bg-white rounded-[20px] p-6 border opacity-60">
            <Package className="h-6 w-6 mb-3" />
            <h3 className="font-display uppercase tracking-wider font-bold">Pedidos</h3>
            <p className="text-sm text-muted-foreground mt-1">Em breve</p>
          </div>
          <Link to="/" className="bg-white rounded-[20px] p-6 border hover:shadow-md transition-shadow">
            <ShoppingBag className="h-6 w-6 mb-3" />
            <h3 className="font-display uppercase tracking-wider font-bold">Continuar comprando</h3>
            <p className="text-sm text-muted-foreground mt-1">Voltar para a loja</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
