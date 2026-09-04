import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Client simples (sem cookies) para leituras públicas nos server components
 * do site — properties/property_photos só são legíveis por `anon` onde
 * `published = true` (ver as políticas de RLS), então nenhuma sessão é
 * necessária. Mantido separado de lib/supabase/server.ts para que as
 * páginas públicas não puxem next/headers e possam continuar renderizadas
 * estaticamente / com ISR.
 */
export function createPublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
