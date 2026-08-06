export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string
          dm_notes: string | null
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          dm_notes?: string | null
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          dm_notes?: string | null
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      character_classes: {
        Row: {
          character_id: string
          class_id: string | null
          class_snapshot: Json
          hit_points_rolled: number[] | null
          id: string
          level: number
          position: number
        }
        Insert: {
          character_id: string
          class_id?: string | null
          class_snapshot: Json
          hit_points_rolled?: number[] | null
          id?: string
          level: number
          position?: number
        }
        Update: {
          character_id?: string
          class_id?: string | null
          class_snapshot?: Json
          hit_points_rolled?: number[] | null
          id?: string
          level?: number
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_classes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      character_effects: {
        Row: {
          active: boolean
          applied_at: string
          bonus_type: string
          character_id: string
          duration: string | null
          id: string
          source: string
          target: string
          value: number
        }
        Insert: {
          active?: boolean
          applied_at?: string
          bonus_type?: string
          character_id: string
          duration?: string | null
          id?: string
          source: string
          target: string
          value: number
        }
        Update: {
          active?: boolean
          applied_at?: string
          bonus_type?: string
          character_id?: string
          duration?: string | null
          id?: string
          source?: string
          target?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_effects_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_feats: {
        Row: {
          character_id: string
          feat_id: string | null
          feat_snapshot: Json
          granted_at_level: number | null
          id: string
          source: string
        }
        Insert: {
          character_id: string
          feat_id?: string | null
          feat_snapshot: Json
          granted_at_level?: number | null
          id?: string
          source?: string
        }
        Update: {
          character_id?: string
          feat_id?: string | null
          feat_snapshot?: Json
          granted_at_level?: number | null
          id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_feats_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_feats_feat_id_fkey"
            columns: ["feat_id"]
            isOneToOne: false
            referencedRelation: "feats"
            referencedColumns: ["id"]
          },
        ]
      }
      character_inventory: {
        Row: {
          character_id: string
          created_at: string
          custom_name: string | null
          equipped_slot: string | null
          id: string
          item_id: string | null
          item_snapshot: Json
          notes: string | null
          quantity: number
        }
        Insert: {
          character_id: string
          created_at?: string
          custom_name?: string | null
          equipped_slot?: string | null
          id?: string
          item_id?: string | null
          item_snapshot: Json
          notes?: string | null
          quantity?: number
        }
        Update: {
          character_id?: string
          created_at?: string
          custom_name?: string | null
          equipped_slot?: string | null
          id?: string
          item_id?: string | null
          item_snapshot?: Json
          notes?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_inventory_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      character_money: {
        Row: {
          character_id: string
          cp: number
          gp: number
          pp: number
          sp: number
        }
        Insert: {
          character_id: string
          cp?: number
          gp?: number
          pp?: number
          sp?: number
        }
        Update: {
          character_id?: string
          cp?: number
          gp?: number
          pp?: number
          sp?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_money_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_spells: {
        Row: {
          character_id: string
          class_slug: string
          id: string
          is_domain: boolean
          known: boolean
          prepared: number
          spell_id: string | null
          spell_level: number
          spell_snapshot: Json
        }
        Insert: {
          character_id: string
          class_slug: string
          id?: string
          is_domain?: boolean
          known?: boolean
          prepared?: number
          spell_id?: string | null
          spell_level: number
          spell_snapshot: Json
        }
        Update: {
          character_id?: string
          class_slug?: string
          id?: string
          is_domain?: boolean
          known?: boolean
          prepared?: number
          spell_id?: string | null
          spell_level?: number
          spell_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "character_spells_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_spells_spell_id_fkey"
            columns: ["spell_id"]
            isOneToOne: false
            referencedRelation: "spells"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          ability_level_increases: Json
          age: number | null
          alignment: string | null
          avatar_url: string | null
          base_ability_scores: Json
          campaign_id: string | null
          created_at: string
          deity: string | null
          experience: number
          eyes: string | null
          gender: string | null
          hair: string | null
          height: string | null
          hp_damage: number
          hp_nonlethal: number
          hp_temp: number
          id: string
          is_shared: boolean
          name: string
          owner_id: string
          player_name: string | null
          race_id: string | null
          race_snapshot: Json | null
          share_token: string | null
          size: string
          skill_ranks: Json
          skin: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          ability_level_increases?: Json
          age?: number | null
          alignment?: string | null
          avatar_url?: string | null
          base_ability_scores?: Json
          campaign_id?: string | null
          created_at?: string
          deity?: string | null
          experience?: number
          eyes?: string | null
          gender?: string | null
          hair?: string | null
          height?: string | null
          hp_damage?: number
          hp_nonlethal?: number
          hp_temp?: number
          id?: string
          is_shared?: boolean
          name: string
          owner_id: string
          player_name?: string | null
          race_id?: string | null
          race_snapshot?: Json | null
          share_token?: string | null
          size?: string
          skill_ranks?: Json
          skin?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          ability_level_increases?: Json
          age?: number | null
          alignment?: string | null
          avatar_url?: string | null
          base_ability_scores?: Json
          campaign_id?: string | null
          created_at?: string
          deity?: string | null
          experience?: number
          eyes?: string | null
          gender?: string | null
          hair?: string | null
          height?: string | null
          hp_damage?: number
          hp_nonlethal?: number
          hp_temp?: number
          id?: string
          is_shared?: boolean
          name?: string
          owner_id?: string
          player_name?: string | null
          race_id?: string | null
          race_snapshot?: Json | null
          share_token?: string | null
          size?: string
          skill_ranks?: Json
          skin?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_prestige: boolean
          name: string
          owner_id: string | null
          pack: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_prestige?: boolean
          name: string
          owner_id?: string | null
          pack?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_prestige?: boolean
          name?: string
          owner_id?: string | null
          pack?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      conditions: {
        Row: {
          created_at: string
          data: Json
          id: string
          name: string
          owner_id: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          name: string
          owner_id?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          name?: string
          owner_id?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
        }
        Relationships: []
      }
      feats: {
        Row: {
          created_at: string
          data: Json
          feat_type: string
          id: string
          name: string
          owner_id: string | null
          pack: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          data?: Json
          feat_type?: string
          id?: string
          name: string
          owner_id?: string | null
          pack?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          data?: Json
          feat_type?: string
          id?: string
          name?: string
          owner_id?: string | null
          pack?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string
          data: Json
          id: string
          item_type: string
          name: string
          owner_id: string | null
          pack: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          item_type?: string
          name: string
          owner_id?: string | null
          pack?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          item_type?: string
          name?: string
          owner_id?: string | null
          pack?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      races: {
        Row: {
          created_at: string
          data: Json
          id: string
          name: string
          owner_id: string | null
          pack: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          name: string
          owner_id?: string | null
          pack?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          name?: string
          owner_id?: string | null
          pack?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      session_log: {
        Row: {
          character_id: string
          created_at: string
          id: string
          kind: string
          payload: Json
          session_group: string | null
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          kind: string
          payload?: Json
          session_group?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          kind?: string
          payload?: Json
          session_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_log_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          armor_check_penalty: boolean
          created_at: string
          data: Json
          id: string
          key_ability: string
          name: string
          owner_id: string | null
          pack: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          trained_only: boolean
          updated_at: string
          version: number
        }
        Insert: {
          armor_check_penalty?: boolean
          created_at?: string
          data?: Json
          id?: string
          key_ability: string
          name: string
          owner_id?: string | null
          pack?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          trained_only?: boolean
          updated_at?: string
          version?: number
        }
        Update: {
          armor_check_penalty?: boolean
          created_at?: string
          data?: Json
          id?: string
          key_ability?: string
          name?: string
          owner_id?: string | null
          pack?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          trained_only?: boolean
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      spells: {
        Row: {
          created_at: string
          data: Json
          id: string
          name: string
          owner_id: string | null
          pack: string | null
          school: string | null
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          name: string
          owner_id?: string | null
          pack?: string | null
          school?: string | null
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          name?: string
          owner_id?: string | null
          pack?: string | null
          school?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_source: "builtin" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_source: ["builtin", "custom"],
    },
  },
} as const
