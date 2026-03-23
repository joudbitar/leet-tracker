import { createClient } from '@supabase/supabase-js'

// SETUP REQUIRED: In Supabase dashboard → Authentication → Providers → Google
// Enable Google, add OAuth credentials from Google Cloud Console
// Add redirect URL: https://leet-tracker-pied.vercel.app to allowed origins

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
