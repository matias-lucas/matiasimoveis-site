"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { PROPERTY_PHOTOS_BUCKET, PROPERTY_VIDEOS_BUCKET } from "@/lib/supabase/env";
import { slugify } from "@/lib/format";
import type { Database } from "@/lib/supabase/database.types";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
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
  const purpose = formData.get("purpose") as PropertyInsert["purpose"];
  const kind = formData.get("kind") as PropertyInsert["kind"];
  const brokerId = ((formData.get("brokerId") as string) ?? "").trim();

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
    condo_price: parseNumber(formData.get("condoPrice")),
    iptu_price: parseNumber(formData.get("iptuPrice")),
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
    status: formData.get("status") as PropertyInsert["status"],
    featured: formData.get("featured") === "on",
    // Only collected (and required, via the properties_broker_required_for_venda
    // check constraint) when purpose === "venda" — see PropertyForm.
    broker_id: purpose === "venda" ? brokerId || null : null,
  };
}

export async function createProperty(formData: FormData) {
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

export async function updateProperty(id: string, formData: FormData) {
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

export async function deleteProperty(id: string) {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("property_photos")
    .select("storage_path")
    .eq("property_id", id);

  if (photos?.length) {
    await supabase.storage.from(PROPERTY_PHOTOS_BUCKET).remove(photos.map((p) => p.storage_path));
  }

  const { data: videos } = await supabase
    .from("property_videos")
    .select("storage_path")
    .eq("property_id", id);

  if (videos?.length) {
    await supabase.storage.from(PROPERTY_VIDEOS_BUCKET).remove(videos.map((v) => v.storage_path));
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/imoveis");
  revalidatePath("/");
  revalidatePath("/admin/imoveis");
  redirect("/admin/imoveis");
}

export async function addPhoto(propertyId: string, storagePath: string, alt: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("property_photos")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const { data, error } = await supabase
    .from("property_photos")
    .insert({
      property_id: propertyId,
      storage_path: storagePath,
      alt,
      position: count ?? 0,
      is_cover: !count,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
  return data;
}

export async function deletePhoto(photoId: string, propertyId: string, storagePath: string) {
  const supabase = await createClient();

  await supabase.storage.from(PROPERTY_PHOTOS_BUCKET).remove([storagePath]);
  const { error } = await supabase.from("property_photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);

  const { data: remaining } = await supabase
    .from("property_photos")
    .select("id, is_cover")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (remaining?.length && !remaining.some((p) => p.is_cover)) {
    await supabase.from("property_photos").update({ is_cover: true }).eq("id", remaining[0].id);
  }

  revalidatePath(`/admin/imoveis/${propertyId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
}

export async function setCoverPhoto(photoId: string, propertyId: string) {
  const supabase = await createClient();

  await supabase.from("property_photos").update({ is_cover: false }).eq("property_id", propertyId);
  const { error } = await supabase.from("property_photos").update({ is_cover: true }).eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
}

export async function movePhoto(propertyId: string, photoId: string, direction: "up" | "down") {
  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from("property_photos")
    .select("id, position")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  if (!photos) return;

  const index = photos.findIndex((p) => p.id === photoId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= photos.length) return;

  const a = photos[index];
  const b = photos[swapWith];

  await Promise.all([
    supabase.from("property_photos").update({ position: b.position }).eq("id", a.id),
    supabase.from("property_photos").update({ position: a.position }).eq("id", b.id),
  ]);

  revalidatePath(`/admin/imoveis/${propertyId}`);
}

export async function addVideo(propertyId: string, storagePath: string, label: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("property_videos")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const { data, error } = await supabase
    .from("property_videos")
    .insert({
      property_id: propertyId,
      storage_path: storagePath,
      label,
      position: count ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
  return data;
}

export async function deleteVideo(videoId: string, propertyId: string, storagePath: string) {
  const supabase = await createClient();

  await supabase.storage.from(PROPERTY_VIDEOS_BUCKET).remove([storagePath]);
  const { error } = await supabase.from("property_videos").delete().eq("id", videoId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyId}`);
  revalidatePath("/imoveis");
  revalidatePath("/");
}

export async function moveVideo(propertyId: string, videoId: string, direction: "up" | "down") {
  const supabase = await createClient();

  const { data: videos, error } = await supabase
    .from("property_videos")
    .select("id, position")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  if (!videos) return;

  const index = videos.findIndex((v) => v.id === videoId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= videos.length) return;

  const a = videos[index];
  const b = videos[swapWith];

  await Promise.all([
    supabase.from("property_videos").update({ position: b.position }).eq("id", a.id),
    supabase.from("property_videos").update({ position: a.position }).eq("id", b.id),
  ]);

  revalidatePath(`/admin/imoveis/${propertyId}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin");
}
