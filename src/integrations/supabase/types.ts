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
      bookings: {
        Row: {
          booking_date: string
          booking_status: Database["public"]["Enums"]["booking_status"] | null
          created_at: string
          id: string
          payment_id: string | null
          seats_booked: Json
          show_id: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date?: string
          booking_status?: Database["public"]["Enums"]["booking_status"] | null
          created_at?: string
          id?: string
          payment_id?: string | null
          seats_booked: Json
          show_id: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_status?: Database["public"]["Enums"]["booking_status"] | null
          created_at?: string
          id?: string
          payment_id?: string | null
          seats_booked?: Json
          show_id?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          cast_members: string[] | null
          created_at: string
          description: string | null
          director: string | null
          duration: number
          genre: string[]
          id: string
          language: string
          poster_url: string | null
          rating: number | null
          release_date: string | null
          status: string | null
          title: string
          trailer_url: string | null
          updated_at: string
        }
        Insert: {
          cast_members?: string[] | null
          created_at?: string
          description?: string | null
          director?: string | null
          duration: number
          genre: string[]
          id?: string
          language: string
          poster_url?: string | null
          rating?: number | null
          release_date?: string | null
          status?: string | null
          title: string
          trailer_url?: string | null
          updated_at?: string
        }
        Update: {
          cast_members?: string[] | null
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: number
          genre?: string[]
          id?: string
          language?: string
          poster_url?: string | null
          rating?: number | null
          release_date?: string | null
          status?: string | null
          title?: string
          trailer_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      screens: {
        Row: {
          created_at: string
          id: string
          screen_number: number
          screen_type: string | null
          seating_layout: Json | null
          theater_id: string
          total_seats: number
        }
        Insert: {
          created_at?: string
          id?: string
          screen_number: number
          screen_type?: string | null
          seating_layout?: Json | null
          theater_id: string
          total_seats: number
        }
        Update: {
          created_at?: string
          id?: string
          screen_number?: number
          screen_type?: string | null
          seating_layout?: Json | null
          theater_id?: string
          total_seats?: number
        }
        Relationships: [
          {
            foreignKeyName: "screens_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      seats: {
        Row: {
          created_at: string
          id: string
          is_available: boolean | null
          screen_id: string
          seat_number: string
          seat_row: string
          seat_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          screen_id: string
          seat_number: string
          seat_row: string
          seat_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          screen_id?: string
          seat_number?: string
          seat_row?: string
          seat_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seats_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      show_seats: {
        Row: {
          blocked_until: string | null
          booking_id: string | null
          created_at: string
          id: string
          seat_id: string
          show_id: string
          status: Database["public"]["Enums"]["seat_status"] | null
          updated_at: string
        }
        Insert: {
          blocked_until?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          seat_id: string
          show_id: string
          status?: Database["public"]["Enums"]["seat_status"] | null
          updated_at?: string
        }
        Update: {
          blocked_until?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          seat_id?: string
          show_id?: string
          status?: Database["public"]["Enums"]["seat_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "show_seats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_seats_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_seats_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      shows: {
        Row: {
          available_seats: number
          created_at: string
          id: string
          movie_id: string
          price: number
          screen_id: string
          show_date: string
          show_time: string
          status: Database["public"]["Enums"]["show_status"] | null
          updated_at: string
        }
        Insert: {
          available_seats: number
          created_at?: string
          id?: string
          movie_id: string
          price: number
          screen_id: string
          show_date: string
          show_time: string
          status?: Database["public"]["Enums"]["show_status"] | null
          updated_at?: string
        }
        Update: {
          available_seats?: number
          created_at?: string
          id?: string
          movie_id?: string
          price?: number
          screen_id?: string
          show_date?: string
          show_time?: string
          status?: Database["public"]["Enums"]["show_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shows_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shows_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      theaters: {
        Row: {
          city: string
          created_at: string
          facilities: string[] | null
          id: string
          location: string
          name: string
          total_screens: number
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          facilities?: string[] | null
          id?: string
          location: string
          name: string
          total_screens?: number
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          facilities?: string[] | null
          id?: string
          location?: string
          name?: string
          total_screens?: number
          updated_at?: string
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
      booking_status: "pending" | "confirmed" | "cancelled" | "expired"
      seat_status: "available" | "booked" | "blocked"
      show_status: "active" | "cancelled" | "completed"
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
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "expired"],
      seat_status: ["available", "booked", "blocked"],
      show_status: ["active", "cancelled", "completed"],
    },
  },
} as const
