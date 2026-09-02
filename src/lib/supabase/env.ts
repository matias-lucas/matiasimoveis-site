export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const PROPERTY_PHOTOS_BUCKET = "property-photos";

export function publicStorageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${PROPERTY_PHOTOS_BUCKET}/${path}`;
}
