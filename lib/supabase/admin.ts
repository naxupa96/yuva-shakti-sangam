import { createClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase Admin Client for secure server-side operations
 * (Webhook verification, atomic payment state updates, admin audits).
 * Never expose this client to browser code.
 */
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xoxklwtgbrohierzfztj.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGtsd3RnYnJvaGllcnpmenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjA5MjgsImV4cCI6MjEwMjk5NjkyOH0.V3mLvjcEv2zAXiEnENhYWfL19EwnGbtF-qLBMIBqbuE";

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
