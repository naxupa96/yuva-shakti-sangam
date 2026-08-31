export type PaymentMethod = "online" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type StaffRole = "admin" | "finance" | "checkin";
export type CheckInMethod = "qr_scan" | "manual_search";

export interface Participant {
  id: string;
  registration_id: string;
  name: string;
  email: string | null;
  phone: string;
  age: number;
  city: string;
  college?: string | null;
  referral_source?: string | null;
  samvaad_question?: string | null;
  interests?: string[] | string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  qr_token: string;
  checked_in: boolean;
  check_in_time?: string | null;
  checked_in_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  participant_id: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway?: string | null;
  gateway_order_id?: string | null;
  gateway_payment_id?: string | null;
  gateway_signature?: string | null;
  recorded_by?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  participant_id: string;
  checked_in_at: string;
  checked_in_by?: string | null;
  method: CheckInMethod;
  device_info?: string | null;
  notes?: string | null;
}

export interface StaffMember {
  id: string;
  email: string;
  full_name?: string | null;
  role: StaffRole;
  created_at: string;
  updated_at: string;
}

export interface RegistrationInput {
  name: string;
  email?: string;
  phone: string;
  age: number | "";
  city: string;
  college?: string;
  referral_source?: string;
  samvaad_question?: string;
  interests?: string[];
  payment_method: PaymentMethod;
}

export interface RegistrationResponse {
  success: boolean;
  participant?: Participant;
  payment_order?: {
    order_id: string;
    amount: number;
    currency: string;
    key_id?: string;
    mock_mode?: boolean;
  };
  error?: string;
}

export interface DashboardStats {
  total_registered: number;
  total_paid: number;
  total_pending: number;
  total_checked_in: number;
  check_in_percentage: number;
  online_paid_count: number;
  cash_paid_count: number;
  cash_pending_count: number;
  online_revenue: number;
  cash_revenue: number;
  total_revenue: number;
  pending_cash_amount: number;
  total_questions?: number;
  checked_in_questions?: number;
}
