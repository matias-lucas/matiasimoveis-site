"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function fieldsFromForm(formData: FormData) {
  const photoPath = ((formData.get("photoPath") as string) ?? "").trim();
  return {
    name: ((formData.get("name") as string) ?? "").trim(),
    creci: ((formData.get("creci") as string) ?? "").trim(),
    contact: ((formData.get("contact") as string) ?? "").trim(),
    photo_path: photoPath || null,
  };
}

export async function createBroker(formData: FormData) {
  const supabase = await createClient();
  const fields = fieldsFromForm(formData);

  const { error } = await supabase.from("brokers").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/corretores");
  redirect("/admin/corretores");
}

export async function updateBroker(id: string, formData: FormData) {
  const supabase = await createClient();
  const fields = fieldsFromForm(formData);

  const { error } = await supabase.from("brokers").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/corretores");
  redirect("/admin/corretores");
}

export async function deleteBroker(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("brokers").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "Este corretor está vinculado a imóveis de venda. Atribua outro corretor a esses imóveis antes de excluir."
      );
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/corretores");
}
