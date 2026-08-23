import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xoxklwtgbrohierzfztj.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGtsd3RnYnJvaGllcnpmenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjA5MjgsImV4cCI6MjEwMjk5NjkyOH0.V3mLvjcEv2zAXiEnENhYWfL19EwnGbtF-qLBMIBqbuE";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
