"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { IMOVEL_PHOTOS_BUCKET, IMOVEL_VIDEOS_BUCKET } from "@/lib/supabase/env";
import { slugify } from "@/lib/format";
import type { Database } from "@/lib/supabase/database.types";

type ImovelInsert = Database["public"]["Tables"]["properties"]["Insert"];
type Client = SupabaseClient<Database>;

async function uniqueSlug(supabase: Client, base: string, excludeId?: string): Promise<string> {
  const root = base || "imovel";
  let slug = root;
  let suffix = 2;

  for (;;) {
    let query = supabase.from("properties").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${root}-${suffix++}`;
  }
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseIntOrNull(value: FormDataEntryValue | null): number | null {
  const n = parseNumber(value);
  return n == null ? null : Math.trunc(n);
}

function fieldsFromForm(formData: FormData) {
  const featuresRaw = (formData.get("features") as string) ?? "";
  const purpose = formData.get("purpose") as ImovelInsert["purpose"];
  const kind = formData.get("kind") as ImovelInsert["kind"];
  const corretorId = ((formData.get("corretorId") as string) ?? "").trim();

  return {
    purpose,
    kind,
    kind_other: kind === "outros" ? ((formData.get("kindOther") as string) ?? "").trim() || null : null,
    title: ((formData.get("title") as string) ?? "").trim(),
    description: ((formData.get("description") as string) ?? "").trim(),
    neighborhood: ((formData.get("neighborhood") as string) ?? "").trim(),
    city: ((formData.get("city") as string) || "Itaberaí").trim(),
    state: ((formData.get("state") as string) || "GO").trim(),
    address: ((formData.get("address") as string) ?? "").trim() || null,
    price: parseNumber(formData.get("price")) ?? 0,
    bedrooms: parseIntOrNull(formData.get("bedrooms")),
    bathrooms: parseIntOrNull(formData.get("bathrooms")),
    parking: parseIntOrNull(formData.get("parking")),
    parking_motorcycle_only: formData.get("parkingMotorcycleOnly") === "on",
    area_m2: parseNumber(formData.get("areaM2")),
    lot_area_m2: parseNumber(formData.get("lotAreaM2")),
    features: featuresRaw
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
    status: formData.get("status") as ImovelInsert["status"],
    featured: formData.get("featured") === "on",
    // Só é coletado (e exigido, via a check constraint
    // properties_broker_required_for_venda) quando purpose === "venda" — ver ImovelForm.
    broker_id: purpose === "venda" ? corretorId || null : null,
  };
}

export async function createImovel(formData: FormData) {
  const supabase = await createClient();
  const fields = fieldsFromForm(formData);
  const slug = await uniqueSlug(supabase, slugify(`${fields.title}-${fields.neighborhood}`));

  const requestedRef = ((formData.get("ref") as string) ?? "").trim();

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...fields, slug, ...(requestedRef ? { ref: requestedRef } : {}) })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/imoveis");
  revalidatePath("/");
  revalidatePath("/admin/imoveis");
  redirect(`/admin/imoveis/${data.id}`);
}

export async function updateImovel(id: string, formData: FormData) {
  const supabase = await createClient();
  const fields = fieldsFromForm(formData);

  const requestedSlug = ((formData.get("slug") as string) ?? "").trim();
  const baseSlug = slugify(requestedSlug || `${fields.title}-${fields.neighborhood}`);
  const slug = await uniqueSlug(supabase, baseSlug, id);

  const requestedRef = ((formData.get("ref") as string) ?? "").trim();

  const { error } = await supabase
    .from("properties")
    .update({ ...fields, slug, ...(requestedRef ? { ref: requestedRef } : {}) })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/imoveis");
  revalidatePath("/");
  revalidatePath(`/imovel/${slug}`);
  revalidatePath(`/admin/imoveis/${id}`);
  revalidatePath("/admin/imoveis");
}

export async function setPublished(id: string, published: boolean) {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from("properties")
    .select("slug, published_at")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("properties")
    .update({
      published,
      published_at: published ? (current?.published_at ?? new Date().toISOString()) : current?.published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/imoveis");
  revalidatePath("/");
  if (current?.slug) revalidatePath(`/imovel/${current.slug}`);
  revalidatePath("/admin/imoveis");
  revalidatePath(`/admin/imoveis/${id}`);
}

export async function setFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("properties").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/imoveis");
  revalidatePath(`/admin/imoveis/${id}`);
}

export async function deleteImovel(id: string) {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("property_photos")
    .select("storage_path")
    .eq("property_id", id);

  if (photos?.length) {
    await supabase.storage.from(IMOVEL_PHOTOS_BUCKET).remove(photos.map((p) => p.storage_path));
  }

  const { data: videos } = await supabase
    .from("property_videos")
    .select("storage_path")
    .eq("property_id", id);

  if (videos?.length) {
    await supabase.storage.from(IMOVEL_VIDEOS_BUCKET).remove(videos.map((v) => v.storage_path));
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/imoveis");
  revalidatePath("/");
  revalidatePath("/admin/imoveis");
  redirect("/admin/imoveis");
}
