import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface Database {
  public: {
    Tables: {
      stacks: {
        Row: {
          id: string
          title: string
          frontend: string
          backend: string
          database: string
          hosting: string
          other_tools: string[]
          description: string | null
          author_name: string | null
          is_anonymous: boolean
          created_at: string
          roast_count: number
        }
        Insert: {
          id?: string
          title: string
          frontend: string
          backend: string
          database: string
          hosting: string
          other_tools?: string[]
          description?: string | null
          author_name?: string | null
          is_anonymous?: boolean
          created_at?: string
          roast_count?: number
        }
        Update: {
          id?: string
          title?: string
          frontend?: string
          backend?: string
          database?: string
          hosting?: string
          other_tools?: string[]
          description?: string | null
          author_name?: string | null
          is_anonymous?: boolean
          created_at?: string
          roast_count?: number
        }
      }
      roasts: {
        Row: {
          id: string
          stack_id: string
          content: string
          roast_type: 'brutal' | 'constructive' | 'meme'
          author_name: string | null
          upvotes: number
          downvotes: number
          created_at: string
        }
        Insert: {
          id?: string
          stack_id: string
          content: string
          roast_type?: 'brutal' | 'constructive' | 'meme'
          author_name?: string | null
          upvotes?: number
          downvotes?: number
          created_at?: string
        }
        Update: {
          id?: string
          stack_id?: string
          content?: string
          roast_type?: 'brutal' | 'constructive' | 'meme'
          author_name?: string | null
          upvotes?: number
          downvotes?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          roast_id: string
          voter_ip: string
          vote_type: 'up' | 'down'
          created_at: string
        }
        Insert: {
          id?: string
          roast_id: string
          voter_ip: string
          vote_type: 'up' | 'down'
          created_at?: string
        }
        Update: {
          id?: string
          roast_id?: string
          voter_ip?: string
          vote_type?: 'up' | 'down'
          created_at?: string
        }
      }
    }
  }
}

export type TechStack = Database['public']['Tables']['stacks']['Row']
export type Roast = Database['public']['Tables']['roasts']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']