import { supabase } from "@/integrations/supabase/client";

export type SubscribeResult = "ok" | "duplicate" | "invalid" | "error";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribeEmail(
  rawEmail: string,
  source: string,
): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return "invalid";

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source });

  if (!error) return "ok";
  if (error.code === "23505") return "duplicate";
  console.error("newsletter subscribe failed", error);
  return "error";
}
