import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback for development - you'll need to replace these with your actual values
const fallbackUrl = supabaseUrl || 'https://your-project.supabase.co'
const fallbackKey = supabaseAnonKey || 'your-anon-key-here'

if (!supabaseUrl && !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback values for development.')
}

export const supabase = createClient(fallbackUrl, fallbackKey)