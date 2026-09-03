export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const PROPERTY_PHOTOS_BUCKET = "property-photos";
export const PROPERTY_VIDEOS_BUCKET = "property-videos";
export const BROKER_PHOTOS_BUCKET = "broker-photos";

export function publicStorageUrl(path: string, bucket: string = PROPERTY_PHOTOS_BUCKET): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
