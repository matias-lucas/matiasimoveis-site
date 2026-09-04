"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Compartilhada pelas seções /admin/imoveis e /admin/corretores — ver AdminHeader. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin");
}
