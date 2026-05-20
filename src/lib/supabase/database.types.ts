export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: {
          id: string;
          external_review_id: string | null;
          place_id: string;
          author_name: string | null;
          rating: number | null;
          content: string;
          status: string;
          ai_replies: Json | null;
          selected_tone: string | null;
          selected_reply: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          external_review_id?: string | null;
          place_id: string;
          author_name?: string | null;
          rating?: number | null;
          content: string;
          status?: string;
          ai_replies?: Json | null;
          selected_tone?: string | null;
          selected_reply?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          external_review_id?: string | null;
          place_id?: string;
          author_name?: string | null;
          rating?: number | null;
          content?: string;
          status?: string;
          ai_replies?: Json | null;
          selected_tone?: string | null;
          selected_reply?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
