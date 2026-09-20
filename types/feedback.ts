export interface EventFeedback {
  id: string;
  participant_id: string;
  registration_id: string;
  participant_name: string;
  participant_phone: string;
  rating: number; // 1 to 5
  feedback_text: string;
  created_at: string;
  updated_at?: string;
  city?: string;
  college?: string;
  checked_in?: boolean;
}

export interface FeedbackStats {
  average_rating: number;
  total_feedback: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
  checked_in_feedback_count: number;
}
