export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      evaluations: {
        Row: {
          description: string | null;
          evaluation: Database['public']['Enums']['eval_rate'];
          id: number;
          id_request: number | null;
          id_senior: number | null;
          id_volunteer: number | null;
        };
        Insert: {
          description?: string | null;
          evaluation: Database['public']['Enums']['eval_rate'];
          id?: number;
          id_request?: number | null;
          id_senior?: number | null;
          id_volunteer?: number | null;
        };
        Update: {
          description?: string | null;
          evaluation?: Database['public']['Enums']['eval_rate'];
          id?: number;
          id_request?: number | null;
          id_senior?: number | null;
          id_volunteer?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'evaluations_id_request_fkey';
            columns: ['id_request'];
            isOneToOne: false;
            referencedRelation: 'requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'evaluations_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'evaluations_id_volunteer_fkey';
            columns: ['id_volunteer'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      groceries: {
        Row: {
          category: string | null;
          created_at: string | null;
          id: number;
          name: string;
          unit: number | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          id?: number;
          name: string;
          unit?: number | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string;
          unit?: number | null;
        };
        Relationships: [];
      };
      medicine: {
        Row: {
          created_at: string | null;
          description: string | null;
          dosage: number | null;
          end_date: string | null;
          frequency: number | null;
          id: number;
          id_senior: number | null;
          name: string;
          scheduled_time: string | null;
          start_date: string | null;
          status: Database['public']['Enums']['med_status'] | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          dosage?: number | null;
          end_date?: string | null;
          frequency?: number | null;
          id?: number;
          id_senior?: number | null;
          name: string;
          scheduled_time?: string | null;
          start_date?: string | null;
          status?: Database['public']['Enums']['med_status'] | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          dosage?: number | null;
          end_date?: string | null;
          frequency?: number | null;
          id?: number;
          id_senior?: number | null;
          name?: string;
          scheduled_time?: string | null;
          start_date?: string | null;
          status?: Database['public']['Enums']['med_status'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'medicine_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      monitoring: {
        Row: {
          custom_metric_name: string | null;
          custom_metric_value: number | null;
          id: number;
          id_senior: number | null;
          type: Database['public']['Enums']['type_monitoring'] | null;
          value: number | null;
        };
        Insert: {
          custom_metric_name?: string | null;
          custom_metric_value?: number | null;
          id?: number;
          id_senior?: number | null;
          type?: Database['public']['Enums']['type_monitoring'] | null;
          value?: number | null;
        };
        Update: {
          custom_metric_name?: string | null;
          custom_metric_value?: number | null;
          id?: number;
          id_senior?: number | null;
          type?: Database['public']['Enums']['type_monitoring'] | null;
          value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'monitoring_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          description: string;
          id: number;
          id_caretaker: number | null;
          id_senior: number | null;
          id_volunteer: number | null;
          type: string | null;
        };
        Insert: {
          description: string;
          id?: number;
          id_caretaker?: number | null;
          id_senior?: number | null;
          id_volunteer?: number | null;
          type?: string | null;
        };
        Update: {
          description?: string;
          id?: number;
          id_caretaker?: number | null;
          id_senior?: number | null;
          id_volunteer?: number | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_id_caretaker_fkey';
            columns: ['id_caretaker'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_id_volunteer_fkey';
            columns: ['id_volunteer'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      request_item: {
        Row: {
          id: number;
          id_groceries: number | null;
          id_medicine: number | null;
          id_request: number | null;
        };
        Insert: {
          id?: number;
          id_groceries?: number | null;
          id_medicine?: number | null;
          id_request?: number | null;
        };
        Update: {
          id?: number;
          id_groceries?: number | null;
          id_medicine?: number | null;
          id_request?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'request_item_id_groceries_fkey';
            columns: ['id_groceries'];
            isOneToOne: false;
            referencedRelation: 'groceries';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'request_item_id_medicine_fkey';
            columns: ['id_medicine'];
            isOneToOne: false;
            referencedRelation: 'medicine';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'request_item_id_request_fkey';
            columns: ['id_request'];
            isOneToOne: false;
            referencedRelation: 'requests';
            referencedColumns: ['id'];
          },
        ];
      };
      requests: {
        Row: {
          category: string | null;
          created_at: string | null;
          description: string | null;
          distance: number | null;
          id: number;
          id_caretaker: number | null;
          id_senior: number | null;
          id_volunteer: number | null;
          location_address: string | null;
          state: Database['public']['Enums']['req_state'] | null;
          updated_at: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          distance?: number | null;
          id?: number;
          id_caretaker?: number | null;
          id_senior?: number | null;
          id_volunteer?: number | null;
          location_address?: string | null;
          state?: Database['public']['Enums']['req_state'] | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          distance?: number | null;
          id?: number;
          id_caretaker?: number | null;
          id_senior?: number | null;
          id_volunteer?: number | null;
          location_address?: string | null;
          state?: Database['public']['Enums']['req_state'] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'requests_id_caretaker_fkey';
            columns: ['id_caretaker'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'requests_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'requests_id_volunteer_fkey';
            columns: ['id_volunteer'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      senior_caretaker: {
        Row: {
          id_caretaker: number;
          id_senior: number;
        };
        Insert: {
          id_caretaker: number;
          id_senior: number;
        };
        Update: {
          id_caretaker?: number;
          id_senior?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'senior_caretaker_id_caretaker_fkey';
            columns: ['id_caretaker'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'senior_caretaker_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      senior_groceries: {
        Row: {
          created_at: string | null;
          id: number;
          id_groceries: number;
          id_senior: number;
          quantity: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          id_groceries: number;
          id_senior: number;
          quantity?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          id_groceries?: number;
          id_senior?: number;
          quantity?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'senior_groceries_id_groceries_fkey';
            columns: ['id_groceries'];
            isOneToOne: false;
            referencedRelation: 'groceries';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'senior_groceries_id_senior_fkey';
            columns: ['id_senior'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          action_radius: number | null;
          address: string | null;
          auth_user_id: string | null;
          created_at: string | null;
          email: string;
          gender: Database['public']['Enums']['user_gender'] | null;
          id: number;
          local: string | null;
          name: string;
          password_hash: string;
          profile_picture: Json | null;
          rating: number | null;
          role: Database['public']['Enums']['user_role'];
          updated_at: string | null;
          zip_code: string | null;
        };
        Insert: {
          action_radius?: number | null;
          address?: string | null;
          auth_user_id?: string | null;
          created_at?: string | null;
          email: string;
          gender?: Database['public']['Enums']['user_gender'] | null;
          id?: number;
          local?: string | null;
          name: string;
          password_hash: string;
          profile_picture?: Json | null;
          rating?: number | null;
          role: Database['public']['Enums']['user_role'];
          updated_at?: string | null;
          zip_code?: string | null;
        };
        Update: {
          action_radius?: number | null;
          address?: string | null;
          auth_user_id?: string | null;
          created_at?: string | null;
          email?: string;
          gender?: Database['public']['Enums']['user_gender'] | null;
          id?: number;
          local?: string | null;
          name?: string;
          password_hash?: string;
          profile_picture?: Json | null;
          rating?: number | null;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      vouchers: {
        Row: {
          address: string | null;
          id: number;
          needed_tasks: number | null;
          store_name: string;
          value: number;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          id?: number;
          needed_tasks?: number | null;
          store_name: string;
          value: number;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          id?: number;
          needed_tasks?: number | null;
          store_name?: string;
          value?: number;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      vouchers_volunteer: {
        Row: {
          id_volunteer: number;
          id_voucher: number;
          status: Database['public']['Enums']['vouch_status'] | null;
        };
        Insert: {
          id_volunteer: number;
          id_voucher: number;
          status?: Database['public']['Enums']['vouch_status'] | null;
        };
        Update: {
          id_volunteer?: number;
          id_voucher?: number;
          status?: Database['public']['Enums']['vouch_status'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'vouchers_volunteer_id_volunteer_fkey';
            columns: ['id_volunteer'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'vouchers_volunteer_id_voucher_fkey';
            columns: ['id_voucher'];
            isOneToOne: false;
            referencedRelation: 'vouchers';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      eval_rate: 'SATISFIED' | 'NEUTRAL' | 'DISSATISFIED';
      med_status: 'LATE' | 'ALREADY TAKEN' | 'TO TAKE';
      req_state: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
      type_monitoring: 'BLOOD PRESSURE' | 'HEART RATE' | 'TEMPERATURE';
      user_gender: 'FEMALE' | 'MALE' | 'NON-BINARY' | 'PREFER NOT TO SAY';
      user_role: 'SENIOR' | 'CARETAKER' | 'VOLUNTEER';
      vouch_status: 'AVAILABLE' | 'UNAVAILABLE' | 'EXPIRED';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      eval_rate: ['SATISFIED', 'NEUTRAL', 'DISSATISFIED'],
      med_status: ['LATE', 'ALREADY TAKEN', 'TO TAKE'],
      req_state: ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
      type_monitoring: ['BLOOD PRESSURE', 'HEART RATE', 'TEMPERATURE'],
      user_gender: ['FEMALE', 'MALE', 'NON-BINARY', 'PREFER NOT TO SAY'],
      user_role: ['SENIOR', 'CARETAKER', 'VOLUNTEER'],
      vouch_status: ['AVAILABLE', 'UNAVAILABLE', 'EXPIRED'],
    },
  },
} as const;
