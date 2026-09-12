import { supabase } from "@/integrations/supabase/client";

// The backend is provided by Lovable Cloud; the client is generated and always
// configured. This module stays as a thin shim so the rest of the app keeps
// using the same helpers.
export const isSupabaseConfigured = true;

/** Returns the shared backend client. */
export function getSupabase() {
  return supabase;
}
