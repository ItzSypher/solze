import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — Solze" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/conta" });
    });
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/conta" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/conta`,
        data: { display_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Você já está conectado.");
    navigate({ to: "/conta" });
  };

  const google = async () => {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/conta" });
    if (res.error) {
      setLoading(false);
      toast.error("Falha ao entrar com Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-12 font-body">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-[20px] shadow-2xl p-8"
      >
        <Link to="/" className="block text-center mb-6">
          <span className="font-display text-3xl font-bold tracking-wider" style={{ color: "#4A5A3B" }}>
            SOLZE
          </span>
        </Link>

        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login" className="font-display uppercase tracking-wider">Entrar</TabsTrigger>
            <TabsTrigger value="signup" className="font-display uppercase tracking-wider">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={signIn} className="space-y-4">
              <div>
                <Label htmlFor="li-email">Email</Label>
                <Input id="li-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="li-pwd">Senha</Label>
                <Input id="li-pwd" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 font-display uppercase tracking-wider" style={{ backgroundColor: "#E63946" }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4">
              <div>
                <Label htmlFor="su-name">Nome</Label>
                <Input id="su-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="su-pwd">Senha</Label>
                <Input id="su-pwd" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 font-display uppercase tracking-wider" style={{ backgroundColor: "#E63946" }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <span className="relative bg-white px-2 text-xs uppercase tracking-wider text-muted-foreground mx-auto block w-fit">ou</span>
        </div>

        <Button onClick={google} disabled={loading} variant="outline" className="w-full h-11 font-display uppercase tracking-wider">
          Continuar com Google
        </Button>
      </motion.div>
    </div>
  );
}
