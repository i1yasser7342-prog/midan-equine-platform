import { createClient } from "@supabase/supabase-js";

// Public/publishable identifiers — safe to ship in a client bundle. Access
// control lives in Postgres Row Level Security, not in keeping this secret.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://mmnoakrozofyobfwxuns.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_xkTcAv17I-E5RFa2ruO7Vg_xhdnh_Yy";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const functionsBaseUrl =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_BASE_URL || `${supabaseUrl}/functions/v1`;
