import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Plain (cookie-less) client for public reads on the site's server
 * components — properties/property_photos are readable by `anon` only
 * where `published = true` (see the RLS policies), so no session is
 * needed. Kept separate from lib/supabase/server.ts so public pages don't
 * pull in next/headers and can stay statically rendered / ISR'd.
 */
export function createPublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
