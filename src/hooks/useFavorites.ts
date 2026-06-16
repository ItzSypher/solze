import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Favorite {
  product_handle: string;
  product_title: string | null;
  product_image: string | null;
  product_price: string | null;
}

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_handle, product_title, product_image, product_price")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Favorite[];
    },
  });

  const handles = new Set(favorites.map((f) => f.product_handle));

  const toggle = useMutation({
    mutationFn: async (fav: Favorite) => {
      if (!user) throw new Error("auth-required");
      if (handles.has(fav.product_handle)) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_handle", fav.product_handle);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        ...fav,
      });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success(res === "added" ? "Adicionado aos favoritos" : "Removido dos favoritos");
    },
    onError: (e: Error) => {
      if (e.message === "auth-required") toast.error("Faça login para favoritar");
      else toast.error("Não foi possível atualizar favoritos");
    },
  });

  return { favorites, isFavorite: (h: string) => handles.has(h), toggle: toggle.mutate, isPending: toggle.isPending };
}
