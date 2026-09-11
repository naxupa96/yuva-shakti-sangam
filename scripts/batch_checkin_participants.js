/**
 * Batch Check-in Script for Selected Spreadsheet Participants
 * Yuva Shakti Sangam
 * Date: September 2026
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xoxklwtgbrohierzfztj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGtsd3RnYnJvaGllcnpmenRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQyMDkyOCwiZXhwIjoyMTAyOTk2OTI4fQ.eK5y07rcNTgHes_t1fIrTp2tUV0WcgZT3qAchgg4RAM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TARGET_REGISTRATION_IDS = [
  'YSS-2026-000202', // Akshat Shah
  'YSS-2026-000154', // Divyanshu bharwad
  'YSS-2026-000066', // Harshil Khatri
  'YSS-2026-000159', // Jhanvi soni
  'YSS-2026-000007', // Jyot Pandya
  'YSS-2026-000090', // Kaushal Vikeshbhai Patel
  'YSS-2026-000157', // Krishna yadav
  'YSS-2026-000156', // Neel adhyaru
  'YSS-2026-000155', // Nirvit bhavsar
  'YSS-2026-000193', // Parv Ashishbhai Sheth
  'YSS-2026-000065', // Prakashkumar Babulal Modi
  'YSS-2026-000049', // Tirth Patidar
  'YSS-2026-000037', // Tirth Soni
  'YSS-2026-000153', // Vivek makwana
  'YSS-2026-000151', // Harsh ravat
  'YSS-2026-000158'  // Pranav khatri
];

async function main() {
  console.log(`Checking ${TARGET_REGISTRATION_IDS.length} participants...`);
  const checkinTime = '2026-09-06T12:00:00.000Z';

  for (const regId of TARGET_REGISTRATION_IDS) {
    const { data: pList, error: fetchErr } = await supabase
      .from('participants')
      .select('*')
      .eq('registration_id', regId);

    if (fetchErr || !pList || pList.length === 0) {
      console.error(`[NOT FOUND] ${regId}`);
      continue;
    }

    const p = pList[0];
    const updatePayload = {
      checked_in: true,
      check_in_time: p.check_in_time || checkinTime,
    };

    if (p.payment_status !== 'paid') {
      updatePayload.payment_status = 'paid';
      updatePayload.payment_method = 'cash';
    }

    const { error: updateErr } = await supabase
      .from('participants')
      .update(updatePayload)
      .eq('id', p.id);

    if (updateErr) {
      console.error(`[ERROR] ${regId}: ${updateErr.message}`);
    } else {
      console.log(`[OK] ${regId} - ${p.name} (checked_in: true)`);
    }
  }

  const { data: verified } = await supabase
    .from('participants')
    .select('registration_id, name, checked_in, check_in_time, payment_status')
    .in('registration_id', TARGET_REGISTRATION_IDS);

  console.log('\n--- Status Summary ---');
  verified.forEach(p => {
    console.log(`${p.registration_id} | ${p.name} | checked_in: ${p.checked_in} | payment: ${p.payment_status}`);
  });
}

main().catch(console.error);
