/**
 * Generated via `mcp__Supabase__generate_typescript_types` against the
 * `matiasimoveis` project. Regenerate the same way after any schema change
 * (see the migrations applied through the same MCP tool) — don't hand-edit.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      brokers: {
        Row: {
          contact: string;
          created_at: string;
          creci: string;
          id: string;
          name: string;
        };
        Insert: {
          contact: string;
          created_at?: string;
          creci: string;
          id?: string;
          name: string;
        };
        Update: {
          contact?: string;
          created_at?: string;
          creci?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          address: string | null;
          area_m2: number | null;
          bathrooms: number | null;
          bedrooms: number | null;
          broker_id: string | null;
          city: string;
          condo_price: number | null;
          created_at: string;
          description: string;
          featured: boolean;
          features: string[];
          id: string;
          iptu_price: number | null;
          kind: Database["public"]["Enums"]["property_kind"];
          kind_other: string | null;
          lot_area_m2: number | null;
          neighborhood: string;
          parking: number | null;
          parking_motorcycle_only: boolean;
          price: number;
          published: boolean;
          published_at: string | null;
          purpose: Database["public"]["Enums"]["property_purpose"];
          ref: string;
          slug: string;
          state: string;
          status: Database["public"]["Enums"]["property_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          area_m2?: number | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          broker_id?: string | null;
          city?: string;
          condo_price?: number | null;
          created_at?: string;
          description?: string;
          featured?: boolean;
          features?: string[];
          id?: string;
          iptu_price?: number | null;
          kind: Database["public"]["Enums"]["property_kind"];
          kind_other?: string | null;
          lot_area_m2?: number | null;
          neighborhood: string;
          parking?: number | null;
          parking_motorcycle_only?: boolean;
          price: number;
          published?: boolean;
          published_at?: string | null;
          purpose: Database["public"]["Enums"]["property_purpose"];
          ref?: string;
          slug: string;
          state?: string;
          status?: Database["public"]["Enums"]["property_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          area_m2?: number | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          broker_id?: string | null;
          city?: string;
          condo_price?: number | null;
          created_at?: string;
          description?: string;
          featured?: boolean;
          features?: string[];
          id?: string;
          iptu_price?: number | null;
          kind?: Database["public"]["Enums"]["property_kind"];
          kind_other?: string | null;
          lot_area_m2?: number | null;
          neighborhood?: string;
          parking?: number | null;
          parking_motorcycle_only?: boolean;
          price?: number;
          published?: boolean;
          published_at?: string | null;
          purpose?: Database["public"]["Enums"]["property_purpose"];
          ref?: string;
          slug?: string;
          state?: string;
          status?: Database["public"]["Enums"]["property_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "properties_broker_id_fkey";
            columns: ["broker_id"];
            isOneToOne: false;
            referencedRelation: "brokers";
            referencedColumns: ["id"];
          },
        ];
      };
      property_photos: {
        Row: {
          alt: string;
          created_at: string;
          id: string;
          is_cover: boolean;
          position: number;
          property_id: string;
          storage_path: string;
        };
        Insert: {
          alt?: string;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          position?: number;
          property_id: string;
          storage_path: string;
        };
        Update: {
          alt?: string;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          position?: number;
          property_id?: string;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      property_kind:
        | "casa"
        | "apartamento"
        | "sobrado"
        | "lote"
        | "galpao"
        | "kitnet"
        | "sala_comercial"
        | "outros";
      property_purpose: "venda" | "locacao";
      property_status: "disponivel" | "em_negociacao" | "vendido" | "alugado";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
