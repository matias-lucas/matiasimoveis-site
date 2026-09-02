import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Cookie-aware client for the admin panel's server components/actions —
 * session-bound, so RLS's "admin full access" policies apply. Not used by
 * the public site (see lib/supabase/public.ts) so those pages don't get
 * forced into dynamic rendering by the cookies() call here.
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
          // Called from a Server Component render — middleware refreshes
          // the session cookie on the next request instead.
        }
      },
    },
  });
}
