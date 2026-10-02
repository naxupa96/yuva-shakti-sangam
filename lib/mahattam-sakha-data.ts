/**
 * Updated Vasti & Sthan Data Mapping for Mahattam Shakha
 * Based on the latest master list
 */

export interface SthanDetail {
  name: string;
  defaultTime?: string; // e.g. "7:00 to 8:00", "Evening", "Morning"
  preferredTiming?: "Prabhat" | "Shayam";
  category?: "Vidyardhi" | "vyavsayi" | string;
}

export interface VastiGroup {
  vasti: string;
  sthans: SthanDetail[];
}

export const VASTI_CONFIG: Record<string, SthanDetail[]> = {
  "Chitrakut": [
    { name: "School No-4,", defaultTime: "7:00 to 8:00 (Prabhat)", preferredTiming: "Prabhat", category: "Vidyardhi" },
    { name: "Lili lotus", defaultTime: "Evening", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Takshashila (Evening)", defaultTime: "Evening", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Bhuvan (Mangal Bhuvan)", defaultTime: "Evening", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Sayukta", defaultTime: "7:00 to 8:00", preferredTiming: "Prabhat", category: "Vidyardhi" },
    { name: "Vidhata Appt", defaultTime: "7:30 to 8:30", preferredTiming: "Prabhat", category: "vyavsayi" },
    { name: "Takshashila (Morning)", defaultTime: "Morning", preferredTiming: "Prabhat", category: "vyavsayi" },
    { name: "Prabhat (શ્રી રામ પ્રભાત)", defaultTime: "6:30 to 7:30", preferredTiming: "Prabhat", category: "vyavsayi" },
  ],
  "Ganesh": [
    { name: "Swaminarayan Madir/ SSGIT", defaultTime: "8:00 to 9:00", preferredTiming: "Prabhat", category: "Vidyardhi" },
    { name: "Gopal tower", defaultTime: "9:00 to 10:00", preferredTiming: "Prabhat", category: "vyavsayi" },
  ],
  "Jankalyan": [
    { name: "Vasant vadi", defaultTime: "8:00 to 9:00", preferredTiming: "Prabhat", category: "vyavsayi" },
    { name: "LG Ground", defaultTime: "7:00 to 8:00", preferredTiming: "Prabhat", category: "vyavsayi" },
  ],
  "Krushnabag": [
    { name: "Mukti medan", defaultTime: "Morning", preferredTiming: "Prabhat", category: "vyavsayi" },
  ],
  "Mahalaxmi": [
    { name: "No-1, Jayhind (AMC School)", defaultTime: "8:00 to 9:00", preferredTiming: "Prabhat", category: "Vidyardhi" },
    { name: "Padmavati Soc.", defaultTime: "Evening", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Anant soc.", defaultTime: "Morning / Evening", category: "vyavsayi" },
    { name: "Dalal colony", defaultTime: "Evening", preferredTiming: "Shayam", category: "vyavsayi" },
    { name: "prabhat (Mahalaxmi)", defaultTime: "6:30 to 7:30", preferredTiming: "Prabhat", category: "vyavsayi" },
  ],
  "Manavkalyan": [
    { name: "Kalgi appt", defaultTime: "Morning", preferredTiming: "Prabhat", category: "vyavsayi" },
    { name: "Prabhat (Manavkalyan)", defaultTime: "7:00 to 8:00", preferredTiming: "Prabhat", category: "vyavsayi" },
    { name: "Maninagar", defaultTime: "7:00 to 8:00", preferredTiming: "Prabhat", category: "Vidyardhi" },
    { name: "b/h Ramkrushna Soc (Cenal Garden)", defaultTime: "7:00 to 8:00", preferredTiming: "Prabhat", category: "Vidyardhi" },
    { name: "Kalabag Society", defaultTime: "Evening 7:30 to 8:30", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Uttamnagar Garden", defaultTime: "Evening 6:30 to 7:30", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Doon School (Manav kalyan sayukta vidhyarthi)", defaultTime: "Evening 8:00 to 9:00", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "canal garden Nr. Avkar hall", defaultTime: "Evening", preferredTiming: "Shayam", category: "Vidyardhi" },
  ],
  "Ramkrushna": [
    { name: "Gopalak Flate", defaultTime: "Evening 9:00 to 10:00", preferredTiming: "Shayam", category: "vyavsayi" },
    { name: "Swaminarayan Madir BAPS", defaultTime: "Evening 8:00 to 9:00", preferredTiming: "Shayam", category: "vyavsayi" },
    { name: "Ram krishna prabhat Shakha", defaultTime: "Morning 6:30 to 7:30", preferredTiming: "Prabhat", category: "vyavsayi" },
  ],
  "Sardar": [
    { name: "Shivani Appetment, Nr. Ishwar nagar", defaultTime: "Evening 9:00 to 10:00", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Siddheswar shakha", defaultTime: "Morning 6:30 to 7:30", preferredTiming: "Prabhat", category: "vyavsayi" },
    { name: "Chandranagar", defaultTime: "Evening", preferredTiming: "Shayam", category: "Vidyardhi" },
    { name: "Azad sayukta vidyarthi shakha", defaultTime: "Evening 8:00 to 9:00", preferredTiming: "Shayam", category: "Vidyardhi" },
  ],
  "Vallabhvadi": [
    { name: "Rashmi Shukla Garden, Vallabhvadi", defaultTime: "Evening 8:00 to 9:00", preferredTiming: "Shayam", category: "Vidyardhi" },
  ],
};

// Aliases and string list for dropdown compatibility
export const VASTI_STHAN_DATA: Record<string, string[]> = Object.fromEntries(
  Object.entries(VASTI_CONFIG).map(([vasti, sthans]) => [
    vasti,
    sthans.map((s) => s.name),
  ])
);

// Add support for "Sardar Vasti" and "Ganesh vasti" aliases so both work seamlessly
VASTI_STHAN_DATA["Sardar Vasti"] = VASTI_STHAN_DATA["Sardar"];
VASTI_STHAN_DATA["Ganesh vasti"] = VASTI_STHAN_DATA["Ganesh"];

export const VASTI_LIST = Object.keys(VASTI_CONFIG);

export const TIMING_OPTIONS = ["Prabhat", "Shayam"] as const;
export type TimingOption = (typeof TIMING_OPTIONS)[number];

export const VALID_DATES = [
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
  "2026-10-05",
  "2026-10-06",
  "2026-10-07",
  "2026-10-08",
] as const;

export interface MahattamSakhaEntry {
  id?: string;
  reporter_name: string;
  date: string;
  vasti: string;
  sthan: string;
  timing: TimingOption;
  tarun: number;
  bal: number;
  yog: number; // calculated as tarun + bal
  shishu: number;
  notes?: string;
  created_at?: string;
}
