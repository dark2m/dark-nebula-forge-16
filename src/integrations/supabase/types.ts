export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: number
          password: string
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          password: string
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: never
          password?: string
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      customer_login_attempts: {
        Row: {
          attempted_at: string | null
          email: string
          id: string
          ip_address: string | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      customer_support_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          customer_id: string | null
          files: Json | null
          id: string
          is_from_customer: boolean | null
          is_read: boolean | null
          message: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          customer_id?: string | null
          files?: Json | null
          id?: string
          is_from_customer?: boolean | null
          is_read?: boolean | null
          message: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          customer_id?: string | null
          files?: Json | null
          id?: string
          is_from_customer?: boolean | null
          is_read?: boolean | null
          message?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_support_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_support_users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_support_sessions: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          last_activity: string | null
          status: string | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          last_activity?: string | null
          status?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          last_activity?: string | null
          status?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_support_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_support_users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_support_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_blocked: boolean | null
          is_verified: boolean | null
          last_login: string | null
          password_hash: string | null
          updated_at: string | null
          username: string | null
          verification_code: string | null
          verification_expires_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_blocked?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          password_hash?: string | null
          updated_at?: string | null
          username?: string | null
          verification_code?: string | null
          verification_expires_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_blocked?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          password_hash?: string | null
          updated_at?: string | null
          username?: string | null
          verification_code?: string | null
          verification_expires_at?: string | null
        }
        Relationships: []
      }
      customer_users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          is_blocked: boolean | null
          is_online: boolean | null
          is_verified: boolean | null
          last_seen: string | null
          password: string
          registration_date: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: number
          is_blocked?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          last_seen?: string | null
          password: string
          registration_date?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          is_blocked?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          last_seen?: string | null
          password?: string
          registration_date?: string | null
          username?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean | null
          phone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      download_categories: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      download_passwords: {
        Row: {
          allowed_categories: Json | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          last_used: string | null
          name: string
          password: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          allowed_categories?: Json | null
          created_at?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          last_used?: string | null
          name: string
          password: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          allowed_categories?: Json | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          password?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          download_url: string | null
          downloads: number | null
          features: Json | null
          filename: string | null
          icon: string | null
          id: number
          images: Json | null
          last_update: string | null
          password_category: string | null
          rating: number | null
          size: string | null
          status: string | null
          title: string
          updated_at: string | null
          version: string | null
          videos: Json | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          download_url?: string | null
          downloads?: number | null
          features?: Json | null
          filename?: string | null
          icon?: string | null
          id: number
          images?: Json | null
          last_update?: string | null
          password_category?: string | null
          rating?: number | null
          size?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          version?: string | null
          videos?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          download_url?: string | null
          downloads?: number | null
          features?: Json | null
          filename?: string | null
          icon?: string | null
          id?: number
          images?: Json | null
          last_update?: string | null
          password_category?: string | null
          rating?: number | null
          size?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: string | null
          videos?: Json | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: number
          ip_address: string | null
          password: string
          success: boolean | null
          timestamp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: number
          ip_address?: string | null
          password: string
          success?: boolean | null
          timestamp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          ip_address?: string | null
          password?: string
          success?: boolean | null
          timestamp?: string
        }
        Relationships: []
      }
      page_texts: {
        Row: {
          created_at: string | null
          id: string
          page_name: string
          section_name: string
          text_key: string
          text_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_name: string
          section_name: string
          text_key: string
          text_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_name?: string
          section_name?: string
          text_key?: string
          text_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_updates: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          message: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          message: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          message?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          features: Json | null
          id: number
          image: string | null
          images: Json | null
          in_stock: boolean | null
          is_active: boolean | null
          name: string
          price: number
          rating: number | null
          text_size: string | null
          title_size: string | null
          updated_at: string | null
          videos: Json | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id: number
          image?: string | null
          images?: Json | null
          in_stock?: boolean | null
          is_active?: boolean | null
          name: string
          price?: number
          rating?: number | null
          text_size?: string | null
          title_size?: string | null
          updated_at?: string | null
          videos?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: number
          image?: string | null
          images?: Json | null
          in_stock?: boolean | null
          is_active?: boolean | null
          name?: string
          price?: number
          rating?: number | null
          text_size?: string | null
          title_size?: string | null
          updated_at?: string | null
          videos?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sales_overview: {
        Row: {
          completed_orders: number | null
          created_at: string | null
          id: string
          monthly_revenue: number | null
          pending_orders: number | null
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          completed_orders?: number | null
          created_at?: string | null
          id?: string
          monthly_revenue?: number | null
          pending_orders?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_orders?: number | null
          created_at?: string | null
          id?: string
          monthly_revenue?: number | null
          pending_orders?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_data: {
        Row: {
          content: Json
          created_at: string
          id: string
          layout_settings: Json | null
          page_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          layout_settings?: Json | null
          page_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          layout_settings?: Json | null
          page_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          settings_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings_data?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          settings_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      site_tools: {
        Row: {
          button_text: string
          category: string | null
          created_at: string | null
          custom_html: string | null
          description: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
          title: string
          updated_at: string | null
          url: string | null
          visible: boolean | null
        }
        Insert: {
          button_text?: string
          category?: string | null
          created_at?: string | null
          custom_html?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          title: string
          updated_at?: string | null
          url?: string | null
          visible?: boolean | null
        }
        Update: {
          button_text?: string
          category?: string | null
          created_at?: string | null
          custom_html?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          title?: string
          updated_at?: string | null
          url?: string | null
          visible?: boolean | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
