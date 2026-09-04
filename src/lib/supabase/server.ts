import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Client ciente de cookies, para os server components/actions do painel
 * admin — vinculado à sessão, então as políticas "admin full access" do RLS
 * se aplicam. Não é usado pelo site público (ver lib/supabase/public.ts),
 * então aquelas páginas não são forçadas a renderização dinâmica pela
 * chamada a cookies() aqui.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado a partir da renderização de um Server Component — o
          // middleware renova o cookie de sessão na próxima request.
        }
      },
    },
  });
}
