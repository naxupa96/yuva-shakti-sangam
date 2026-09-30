/**
 * Vasti & Sthan Data Mapping for Mahattam Shakha
 * Extracted directly from the verified spreadsheet
 */

export interface VastiMapping {
  vasti: string;
  sthans: string[];
}

export const VASTI_STHAN_DATA: Record<string, string[]> = {
  "Chitrakut": [
    "Shripad Vadi",
    "Lili lotus",
    "Takshashila",
    "Mangal Bhuvan",
    "Guriji bridge",
    "Vidhata Appt",
    "શ્રી રામ પ્રભાત",
  ],
  "Ganesh": [
    "Swaminarayan Madir/ SSGIT",
    "Gopal tower",
  ],
  "Mahalaxmi": [
    "Amc School, Jayhind",
    "Padmavati Soc.",
    "Anant soc.",
    "Dalal colony",
  ],
  "Manavkalyan": [
    "Suryasity",
    "Cenal Garden, b/h Ramkrushna Soc",
    "Kalabag Society",
    "Uttamnagar Garden",
    "Doon School (Shakha Sthan)",
    "canal garden  Nr. Avkar hall",
    "Ghanshyam bag Soc",
    "Kalgi appt",
  ],
  "Sardar": [
    "Shiv Raw House",
    "Siddheswar shakha",
    "Chunaravas",
    "Chandranagar",
  ],
  "Vallabhvadi": [
    "Amc Garden, Vallabhvadi",
  ],
  "Jankalyan": [
    "Vasant vadi",
    "LG Ground",
  ],
  "Ramkrushna": [
    "prernapark",
    "Gopalak Flate",
    "Swaminarayan Madir BAPS",
  ],
  "Krushnabag": [
    "Mukti medan",
  ],
};

export const VASTI_LIST = Object.keys(VASTI_STHAN_DATA);

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
