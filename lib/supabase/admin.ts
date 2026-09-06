import { createClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase Admin Client for secure server-side operations
 * (Webhook verification, atomic payment state updates, admin audits).
 * Never expose this client to browser code.
 */
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xoxklwtgbrohierzfztj.supabase.co";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGtsd3RnYnJvaGllcnpmenRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQyMDkyOCwiZXhwIjoyMTAyOTk2OTI4fQ.eK5y07rcNTgHes_t1fIrTp2tUV0WcgZT3qAchgg4RAM";

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
